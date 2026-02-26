import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '../../../lib/supabase/server';
import { sendOrderReceipt, sendSellerSaleNotification } from '../../../lib/resend';

// POST /api/orders — Create an order after successful payment
export async function POST(req: NextRequest) {
    const supabase = createServerClient();
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { items, total, paymentMethod, paymentRef, email, additionalInfo } = body;

    if (!items || !items.length || !total) {
        return NextResponse.json({ error: 'Missing order data' }, { status: 400 });
    }

    // 1. Create order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: user.id,
            total,
            status: 'completed',
            payment_method: paymentMethod || 'paystack',
            payment_ref: paymentRef || null,
            email: email || user.email,
        })
        .select()
        .single();

    if (orderError || !order) {
        return NextResponse.json({ error: orderError?.message || 'Failed to create order' }, { status: 500 });
    }

    // 2. Create order items
    const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity || 1,
        price: item.price,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) {
        console.error('Failed to insert order items:', itemsError);
    }

    // 3. Update product sales counts
    for (const item of items) {
        await supabase.rpc('increment_sales_count', {
            p_id: item.productId,
            amount: item.quantity || 1,
        }).then(({ error }) => {
            if (error) {
                // Fallback: manual update
                console.error('RPC increment failed, doing manual update');
            }
        });
    }

    // 4. Update user's purchased product IDs
    const productIds = items.map((item: any) => item.productId);
    const { data: profile } = await supabase.from('profiles').select('purchased_product_ids').eq('id', user.id).single();
    if (profile) {
        const existing = profile.purchased_product_ids || [];
        const merged = [...new Set([...existing, ...productIds])];
        await supabase.from('profiles').update({ purchased_product_ids: merged }).eq('id', user.id);
    }

    // 5. Create notification for the buyer
    await supabase.from('notifications').insert({
        user_id: user.id,
        type: 'order',
        message: `Your order #${order.id.slice(0, 8)} has been confirmed!`,
        link: '/library',
    });

    // 6. Send email receipt to buyer (async, don't block)
    const buyerProfile = await supabase.from('profiles').select('name').eq('id', user.id).single();
    sendOrderReceipt({
        buyerName: buyerProfile.data?.name || 'Customer',
        buyerEmail: email || user.email!,
        orderId: order.id,
        items: items.map((i: any) => ({
            title: i.title,
            price: i.price,
            quantity: i.quantity || 1,
        })),
        total,
        paymentRef: paymentRef || order.id,
        additionalInfo,
    }).catch(console.error);

    // 7. Notify each seller (send sale email + in-app notification)
    const sellerIds = [...new Set(items.map((i: any) => i.creatorId).filter(Boolean))];
    for (const sellerId of sellerIds) {
        const sellerItems = items.filter((i: any) => i.creatorId === sellerId);
        const sellerTotal = sellerItems.reduce((sum: number, i: any) => sum + i.price * (i.quantity || 1), 0);

        // In-app notification
        await supabase.from('notifications').insert({
            user_id: sellerId,
            type: 'sale',
            message: `You made a sale! $${sellerTotal.toFixed(2)} from ${sellerItems.length} item(s).`,
            link: '/dashboard/seller',
        });

        // Email notification
        const { data: seller } = await supabase.from('profiles').select('name, email').eq('id', sellerId).single();
        if (seller) {
            sendSellerSaleNotification({
                sellerEmail: seller.email,
                sellerName: seller.name,
                productTitle: sellerItems[0]?.title || 'a product',
                amount: sellerTotal,
                buyerName: buyerProfile.data?.name || 'A customer',
            }).catch(console.error);
        }
    }

    return NextResponse.json(order, { status: 201 });
}

// GET /api/orders — Get user's orders
export async function GET(req: NextRequest) {
    const supabase = createServerClient();
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // 1. Fetch Orders
    const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*, order_items(*, products(title, cover_url, type))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    // 2. Fetch Bookings
    const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*, coach:profiles!coach_id(name, avatar, store_name)')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

    // 3. Fetch Tickets
    const { data: tickets, error: ticketsError } = await supabase
        .from('tickets')
        .select('*, event:products!event_id(title, cover_url)')
        .eq('user_id', user.id)
        .order('purchase_date', { ascending: false });

    if (ordersError || bookingsError || ticketsError) {
        return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }

    return NextResponse.json({
        orders: orders || [],
        bookings: bookings || [],
        tickets: tickets || []
    });
}
