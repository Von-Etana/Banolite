import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '../../../../lib/supabase/server';

export async function GET(req: NextRequest) {
    const supabase = createServerClient();
    
    // Auth Check
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Role Check
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || profile.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get Platform Revenue Stats
    const { data, error } = await supabase.from('platform_revenue').select('amount');
    
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const totalRevenue = data.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    return NextResponse.json({
        totalRevenue,
        count: data.length,
        currency: 'NGN' // Assuming majority NGN, could breakdown by currency
    });
}
