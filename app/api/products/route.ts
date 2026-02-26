import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '../../../lib/supabase/server';

// GET /api/products — List all products (public)
export async function GET(req: NextRequest) {
    const supabase = createServerClient();
    const { searchParams } = new URL(req.url);

    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const creatorId = searchParams.get('creatorId');
    const search = searchParams.get('search');

    let query = supabase.from('products').select('*').order('created_at', { ascending: false });

    if (type) query = query.eq('type', type);
    if (category) query = query.eq('category', category);
    if (creatorId) query = query.eq('creator_id', creatorId);
    if (search) query = query.ilike('title', `%${search}%`);

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
}

// POST /api/products — Create a new product (seller only)
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

    // Check user is a seller
    const { data: profile } = await supabase.from('profiles').select('role, name').eq('id', user.id).single();
    if (!profile || profile.role === 'buyer') {
        return NextResponse.json({ error: 'Only sellers can create products' }, { status: 403 });
    }

    const body = await req.json();

    const { data: product, error } = await supabase
        .from('products')
        .insert({
            title: body.title,
            creator: profile.name,
            creator_id: user.id,
            price: body.price || 0,
            description: body.description || '',
            cover_url: body.coverUrl || '',
            color: body.color || 'bg-gray-100',
            tags: body.tags || [],
            category: body.category || null,
            discount_offer: body.discountOffer || null,
            type: body.type || 'EBOOK',
            lessons: body.lessons || null,
            duration: body.duration || null,
            event_date: body.eventDate || null,
            event_location: body.eventLocation || null,
            tickets_available: body.ticketsAvailable || null,
            billing_period: body.billingPeriod || null,
            file_url: body.fileUrl || null,
            file_size: body.fileSize || null,
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(product, { status: 201 });
}
