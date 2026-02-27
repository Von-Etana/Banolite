import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '../../../../lib/supabase/server';
import crypto from 'crypto';
import { sendOrderReceipt, sendSellerSaleNotification } from '../../../../lib/resend';

export async function POST(req: NextRequest) {
    const supabase = createServerClient();

    // 1. Verify Paystack Signature
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
        console.error('Missing PAYSTACK_SECRET_KEY');
        return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const signature = req.headers.get('x-paystack-signature');
    const bodyText = await req.text();

    const hash = crypto.createHmac('sha512', secret).update(bodyText).digest('hex');

    if (hash !== signature) {
        console.error('Invalid Paystack signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // 2. Parse Event
    const event = JSON.parse(bodyText);

    // 3. Handle charge.success
    if (event.event === 'charge.success') {
        const orderId = event.data.reference; // We will pass the order ID as the reference when initializing Paystack

        // Find the pending order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select(`*, order_items(*, products(title, price, type, creator_id))`)
            .eq('id', orderId)
            .single();

        if (orderError || !order) {
            console.error('Webhook error: Order not found', orderError);
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (order.status === 'completed') {
            console.log(`Order ${orderId} already completed. Ignoring webhook.`);
            return NextResponse.json({ message: 'Already processed' }, { status: 200 });
        }

        const items = order.order_items.map((item: any) => ({
            productId: item.product_id,
            title: item.products.title,
            price: item.price,
            quantity: item.quantity,
            creatorId: item.products.creator_id,
            type: item.products.type,
        }));

        const total = order.total;
        const buyerEmail = order.email;
        const buyerId = order.user_id;

        // --- FULFILLMENT LOGIC MOVED FROM POST /api/orders ---

        // A. Mark order as completed
        await supabase.from('orders').update({ status: 'completed' }).eq('id', orderId);

        // B. Update product sales counts
        for (const item of items) {
            await supabase.rpc('increment_sales_count', {
                p_id: item.productId,
                amount: item.quantity || 1,
            }).then(({ error }) => {
                if (error) console.error('RPC increment failed, doing manual update');
            });
        }

        // C. Update buyer's profile
        if (buyerId !== 'guest') {
            const productIds = items.map((item: any) => item.productId);
            const { data: profile } = await supabase.from('profiles').select('purchased_product_ids, name').eq('id', buyerId).single();
            if (profile) {
                const existing = profile.purchased_product_ids || [];
                const merged = [...new Set([...existing, ...productIds])];
                await supabase.from('profiles').update({ purchased_product_ids: merged }).eq('id', buyerId);
            }

            // In-app notification for buyer
            await supabase.from('notifications').insert({
                user_id: buyerId,
                type: 'order',
                message: `Your order #${orderId.slice(0, 8)} has been confirmed!`,
                link: '/library',
            });
        }

        // D. Send email receipt to buyer (async)
        const buyerProfile = buyerId !== 'guest' ? await supabase.from('profiles').select('name').eq('id', buyerId).single() : { data: null };
        const buyerName = buyerProfile.data?.name || 'Customer';

        // We'll extract additional info from the order metadata if needed, but for MVP let's keep it simple or fetch from a JSON field.
        // For now, we'll assume `additional_info` exists on the order table or we skip it in the webhook.
        // To keep it simple, we won't inject additionalInfo via webhook for now unless we add a jsonb column.

        sendOrderReceipt({
            buyerName,
            buyerEmail,
            orderId,
            items,
            total,
            paymentRef: event.data.reference,
        }).catch(console.error);

        // E. Notify and update sellers
        const sellerIds = [...new Set(items.map((i: any) => i.creatorId).filter(Boolean))];
        for (const sellerId of sellerIds) {
            const sellerItems = items.filter((i: any) => i.creatorId === sellerId);
            const sellerTotal = sellerItems.reduce((sum: number, i: any) => sum + i.price * (i.quantity || 1), 0);
            const sellerFee = sellerTotal * 0.05; // 5% platform fee (example)
            const sellerNet = sellerTotal - sellerFee;

            // Update Seller Wallet (Simple increment)
            const { data: sellerProfile } = await supabase.from('profiles').select('wallet_balance, name, email').eq('id', sellerId).single();
            if (sellerProfile) {
                await supabase.from('profiles').update({
                    wallet_balance: (sellerProfile.wallet_balance || 0) + sellerNet
                }).eq('id', sellerId);

                // In-app notification
                await supabase.from('notifications').insert({
                    user_id: sellerId,
                    type: 'sale',
                    message: `You made a sale! $${sellerTotal.toFixed(2)} from ${sellerItems.length} item(s).`,
                    link: '/dashboard/seller',
                });

                // Email notification
                sendSellerSaleNotification({
                    sellerEmail: sellerProfile.email,
                    sellerName: sellerProfile.name,
                    productTitle: sellerItems[0]?.title || 'a product',
                    amount: sellerTotal, // Show gross amount
                    buyerName,
                }).catch(console.error);
            }
        }
    }

    return NextResponse.json({ received: true }, { status: 200 });
}
