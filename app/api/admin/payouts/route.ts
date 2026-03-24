import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

        const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 });

        const { data: payouts, error: fetchError } = await supabaseAdmin
            .from('payouts')
            .select('*, profiles!payouts_user_id_fkey(name, email)')
            .order('created_at', { ascending: false });

        if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });
        return NextResponse.json({ success: true, payouts }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const token = authHeader.replace('Bearer ', '');
        const { data: { user } } = await supabaseAdmin.auth.getUser(token);
        const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user?.id).single();

        if (profile?.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 });

        const { id, action } = await req.json(); // action can be 'approve' or 'reject'
        if (!id || !action) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

        const { data: payout, error: payoutError } = await supabaseAdmin
            .from('payouts')
            .select('*')
            .eq('id', id)
            .single();

        if (payoutError || !payout) return NextResponse.json({ error: 'Payout not found' }, { status: 404 });
        if (payout.status !== 'pending') return NextResponse.json({ error: 'Payout already processed' }, { status: 400 });

        if (action === 'approve') {
            const apiKey = process.env.PAYSTACK_SECRET_KEY;
            if (!apiKey) {
                return NextResponse.json({ error: 'Paystack key not configured' }, { status: 500 });
            }

            const { bank_details: bankDetails } = payout;

            if (!bankDetails?.bankCode || !bankDetails?.accountNumber || !bankDetails?.accountName) {
                return NextResponse.json({ error: 'Incomplete bank details in payout record' }, { status: 400 });
            }

            // 1. Create Transfer Recipient
            const recipientResponse = await fetch('https://api.paystack.co/transferrecipient', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: 'nuban',
                    name: bankDetails.accountName,
                    account_number: bankDetails.accountNumber,
                    bank_code: bankDetails.bankCode,
                    currency: 'NGN'
                })
            });

            const recipientData = await recipientResponse.json();
            if (!recipientData.status) {
                return NextResponse.json({ error: `Recipient Creation Failed: ${recipientData.message}` }, { status: 400 });
            }

            const recipientCode = recipientData.data.recipient_code;

            // 2. Initiate Transfer
            const transferResponse = await fetch('https://api.paystack.co/transfer', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    source: 'balance',
                    amount: Math.round(payout.amount * 100), // amount in kobo
                    recipient: recipientCode,
                    reason: `Banolite Payout #${id.slice(0, 8)}`
                })
            });

            const transferData = await transferResponse.json();
            if (!transferData.status) {
                return NextResponse.json({ error: `Transfer Execution Failed: ${transferData.message}` }, { status: 400 });
            }

            // Update Database Payout status to 'approved'
            const { error } = await supabaseAdmin.from('payouts').update({ 
                status: 'approved',
                metadata: {
                    paystack_recipient: recipientCode,
                    paystack_transfer_code: transferData.data.transfer_code,
                    paystack_reference: transferData.data.reference
                }
            }).eq('id', id);

            if (error) throw error;

            // Notify creator
            await supabaseAdmin.from('notifications').insert({
                user_id: payout.user_id,
                type: 'payout',
                message: `Your withdrawal of ₦${payout.amount.toLocaleString()} has been approved and sent to your bank.`,
            });

        } else if (action === 'reject') {
            // Refund balance
            const { data: creator } = await supabaseAdmin.from('profiles').select('wallet_balance').eq('id', payout.user_id).single();
            const newBalance = (creator?.wallet_balance || 0) + payout.amount;

            await supabaseAdmin.from('profiles').update({ wallet_balance: newBalance }).eq('id', payout.user_id);
            await supabaseAdmin.from('payouts').update({ status: 'rejected' }).eq('id', id);

            // Notify creator
            await supabaseAdmin.from('notifications').insert({
                user_id: payout.user_id,
                type: 'payout',
                message: `Your withdrawal of ₦${payout.amount.toLocaleString()} was rejected. The funds have been returned to your wallet.`,
            });
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
