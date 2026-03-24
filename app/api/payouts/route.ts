/**
 * Payouts API — Hardened
 *
 * Uses atomic wallet decrement (RPC) to prevent race conditions
 * and validates input with the shared validation utility.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validatePayoutPayload } from '../../../lib/validateInput';

// Initialize Supabase admin client for secure operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // ─── Input Validation ─────────────────────────────────────
        const body = await req.json();
        const validation = validatePayoutPayload(body);

        if (!validation.valid || !validation.data) {
            return NextResponse.json({ error: validation.error || 'Invalid request' }, { status: 400 });
        }

        const { amount, bankDetails } = validation.data;

        // 1. Fetch user's profile to verify role
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('wallet_balance, role')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        // Only sellers can request payouts
        if (profile.role !== 'seller') {
            return NextResponse.json({ error: 'Only sellers can request payouts' }, { status: 403 });
        }

        // 2. ATOMIC balance deduction — prevents race conditions
        //    The RPC returns FALSE if insufficient balance
        const { data: success, error: rpcError } = await supabaseAdmin
            .rpc('decrement_wallet_balance', {
                p_user_id: user.id,
                p_amount: amount,
            });

        if (rpcError) {
            console.error('[Payout] RPC decrement failed:', rpcError.message);
            return NextResponse.json({ error: 'Failed to process balance' }, { status: 500 });
        }

        if (!success) {
            return NextResponse.json({ error: 'Insufficient wallet balance' }, { status: 400 });
        }

        // 3. Create pending payout record
        const { data: payout, error: payoutError } = await supabaseAdmin
            .from('payouts')
            .insert({
                user_id: user.id,
                amount: amount,
                status: 'pending',
                bank_details: bankDetails,
            })
            .select()
            .single();

        if (payoutError) {
            // Rollback: re-add the balance using atomic increment
            await supabaseAdmin.rpc('increment_wallet_balance', {
                p_user_id: user.id,
                p_amount: amount,
            });

            return NextResponse.json({ error: 'Failed to create payout record' }, { status: 500 });
        }

        // 4. Create notification for user
        await supabaseAdmin.from('notifications').insert([
            {
                user_id: user.id,
                type: 'payout',
                message: `Your withdrawal request for ₦${amount.toLocaleString()} is pending approval.`,
                read: false,
            },
        ]);

        // Fetch updated balance
        const { data: updatedProfile } = await supabaseAdmin
            .from('profiles')
            .select('wallet_balance')
            .eq('id', user.id)
            .single();

        return NextResponse.json(
            { success: true, payout, newBalance: updatedProfile?.wallet_balance ?? 0 },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Payout Request Error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred processing your payout' },
            { status: 500 }
        );
    }
}
