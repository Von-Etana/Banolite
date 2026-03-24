/**
 * Paystack Webhook Handler — Hardened
 *
 * Flow:
 * 1. Verify HMAC-SHA512 signature
 * 2. Log event to webhook_events table
 * 3. Check idempotency (skip duplicates)
 * 4. Process event immediately (inline) with queue fallback
 * 5. Return 200 to Paystack immediately
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { processWebhookEvent } from '../../../../lib/eventProcessor';

export const runtime = 'nodejs';

function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

export async function POST(req: NextRequest) {
    const supabase = getAdminClient();

    // ─── 1. Verify Paystack Signature ─────────────────────────────
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
        console.error('[Webhook] Missing PAYSTACK_SECRET_KEY');
        return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const signature = req.headers.get('x-paystack-signature');
    if (!signature) {
        console.error('[Webhook] Missing x-paystack-signature header');
        return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const bodyText = await req.text();
    const hash = crypto.createHmac('sha512', secret).update(bodyText).digest('hex');

    if (hash !== signature) {
        console.error('[Webhook] Invalid Paystack signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // ─── 2. Parse Event ───────────────────────────────────────────
    let event: any;
    try {
        event = JSON.parse(bodyText);
    } catch {
        console.error('[Webhook] Failed to parse JSON body');
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const eventType = event.event || 'unknown';
    const reference = event.data?.reference || event.data?.id || crypto.randomUUID();
    const idempotencyKey = `${eventType}:${reference}`;

    // ─── 3. Log Event & Check Idempotency ─────────────────────────
    // Check if we've already seen this exact event
    const { data: existing } = await supabase
        .from('webhook_events')
        .select('id, status')
        .eq('idempotency_key', idempotencyKey)
        .single();

    if (existing) {
        console.log(`[Webhook] Duplicate event ${idempotencyKey} (status: ${existing.status}). Ignoring.`);
        return NextResponse.json({ message: 'Already processed', eventId: existing.id }, { status: 200 });
    }

    // Insert new event into the queue
    const { data: webhookEvent, error: insertError } = await supabase
        .from('webhook_events')
        .insert({
            idempotency_key: idempotencyKey,
            event_type: eventType,
            payload: event,
            status: 'received',
        })
        .select()
        .single();

    if (insertError) {
        // If it's a unique constraint violation, another concurrent request beat us
        if (insertError.code === '23505') {
            console.log(`[Webhook] Race condition duplicate for ${idempotencyKey}. Ignoring.`);
            return NextResponse.json({ message: 'Already processed' }, { status: 200 });
        }
        console.error('[Webhook] Failed to log event:', insertError.message);
        return NextResponse.json({ error: 'Failed to log event' }, { status: 500 });
    }

    // ─── 4. Process Immediately (Inline) ──────────────────────────
    // Try to process now. If it fails, the cron job will pick it up for retry.
    try {
        await processWebhookEvent(webhookEvent);
    } catch (error: any) {
        // Don't return an error to Paystack — the event is queued for retry
        console.error(`[Webhook] Inline processing failed for ${idempotencyKey}:`, error.message);
        // The processWebhookEvent function already handles updating the
        // event status and scheduling retries internally
    }

    // ─── 5. Return 200 to Paystack ───────────────────────────────
    return NextResponse.json(
        { received: true, eventId: webhookEvent.id },
        { status: 200 }
    );
}
