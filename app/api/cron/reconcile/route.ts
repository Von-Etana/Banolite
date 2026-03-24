/**
 * Cron: Daily Reconciliation
 *
 * Compares Paystack transactions with local DB orders to identify
 * discrepancies (missing orders, amount mismatches, etc.).
 *
 * Protected by CRON_SECRET.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

export async function GET(req: NextRequest) {
    // Verify cron secret
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getAdminClient();
    const today = new Date().toISOString().split('T')[0];

    try {
        // 1. Fetch completed orders from DB (last 24h)
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        const { data: dbOrders, error: dbError } = await supabase
            .from('orders')
            .select('id, total, status, created_at')
            .gte('created_at', yesterday)
            .in('status', ['completed', 'processing', 'pending']);

        if (dbError) throw new Error(`DB query failed: ${dbError.message}`);

        // 2. Fetch successful webhook events (last 24h)
        const { data: webhookEvents, error: whError } = await supabase
            .from('webhook_events')
            .select('id, idempotency_key, payload, status')
            .gte('created_at', yesterday)
            .eq('event_type', 'charge.success');

        if (whError) throw new Error(`Webhook events query failed: ${whError.message}`);

        // 3. Compare and find discrepancies
        const discrepancies: any[] = [];

        // Check: webhook events that never resulted in completed orders
        const completedOrderIds = new Set(
            (dbOrders || []).filter(o => o.status === 'completed').map(o => o.id)
        );

        for (const we of (webhookEvents || [])) {
            const reference = we.payload?.data?.reference;
            if (reference && !completedOrderIds.has(reference) && we.status === 'completed') {
                discrepancies.push({
                    type: 'webhook_no_order',
                    webhookEventId: we.id,
                    reference,
                    message: `Webhook processed successfully but order ${reference} is not completed in DB`,
                });
            }
        }

        // Check: stale pending/processing orders (>1h old)
        for (const order of (dbOrders || [])) {
            if (['pending', 'processing'].includes(order.status)) {
                const orderAge = Date.now() - new Date(order.created_at).getTime();
                if (orderAge > 60 * 60 * 1000) { // > 1 hour
                    discrepancies.push({
                        type: 'stale_order',
                        orderId: order.id,
                        status: order.status,
                        total: order.total,
                        message: `Order stuck in "${order.status}" state for over 1 hour`,
                    });
                }
            }
        }

        // Check: dead-letter events
        const { data: deadLetters } = await supabase
            .from('webhook_events')
            .select('id, idempotency_key, error_message')
            .gte('created_at', yesterday)
            .eq('status', 'dead_letter');

        for (const dl of (deadLetters || [])) {
            discrepancies.push({
                type: 'dead_letter',
                webhookEventId: dl.id,
                idempotencyKey: dl.idempotency_key,
                message: `Event permanently failed: ${dl.error_message}`,
            });
        }

        // 4. Log reconciliation result
        const status = discrepancies.length === 0 ? 'completed' : 'completed';
        const summary = discrepancies.length === 0
            ? `Reconciliation passed. ${(dbOrders || []).length} orders, ${(webhookEvents || []).length} webhook events — no discrepancies.`
            : `Found ${discrepancies.length} discrepancies across ${(dbOrders || []).length} orders and ${(webhookEvents || []).length} webhook events.`;

        await supabase.from('reconciliation_logs').insert({
            run_date: today,
            status,
            total_paystack_transactions: (webhookEvents || []).length,
            total_db_orders: (dbOrders || []).length,
            discrepancies,
            summary,
        });

        // 5. Notify admin if discrepancies found
        if (discrepancies.length > 0) {
            // Find admin users
            const { data: admins } = await supabase
                .from('profiles')
                .select('id')
                .eq('role', 'admin');

            for (const admin of (admins || [])) {
                await supabase.from('notifications').insert({
                    user_id: admin.id,
                    type: 'system',
                    message: `⚠️ Reconciliation alert: ${discrepancies.length} discrepancies found. Check reconciliation logs.`,
                    link: '/dashboard/admin',
                });
            }
        }

        return NextResponse.json({
            success: true,
            runDate: today,
            totalOrders: (dbOrders || []).length,
            totalWebhookEvents: (webhookEvents || []).length,
            discrepanciesCount: discrepancies.length,
            discrepancies,
            summary,
        });
    } catch (error: any) {
        console.error('[Cron:Reconcile] Error:', error.message);

        // Log failed reconciliation
        await supabase.from('reconciliation_logs').insert({
            run_date: today,
            status: 'failed',
            summary: `Reconciliation failed: ${error.message}`,
        });

        return NextResponse.json(
            { error: 'Reconciliation failed', details: error.message },
            { status: 500 }
        );
    }
}
