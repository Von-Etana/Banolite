-- ============================================
-- Banolite Database Schema for Supabase
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    avatar TEXT,
    role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'admin')),
    bio TEXT,
    location TEXT,
    wallet_balance NUMERIC(12, 2) NOT NULL DEFAULT 0,
    store_name TEXT,
    store_description TEXT,
    store_banner TEXT,
    social_twitter TEXT,
    social_website TEXT,
    purchased_product_ids TEXT[] DEFAULT '{}',
    affiliate_earnings NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- PRODUCTS
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    creator TEXT NOT NULL,
    creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    description TEXT,
    cover_url TEXT,
    color TEXT DEFAULT 'bg-gray-100',
    tags TEXT[] DEFAULT '{}',
    category TEXT,
    discount_offer NUMERIC(5, 2),
    rating NUMERIC(3, 2) NOT NULL DEFAULT 0,
    type TEXT NOT NULL DEFAULT 'EBOOK' CHECK (type IN ('EBOOK', 'COURSE', 'TICKET', 'SERVICE', 'SUBSCRIPTION', 'COACHING')),
    sales_count INT NOT NULL DEFAULT 0,
    lessons INT,
    duration TEXT,
    event_date TIMESTAMPTZ,
    event_location TEXT,
    tickets_available INT,
    billing_period TEXT CHECK (billing_period IN ('monthly', 'yearly')),
    file_url TEXT,
    file_size TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- AFFILIATES
-- ============================================
CREATE TABLE IF NOT EXISTS affiliates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    commission_rate NUMERIC(5, 2) NOT NULL DEFAULT 20.0,
    custom_link TEXT UNIQUE NOT NULL,
    clicks INT NOT NULL DEFAULT 0,
    conversions INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- ORDERS
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    total NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
    payment_method TEXT NOT NULL DEFAULT 'paystack',
    affiliate_id UUID REFERENCES affiliates(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    phone TEXT,
    state TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- ORDER ITEMS
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    price NUMERIC(10, 2) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- REVIEWS
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'system' CHECK (type IN ('sale', 'review', 'system', 'payout', 'order')),
    message TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT false,
    link TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- BOOKINGS
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    coach_id TEXT NOT NULL,
    order_item_id UUID REFERENCES order_items(id) ON DELETE SET NULL,
    date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
    meet_link TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TICKETS
-- ============================================
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    event_id TEXT NOT NULL,
    order_item_id UUID REFERENCES order_items(id) ON DELETE SET NULL,
    qr_code TEXT,
    status TEXT NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'used', 'refunded')),
    amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- PAYOUTS
-- ============================================
CREATE TABLE IF NOT EXISTS payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    bank_details JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Payouts RLS
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own payouts" ON payouts;
CREATE POLICY "Users can view their own payouts" ON payouts FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create payouts" ON payouts;
CREATE POLICY "Users can create payouts" ON payouts FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Admin updates are done via service role key, so no RLS policy needed for UPDATE

-- ============================================
-- SITE CONTENT (CMS)
-- ============================================
CREATE TABLE IF NOT EXISTS site_content (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- singleton row
    hero_headline TEXT NOT NULL DEFAULT 'Discover & Sell Digital Products',
    hero_subheadline TEXT NOT NULL DEFAULT 'Your hub for premium digital products, courses, and coaching.',
    about_title TEXT NOT NULL DEFAULT 'About Banolite',
    about_content TEXT NOT NULL DEFAULT 'Banolite is a modern digital marketplace.',
    platform_fee_percentage NUMERIC(5, 2) NOT NULL DEFAULT 5.0,
    platform_tax_percentage NUMERIC(5, 2) NOT NULL DEFAULT 7.5,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default site content
INSERT INTO site_content (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Sellers can insert their own products" ON products;
CREATE POLICY "Sellers can insert their own products" ON products FOR INSERT WITH CHECK (auth.uid() = creator_id);
DROP POLICY IF EXISTS "Sellers can update their own products" ON products;
CREATE POLICY "Sellers can update their own products" ON products FOR UPDATE USING (auth.uid() = creator_id);
DROP POLICY IF EXISTS "Sellers can delete their own products" ON products;
CREATE POLICY "Sellers can delete their own products" ON products FOR DELETE USING (auth.uid() = creator_id);

-- Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create orders" ON orders;
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order Items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their order items" ON order_items;
CREATE POLICY "Users can view their order items" ON order_items FOR SELECT
    USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can create order items" ON order_items;
CREATE POLICY "Users can create order items" ON order_items FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- Affiliates
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Affiliates are viewable by everyone" ON affiliates;
CREATE POLICY "Affiliates are viewable by everyone" ON affiliates FOR SELECT USING (true);
DROP POLICY IF EXISTS "Creators can insert their own affiliates" ON affiliates;
CREATE POLICY "Creators can insert their own affiliates" ON affiliates FOR INSERT WITH CHECK (auth.uid() = creator_id);
DROP POLICY IF EXISTS "Creators can update their own affiliates" ON affiliates;
CREATE POLICY "Creators can update their own affiliates" ON affiliates FOR UPDATE USING (auth.uid() = creator_id);
DROP POLICY IF EXISTS "Creators can delete their own affiliates" ON affiliates;
CREATE POLICY "Creators can delete their own affiliates" ON affiliates FOR DELETE USING (auth.uid() = creator_id);

-- Reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
CREATE POLICY "Users can view their own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Tickets
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own tickets" ON tickets;
CREATE POLICY "Users can view their own tickets" ON tickets FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create tickets" ON tickets;
CREATE POLICY "Users can create tickets" ON tickets FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Site Content
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Site content is viewable by everyone" ON site_content;
CREATE POLICY "Site content is viewable by everyone" ON site_content FOR SELECT USING (true);
-- Admin updates are done via service role key, so no RLS policy needed for UPDATE

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Insert buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('files', 'files', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('banners', 'banners', true) ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
-- COVERS (Public Read, Authenticated Insert/Update/Delete)
DROP POLICY IF EXISTS "Public Access for covers" ON storage.objects;
CREATE POLICY "Public Access for covers" ON storage.objects FOR SELECT USING (bucket_id = 'covers');
DROP POLICY IF EXISTS "Auth Insert for covers" ON storage.objects;
CREATE POLICY "Auth Insert for covers" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'covers' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth Update for covers" ON storage.objects;
CREATE POLICY "Auth Update for covers" ON storage.objects FOR UPDATE USING (bucket_id = 'covers' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth Delete for covers" ON storage.objects;
CREATE POLICY "Auth Delete for covers" ON storage.objects FOR DELETE USING (bucket_id = 'covers' AND auth.role() = 'authenticated');

-- AVATARS (Public Read, Authenticated Insert/Update/Delete)
DROP POLICY IF EXISTS "Public Access for avatars" ON storage.objects;
CREATE POLICY "Public Access for avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
DROP POLICY IF EXISTS "Auth Insert for avatars" ON storage.objects;
CREATE POLICY "Auth Insert for avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth Update for avatars" ON storage.objects;
CREATE POLICY "Auth Update for avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth Delete for avatars" ON storage.objects;
CREATE POLICY "Auth Delete for avatars" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- BANNERS (Public Read, Authenticated Insert/Update/Delete)
DROP POLICY IF EXISTS "Public Access for banners" ON storage.objects;
CREATE POLICY "Public Access for banners" ON storage.objects FOR SELECT USING (bucket_id = 'banners');
DROP POLICY IF EXISTS "Auth Insert for banners" ON storage.objects;
CREATE POLICY "Auth Insert for banners" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'banners' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth Update for banners" ON storage.objects;
CREATE POLICY "Auth Update for banners" ON storage.objects FOR UPDATE USING (bucket_id = 'banners' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth Delete for banners" ON storage.objects;
CREATE POLICY "Auth Delete for banners" ON storage.objects FOR DELETE USING (bucket_id = 'banners' AND auth.role() = 'authenticated');

-- FILES (Private: Authenticated Read, Authenticated Insert/Update/Delete)
-- Note: Further restriction could be applied to ensure only the owner/buyer can read, 
-- but for Banolite backend generates signed URLs or handles via Service Role. 
-- For now, allowing authenticated users to insert their product files.
DROP POLICY IF EXISTS "Auth Read for files" ON storage.objects;
CREATE POLICY "Auth Read for files" ON storage.objects FOR SELECT USING (bucket_id = 'files' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth Insert for files" ON storage.objects;
CREATE POLICY "Auth Insert for files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'files' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth Update for files" ON storage.objects;
CREATE POLICY "Auth Update for files" ON storage.objects FOR UPDATE USING (bucket_id = 'files' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth Delete for files" ON storage.objects;
CREATE POLICY "Auth Delete for files" ON storage.objects FOR DELETE USING (bucket_id = 'files' AND auth.role() = 'authenticated');

-- ============================================
-- FUNCTIONS: auto-create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'buyer')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
