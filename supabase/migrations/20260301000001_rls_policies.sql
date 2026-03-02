-- 002_rls_policies.sql

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Helper: get current user's business IDs
CREATE OR REPLACE FUNCTION get_user_business_ids()
RETURNS SETOF UUID AS $$
  SELECT business_id FROM business_members WHERE user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- businesses
CREATE POLICY "members can view their businesses" ON businesses
  FOR SELECT USING (id IN (SELECT get_user_business_ids()));
CREATE POLICY "authenticated users can create businesses" ON businesses
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "owners can update their business" ON businesses
  FOR UPDATE USING (
    id IN (
      SELECT business_id FROM business_members
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- business_members
CREATE POLICY "members can view team" ON business_members
  FOR SELECT USING (business_id IN (SELECT get_user_business_ids()));
CREATE POLICY "owners can manage team" ON business_members
  FOR ALL USING (
    business_id IN (
      SELECT business_id FROM business_members
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- locations
CREATE POLICY "tenant access locations" ON locations
  FOR ALL USING (business_id IN (SELECT get_user_business_ids()));

-- products
CREATE POLICY "tenant access products" ON products
  FOR ALL USING (business_id IN (SELECT get_user_business_ids()));

-- product_variants
CREATE POLICY "tenant access product_variants" ON product_variants
  FOR ALL USING (business_id IN (SELECT get_user_business_ids()));

-- stock_levels
CREATE POLICY "tenant access stock_levels" ON stock_levels
  FOR ALL USING (business_id IN (SELECT get_user_business_ids()));

-- suppliers
CREATE POLICY "tenant access suppliers" ON suppliers
  FOR ALL USING (business_id IN (SELECT get_user_business_ids()));

-- customers
CREATE POLICY "tenant access customers" ON customers
  FOR ALL USING (business_id IN (SELECT get_user_business_ids()));

-- transactions
CREATE POLICY "tenant access transactions" ON transactions
  FOR ALL USING (business_id IN (SELECT get_user_business_ids()));

-- transaction_items
CREATE POLICY "tenant access transaction_items" ON transaction_items
  FOR ALL USING (transaction_id IN (SELECT id FROM transactions WHERE business_id IN (SELECT get_user_business_ids())));

-- chat_messages
CREATE POLICY "tenant access chat_messages" ON chat_messages
  FOR ALL USING (business_id IN (SELECT get_user_business_ids()));

-- insights_log
CREATE POLICY "tenant access insights_log" ON insights_log
  FOR ALL USING (business_id IN (SELECT get_user_business_ids()));

-- invitations
CREATE POLICY "tenant access invitations" ON invitations
  FOR ALL USING (business_id IN (SELECT get_user_business_ids()));
