-- 1. Create a secure, non-recursive helper function to check if the user is in a business
-- By using SECURITY DEFINER and setting the search path, it bypasses RLS on business_members
-- to prevent infinite loops when querying business_members from within its own policy.
CREATE OR REPLACE FUNCTION is_business_member(target_business_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_member BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM business_members 
    WHERE business_id = target_business_id 
    AND user_id = auth.uid()
  ) INTO is_member;
  
  RETURN is_member;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- 2. Create a secure, non-recursive helper function to check if the user is an OWNER
CREATE OR REPLACE FUNCTION is_business_owner(target_business_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_owner BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM business_members 
    WHERE business_id = target_business_id 
    AND user_id = auth.uid() 
    AND role = 'owner'
  ) INTO is_owner;
  
  RETURN is_owner;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- 3. Drop the old broken policies on business_members that caused the recursion
-- (And also drop the new ones if you ran this script partially before)
DROP POLICY IF EXISTS "members can view team" ON business_members;
DROP POLICY IF EXISTS "owners can manage team" ON business_members;
DROP POLICY IF EXISTS "users can view their own membership" ON business_members;
DROP POLICY IF EXISTS "members can view their team" ON business_members;
DROP POLICY IF EXISTS "owners can manage their team" ON business_members;

-- 4. Create the new Safe, Non-Recursive Policies for business_members
-- You can always see your own membership record (fast path)
CREATE POLICY "users can view their own membership" ON business_members
  FOR SELECT USING (user_id = auth.uid());

-- You can see other people in your business using the safe helper
CREATE POLICY "members can view their team" ON business_members
  FOR SELECT USING (is_business_member(business_id));

-- Owners can manage the team using the safe helper
CREATE POLICY "owners can manage their team" ON business_members
  FOR ALL USING (is_business_owner(business_id));
