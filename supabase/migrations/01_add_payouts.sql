-- Run this script in your Supabase SQL Editor to apply Phase 1 Updates

-- 1. Create Payouts Table
CREATE TABLE IF NOT EXISTS payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    bank_details JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Apply Payouts RLS
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own payouts" ON payouts;
CREATE POLICY "Users can view their own payouts" ON payouts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create payouts" ON payouts;
CREATE POLICY "Users can create payouts" ON payouts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin updates (approve/reject) are done via service_role key, so no RLS policy needed for UPDATE.

SELECT 'Migration completed successfully' as result;
