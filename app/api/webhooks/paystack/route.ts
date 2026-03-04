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
            id: item.id, // Keep the order_item.id
            productId: item.product_id,
            title: item.products.title,
            price: item.price,
            quantity: item.quantity,
            creatorId: item.products.creator_id,
            type: item.products.type,
            metadata: item.metadata,
        }));

        const total = order.total;
        const buyerEmail = order.email;
        const buyerId = order.user_id;
        const affiliateId = order.affiliate_id;

        // --- FULFILLMENT LOGIC MOVED FROM POST /api/orders ---

        // A. Mark order as completed
        await supabase.from('orders').update({ status: 'completed' }).eq('id', orderId);

        let emailAdditionalInfo: any = {};

        // B. Update product sales counts and generate Bookings/Tickets
        for (const item of items) {
            await supabase.rpc('increment_sales_count', {
                p_id: item.productId,
                amount: item.quantity || 1,
            }).then(({ error }) => {
                if (error) console.error('RPC increment failed, doing manual update');
            });

            // If it's a Coaching session, generate a booking
            if (item.type === 'COACHING' && item.metadata?.bookingDate && item.metadata?.coachId) {
                // Generate X bookings based on quantity
                for (let i = 0; i < (item.quantity || 1); i++) {
                    const meetLink = `https://meet.google.com/${crypto.randomBytes(4).toString('hex')}`;
                    await supabase.from('bookings').insert({
                        user_id: buyerId !== 'guest' ? buyerId : null,
                        coach_id: item.metadata.coachId,
                        order_item_id: item.id,
                        date: item.metadata.bookingDate,
                        status: 'upcoming',
                        meet_link: meetLink,
                        amount: item.price
                    });

                    // Capture for email receipt
                    emailAdditionalInfo.bookingDate = item.metadata.bookingDate;
                    emailAdditionalInfo.meetLink = meetLink;
                }
            }

            // If it's a Ticket, generate event tickets
            if (item.type === 'TICKET') {
                for (let i = 0; i < (item.quantity || 1); i++) {
                    const qrCode = `QR-${orderId.slice(0, 8)}-${item.id.slice(0, 4)}-${i}`;
                    await supabase.from('tickets').insert({
                        user_id: buyerId !== 'guest' ? buyerId : null,
                        event_id: item.productId,
                        order_item_id: item.id,
                        qr_code: qrCode,
                        status: 'valid',
                        amount: item.price
                    });

                    // Capture for email receipt
                    emailAdditionalInfo.qrCode = qrCode;
                }
            }
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

        // We mapped newly generated links and codes into `emailAdditionalInfo` during fulfillment.
        sendOrderReceipt({
            buyerName,
            buyerEmail,
            orderId,
            items,
            total,
            paymentRef: event.data.reference,
            additionalInfo: emailAdditionalInfo,
        }).catch(console.error);

        // E. Notify and update sellers
        const sellerIds = [...new Set(items.map((i: any) => i.creatorId).filter(Boolean))];

        // Extract Affiliate Details if present
        let commissionRate = 0;
        let affiliateUserId = null;

        if (affiliateId) {
            const { data: affData } = await supabase.from('affiliates').select('user_id, commission_rate').eq('id', affiliateId).single();
            if (affData) {
                commissionRate = affData.commission_rate || 0;
                affiliateUserId = affData.user_id;

                // Update affiliate conversions
                const { data: currentAff } = await supabase.from('affiliates').select('conversions').eq('id', affiliateId).single();
                if (currentAff) {
                    await supabase.from('affiliates').update({ conversions: (currentAff.conversions || 0) + 1 }).eq('id', affiliateId);
                }
            }
        }

        for (const sellerId of sellerIds) {
            const sellerItems = items.filter((i: any) => i.creatorId === sellerId);
            const sellerTotal = sellerItems.reduce((sum: number, i: any) => sum + i.price * (i.quantity || 1), 0);
            const platformFee = sellerTotal * 0.05; // 5% platform fee (example)

            let affiliateCommission = 0;
            if (affiliateUserId && commissionRate > 0) {
                affiliateCommission = sellerTotal * (commissionRate / 100);
            }

            const sellerNet = sellerTotal - platformFee - affiliateCommission;

            // Update Seller Wallet
            const { data: sellerProfile } = await supabase.from('profiles').select('wallet_balance, name, email').eq('id', sellerId).single();
            if (sellerProfile) {
                await supabase.from('profiles').update({
                    wallet_balance: (sellerProfile.wallet_balance || 0) + sellerNet
                }).eq('id', sellerId);

                // In-app notification
                await supabase.from('notifications').insert({
                    user_id: sellerId,
                    type: 'sale',
                    message: `You made a sale! ₦${sellerTotal.toFixed(2)} from ${sellerItems.length} item(s).${affiliateCommission > 0 ? ` (₦${affiliateCommission.toFixed(2)} paid to affiliate)` : ''}`,
                    link: '/store',
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

            // Update Affiliate Wallet
            if (affiliateUserId && affiliateCommission > 0) {
                const { data: affProfile } = await supabase.from('profiles').select('wallet_balance, affiliate_earnings').eq('id', affiliateUserId).single();
                if (affProfile) {
                    await supabase.from('profiles').update({
                        wallet_balance: (affProfile.wallet_balance || 0) + affiliateCommission,
                        affiliate_earnings: (affProfile.affiliate_earnings || 0) + affiliateCommission
                    }).eq('id', affiliateUserId);

                    // Notify affiliate
                    await supabase.from('notifications').insert({
                        user_id: affiliateUserId,
                        type: 'sale',
                        message: `You earned ₦${affiliateCommission.toFixed(2)} in affiliate commission!`,
                        link: '/dashboard',
                    });
                }
            }
        }
    }

    return NextResponse.json({ received: true }, { status: 200 });
}
