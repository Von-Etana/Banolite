import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '../../../../lib/supabase/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const supabase = createServerClient();
        const orderId = params.id;

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
        }

        const { data: order, error } = await supabase
            .from('orders')
            .select('status, id, created_at')
            .eq('id', orderId)
            .single();

        if (error || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order, { status: 200 });
    } catch (error: any) {
        console.error('API Error /api/orders/[id]:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
