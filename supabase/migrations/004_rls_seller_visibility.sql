-- ============================================
-- Phase 4: Seller Order Visibility RLS Addendum
-- ============================================

-- 1. Enable RLS generally (safe run)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 2. ORDERS VISIBILITY FOR SELLERS
-- Users can view their own orders (buyer) -- already exists.
-- Add policy for sellers to view orders containing their items:
DROP POLICY IF EXISTS "Sellers can view orders of their products" ON orders;
CREATE POLICY "Sellers can view orders of their products" ON orders FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM order_items 
        JOIN products ON order_items.product_id = products.id 
        WHERE order_items.order_id = orders.id 
        AND products.creator_id = auth.uid()
    )
);

-- 3. ORDER_ITEMS VISIBILITY FOR SELLERS
-- Users can view items they bought -- already exists.
-- Add policy for sellers to view items of their products:
DROP POLICY IF EXISTS "Sellers can view order items of their products" ON order_items;
CREATE POLICY "Sellers can view order items of their products" ON order_items FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM products 
        WHERE products.id = order_items.product_id 
        AND products.creator_id = auth.uid()
    )
);
