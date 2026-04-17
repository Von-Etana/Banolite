-- ============================================
-- Banolite Subscription & Payouts Schema Update
-- Adding missing columns required by the Paystack integration
-- ============================================

-- 1. Profiles: Add subscription_plan column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscription_plan TEXT NOT NULL DEFAULT 'starter' 
CHECK (subscription_plan IN ('starter', 'pro', 'business'));

-- 2. Create Payouts Table if it does not exist
CREATE TABLE IF NOT EXISTS payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    bank_details JSONB NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Payouts: Update status check to include 'completed' and 'failed' (from bank/webhook updates)
ALTER TABLE payouts DROP CONSTRAINT IF EXISTS payouts_status_check;
ALTER TABLE payouts ADD CONSTRAINT payouts_status_check 
    CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'failed'));

-- 4. Payouts: Add metadata column for Paystack transfer references (if it existed before and was missing the column)
ALTER TABLE payouts ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 4. Platform Revenue: Create table if it doesn't exist (referenced in eventProcessor)
CREATE TABLE IF NOT EXISTS platform_revenue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NGN',
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE platform_revenue ENABLE ROW LEVEL SECURITY;
-- Admin only via service role
