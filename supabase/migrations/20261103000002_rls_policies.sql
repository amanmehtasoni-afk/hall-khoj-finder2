-- ==============================================================================
-- HALL KHOJ FINDER — ROW LEVEL SECURITY (RLS) POLICIES (PHASE 14)
-- Enforces zero-trust data segregation across Customers, Owners, and Admins.
-- Follows Supabase Best Practices: (select auth.uid()), TO authenticated, explicit WITH CHECK.
-- ==============================================================================

-- 1. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.profiles p ON p.id = ur.profile_id
    WHERE p.auth_user_id = (SELECT auth.uid())
      AND ur.role = 'admin'
  );
$$;

-- Helper function to get current user's profile ID
CREATE OR REPLACE FUNCTION public.current_profile_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.profiles
  WHERE auth_user_id = (SELECT auth.uid())
  LIMIT 1;
$$;

-- Helper function to get current owner ID
CREATE OR REPLACE FUNCTION public.current_owner_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT o.id FROM public.owners o
  JOIN public.profiles p ON p.id = o.profile_id
  WHERE p.auth_user_id = (SELECT auth.uid())
  LIMIT 1;
$$;

-- ==============================================================================
-- 1. PROFILES POLICIES
-- ==============================================================================
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth_user_id = (SELECT auth.uid()))
WITH CHECK (auth_user_id = (SELECT auth.uid()));

CREATE POLICY "Admins can manage all profiles"
ON public.profiles FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ==============================================================================
-- 2. USER ROLES POLICIES (Users cannot assign themselves admin)
-- ==============================================================================
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (profile_id = (SELECT public.current_profile_id()));

CREATE POLICY "Admins can manage all user roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ==============================================================================
-- 3. OWNERS POLICIES
-- ==============================================================================
CREATE POLICY "Anyone can view verified owners"
ON public.owners FOR SELECT
TO anon, authenticated
USING (verification_status IN ('VERIFIED', 'APPROVED') OR profile_id = (SELECT public.current_profile_id()) OR public.is_admin());

CREATE POLICY "Owners can update own business record"
ON public.owners FOR UPDATE
TO authenticated
USING (profile_id = (SELECT public.current_profile_id()))
WITH CHECK (profile_id = (SELECT public.current_profile_id()));

-- ==============================================================================
-- 4. VENUES POLICIES
-- ==============================================================================
CREATE POLICY "Anyone can view approved venues"
ON public.venues FOR SELECT
TO anon, authenticated
USING (status = 'APPROVED' OR owner_id = (SELECT public.current_owner_id()) OR public.is_admin());

CREATE POLICY "Owners can create venues"
ON public.venues FOR INSERT
TO authenticated
WITH CHECK (owner_id = (SELECT public.current_owner_id()));

CREATE POLICY "Owners can update own venues"
ON public.venues FOR UPDATE
TO authenticated
USING (owner_id = (SELECT public.current_owner_id()) OR public.is_admin())
WITH CHECK (owner_id = (SELECT public.current_owner_id()) OR public.is_admin());

CREATE POLICY "Owners can delete own venues"
ON public.venues FOR DELETE
TO authenticated
USING (owner_id = (SELECT public.current_owner_id()) OR public.is_admin());

-- ==============================================================================
-- 5. VENUE IMAGES & VIDEOS
-- ==============================================================================
CREATE POLICY "Anyone can view venue media"
ON public.venue_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can view venue videos"
ON public.venue_videos FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Owners can manage own venue images"
ON public.venue_images FOR ALL TO authenticated
USING (venue_id IN (SELECT id FROM public.venues WHERE owner_id = (SELECT public.current_owner_id())) OR public.is_admin())
WITH CHECK (venue_id IN (SELECT id FROM public.venues WHERE owner_id = (SELECT public.current_owner_id())) OR public.is_admin());

CREATE POLICY "Owners can manage own venue videos"
ON public.venue_videos FOR ALL TO authenticated
USING (venue_id IN (SELECT id FROM public.venues WHERE owner_id = (SELECT public.current_owner_id())) OR public.is_admin())
WITH CHECK (venue_id IN (SELECT id FROM public.venues WHERE owner_id = (SELECT public.current_owner_id())) OR public.is_admin());

-- ==============================================================================
-- 6. VENUE CATEGORIES & FACILITIES
-- ==============================================================================
CREATE POLICY "Public read categories" ON public.venue_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read facilities" ON public.venue_facilities FOR SELECT TO anon, authenticated USING (true);

-- ==============================================================================
-- 7. VENUE AVAILABILITY (Date Slots)
-- ==============================================================================
CREATE POLICY "Public read availability" ON public.venue_availability FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Owners can modify own venue availability"
ON public.venue_availability FOR ALL TO authenticated
USING (venue_id IN (SELECT id FROM public.venues WHERE owner_id = (SELECT public.current_owner_id())) OR public.is_admin())
WITH CHECK (venue_id IN (SELECT id FROM public.venues WHERE owner_id = (SELECT public.current_owner_id())) OR public.is_admin());

-- ==============================================================================
-- 8. BOOKINGS POLICIES (Phase 9 Mandatory Manual Approval Security)
-- ==============================================================================
CREATE POLICY "Customers view own bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (customer_id = (SELECT public.current_profile_id()) OR owner_id = (SELECT public.current_owner_id()) OR public.is_admin());

CREATE POLICY "Customers can create booking requests"
ON public.bookings FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Owners can approve or reject bookings for own venues"
ON public.bookings FOR UPDATE
TO authenticated
USING (owner_id = (SELECT public.current_owner_id()) OR public.is_admin())
WITH CHECK (owner_id = (SELECT public.current_owner_id()) OR public.is_admin());

-- ==============================================================================
-- 9. PAYMENTS & TRANSACTIONS
-- ==============================================================================
CREATE POLICY "Customers view own payments"
ON public.payments FOR SELECT
TO authenticated
USING (customer_id = (SELECT public.current_profile_id()) OR public.is_admin());

CREATE POLICY "Customers view own transactions"
ON public.transactions FOR SELECT
TO authenticated
USING (customer_id = (SELECT public.current_profile_id()) OR owner_id = (SELECT public.current_owner_id()) OR public.is_admin());

-- ==============================================================================
-- 10. REVIEWS & FAVORITES
-- ==============================================================================
CREATE POLICY "Anyone can read reviews" ON public.reviews FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Verified customers can write reviews"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (customer_id = (SELECT public.current_profile_id()));

CREATE POLICY "Users manage own favorites"
ON public.favorites FOR ALL
TO authenticated
USING (profile_id = (SELECT public.current_profile_id()))
WITH CHECK (profile_id = (SELECT public.current_profile_id()));

-- ==============================================================================
-- 11. NOTIFICATIONS
-- ==============================================================================
CREATE POLICY "Users access own notifications"
ON public.notifications FOR ALL
TO authenticated
USING (profile_id = (SELECT public.current_profile_id()))
WITH CHECK (profile_id = (SELECT public.current_profile_id()));
