-- ============================================
-- Banolite System Architecture Hardening
-- Migration: 002_system_architecture
-- ============================================

-- ============================================
-- 1. WEBHOOK EVENTS TABLE (Queue + Audit Log)
-- ============================================
CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    idempotency_key TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received','processing','completed','failed','dead_letter')),
    retry_count INT NOT NULL DEFAULT 0,
    max_retries INT NOT NULL DEFAULT 5,
    next_retry_at TIMESTAMPTZ,
    error_message TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_status ON webhook_events(status);
CREATE INDEX IF NOT EXISTS idx_webhook_events_next_retry ON webhook_events(next_retry_at) WHERE status = 'failed';
CREATE INDEX IF NOT EXISTS idx_webhook_events_idempotency ON webhook_events(idempotency_key);

-- RLS: Only service role should access this table
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
-- No public policies — accessed only via service role key

-- ============================================
-- 2. RATE LIMITS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    window_start TIMESTAMPTZ NOT NULL DEFAULT now(),
    request_count INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(key, endpoint, window_start)
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup ON rate_limits(key, endpoint, window_start);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
-- No public policies — accessed only via service role key

-- ============================================
-- 3. RECONCILIATION LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reconciliation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','failed')),
    total_paystack_transactions INT,
    total_db_orders INT,
    discrepancies JSONB DEFAULT '[]'::jsonb,
    summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE reconciliation_logs ENABLE ROW LEVEL SECURITY;
-- No public policies — accessed only via service role key

-- ============================================
-- 4. ALTER ORDERS — Add processing/expired states
-- ============================================
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check
    CHECK (status IN ('pending', 'processing', 'completed', 'refunded', 'failed', 'expired'));

-- ============================================
-- 5. ATOMIC WALLET RPC FUNCTIONS
-- ============================================

-- Atomic increment (for seller payouts from sales)
CREATE OR REPLACE FUNCTION increment_wallet_balance(p_user_id UUID, p_amount NUMERIC)
RETURNS VOID AS $$
BEGIN
    UPDATE profiles
    SET wallet_balance = wallet_balance + p_amount
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atomic increment for affiliate earnings
CREATE OR REPLACE FUNCTION increment_affiliate_earnings(p_user_id UUID, p_amount NUMERIC)
RETURNS VOID AS $$
BEGIN
    UPDATE profiles
    SET wallet_balance = wallet_balance + p_amount,
        affiliate_earnings = affiliate_earnings + p_amount
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atomic decrement with balance check (for payout requests)
-- Returns TRUE if successful, FALSE if insufficient balance
CREATE OR REPLACE FUNCTION decrement_wallet_balance(p_user_id UUID, p_amount NUMERIC)
RETURNS BOOLEAN AS $$
DECLARE
    rows_affected INT;
BEGIN
    UPDATE profiles
    SET wallet_balance = wallet_balance - p_amount
    WHERE id = p_user_id AND wallet_balance >= p_amount;

    GET DIAGNOSTICS rows_affected = ROW_COUNT;
    RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. CLEANUP: Auto-expire old rate limit entries
-- ============================================
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS VOID AS $$
BEGIN
    DELETE FROM rate_limits WHERE window_start < now() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. EXPIRE STALE PENDING ORDERS (>30 min old)
-- ============================================
CREATE OR REPLACE FUNCTION expire_stale_orders()
RETURNS INT AS $$
DECLARE
    rows_affected INT;
BEGIN
    UPDATE orders
    SET status = 'expired'
    WHERE status = 'pending'
    AND created_at < now() - INTERVAL '30 minutes';

    GET DIAGNOSTICS rows_affected = ROW_COUNT;
    RETURN rows_affected;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
