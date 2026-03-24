import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '../../../../lib/supabase/server';
import { isValidUUID, isValidRole, sanitizeString } from '../../../../lib/validateInput';

// GET /api/admin/users
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

    // Verify user is admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || profile.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data: profiles, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (fetchError) {
        return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const users = profiles.map(p => ({
        id: p.id,
        name: p.name || 'User',
        email: p.email,
        role: p.role,
        avatar: p.avatar,
        walletBalance: p.wallet_balance || 0,
        createdAt: new Date(p.created_at),
        storeName: p.store_name,
        purchasedProductIds: [],
    }));

    return NextResponse.json(users);
}

// PUT /api/admin/users/[id] — To update roles
export async function PUT(req: NextRequest) {
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

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

    if (!profile || profile.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { userId, role } = body;

    // Input validation
    if (!isValidUUID(userId)) {
        return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }

    if (!isValidRole(role)) {
        return NextResponse.json({ error: 'Invalid role. Must be one of: buyer, seller, admin' }, { status: 400 });
    }

    const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: sanitizeString(role) })
        .eq('id', userId);

    if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'User updated' });
}

