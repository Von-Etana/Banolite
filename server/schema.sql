-- Banolite Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'admin');
CREATE TYPE product_type AS ENUM ('EBOOK', 'COURSE', 'TICKET', 'SERVICE', 'SUBSCRIPTION', 'COACHING');
CREATE TYPE order_status AS ENUM ('pending', 'completed', 'refunded', 'failed');

-- Users table (Extends Supabase Auth users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT,
  role user_role DEFAULT 'buyer' NOT NULL,
  bio TEXT,
  location TEXT,
  wallet_balance DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
  store_name TEXT,
  store_description TEXT,
  social_links JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Products table
CREATE TABLE public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  seller_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  cover_url TEXT,
  color TEXT,
  tags TEXT[] DEFAULT '{}',
  type product_type NOT NULL,
  sales_count INTEGER DEFAULT 0 NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0.00,
  -- Dynamic metadata properties based on type
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(product_id, user_id)
);

-- Orders table
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status order_status DEFAULT 'pending' NOT NULL,
  payment_method TEXT,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Order Items table
CREATE TABLE public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Purchased Products Cache (for quick access to "what did I buy")
CREATE TABLE public.user_purchases (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, product_id)
);

-- Row Level Security (RLS) configuration

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;

-- Product Policies: Everyone can read, only sellers can create/update/delete their own
CREATE POLICY "Products are viewable by everyone" 
  ON public.products FOR SELECT USING (true);
CREATE POLICY "Sellers can insert their own products" 
  ON public.products FOR INSERT WITH CHECK (auth.uid() = seller_id AND EXISTS(SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('seller', 'admin')));
CREATE POLICY "Sellers can update their own products" 
  ON public.products FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can delete their own products" 
  ON public.products FOR DELETE USING (auth.uid() = seller_id);

-- User Policies: Everyone can read basic info, only self can update
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" 
  ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" 
  ON public.users FOR UPDATE USING (auth.uid() = id);

-- Reviews: Everyone can read, purchased users can insert, owner can update
CREATE POLICY "Reviews viewable by everyone" 
  ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can review products they purchased" 
  ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id AND EXISTS(SELECT 1 FROM public.user_purchases WHERE user_id = auth.uid() AND product_id = public.reviews.product_id));

-- Orders: Users can view their own orders 
CREATE POLICY "Users can view own orders" 
  ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own order items" 
  ON public.order_items FOR SELECT USING (EXISTS(SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid()));

-- Site Content Management (CMS)
CREATE TABLE public.site_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site content is viewable by everyone" 
  ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Only admins can update site content" 
  ON public.site_content FOR ALL USING (
  EXISTS(SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
