/**
 * Cron: Process Webhook Event Queue
 *
 * Called periodically (e.g., every minute via Vercel Cron) to process
 * pending webhook events, retry failed ones, and clean up stale data.
 *
 * Protected by a CRON_SECRET to prevent unauthorized access.
 */

import { NextRequest, NextResponse } from 'next/server';
import { processEventQueue } from '../../../../lib/eventProcessor';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    // Verify cron secret to prevent unauthorized access
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const result = await processEventQueue();

        return NextResponse.json({
            success: true,
            ...result,
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        console.error('[Cron:ProcessQueue] Error:', error.message);
        return NextResponse.json(
            { error: 'Queue processing failed', details: error.message },
            { status: 500 }
        );
    }
}
