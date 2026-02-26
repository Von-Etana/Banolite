import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '../../../lib/supabase/server';

// POST /api/reviews — Create a review
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
    const { productId, rating, comment } = body;

    if (!productId || !rating) {
        return NextResponse.json({ error: 'Missing productId or rating' }, { status: 400 });
    }

    // Get user name
    const { data: profile } = await supabase.from('profiles').select('name').eq('id', user.id).single();

    const { data: review, error } = await supabase
        .from('reviews')
        .insert({
            product_id: productId,
            user_id: user.id,
            user_name: profile?.name || 'Anonymous',
            rating,
            comment: comment || '',
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update product average rating
    const { data: allReviews } = await supabase.from('reviews').select('rating').eq('product_id', productId);
    if (allReviews && allReviews.length > 0) {
        const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
        await supabase.from('products').update({ rating: Math.round(avg * 100) / 100 }).eq('id', productId);
    }

    // Notify the product creator
    const { data: product } = await supabase.from('products').select('creator_id, title').eq('id', productId).single();
    if (product && product.creator_id !== user.id) {
        await supabase.from('notifications').insert({
            user_id: product.creator_id,
            type: 'review',
            message: `${profile?.name || 'Someone'} left a ${rating}★ review on "${product.title}"`,
            link: `/book/${productId}`,
        });
    }

    return NextResponse.json(review, { status: 201 });
}

// GET /api/reviews?productId=xxx — Get reviews for a product
export async function GET(req: NextRequest) {
    const supabase = createServerClient();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
        return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
}
