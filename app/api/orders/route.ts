import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '../../../lib/supabase/server';
import { sendOrderReceipt, sendSellerSaleNotification } from '../../../lib/resend';

// POST /api/orders — Create an order after successful payment
export async function POST(req: NextRequest) {
    try {
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
                user_id: user.id || 'guest',
                total,
                status: 'pending', // Webhook will change this to completed
                payment_method: paymentMethod || 'paystack',
                payment_ref: paymentRef || null,
                email: email || user.email,
            })
            .select()
            .single();

        if (orderError || !order) {
            return NextResponse.json({ error: orderError?.message || 'Failed to create order' }, { status: 500 });
        }

        // 2. Create order items (We must insert them now so the webhook knows what to fulfill)
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

        // We do NOT fulfill the items here anymore.
        // We wait for the Paystack webhook to trigger `charge.success` with this `order.id` as the reference.

        return NextResponse.json(order, { status: 201 });
    } catch (error: any) {
        console.error('API Error POST /api/orders:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

// GET /api/orders — Get user's orders
export async function GET(req: NextRequest) {
    try {
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
    } catch (error: any) {
        console.error('API Error GET /api/orders:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
