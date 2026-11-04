-- ==============================================================================
-- HALL KHOJ FINDER — COMPLETE ONE-CLICK SUPABASE SETUP SCRIPT (AUTO-RESOLVED)
-- Resolves duplicate mobile/email constraints and safely initializes full schema
-- ==============================================================================

-- 1. CLEAN RESET (Safely wipes any half-created tables from previous failed run)
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- 2. RESTORE SUPABASE GRANTS
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;


-- >>> START: 20261103000001_initial_schema.sql <<<
-- ==============================================================================
-- HALL KHOJ FINDER — SUPABASE POSTGRESQL INITIAL SCHEMA (PHASE 12)
-- Relational schema for 22 tables with UUIDs, foreign keys, check constraints,
-- and performance indexes adhering to Supabase Postgres Best Practices.
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES (Extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    mobile VARCHAR(20),
    avatar_url TEXT,
    state VARCHAR(100),
    district VARCHAR(100),
    city VARCHAR(100),
    area VARCHAR(255),
    pin VARCHAR(10),
    is_verified BOOLEAN DEFAULT FALSE,
    account_status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (account_status IN ('ACTIVE', 'SUSPENDED', 'PENDING')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partial unique index for mobile (allows null/empty while enforcing uniqueness for valid phone numbers)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_mobile_idx ON public.profiles (mobile) WHERE mobile IS NOT NULL AND mobile != '';

-- 2. USER ROLES (Strict RBAC: CUSTOMER, OWNER, ADMIN - Section 38 & Phase 13)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('customer', 'owner', 'staff', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (profile_id, role)
);

-- 3. OWNERS (Venue & Vendor Business Profiles with KYC)
CREATE TABLE IF NOT EXISTS public.owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100) NOT NULL DEFAULT 'Marriage Hall',
    email VARCHAR(255),
    mobile VARCHAR(20) NOT NULL,
    alternate_mobile VARCHAR(20),
    address TEXT,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    state VARCHAR(100) NOT NULL,
    pin VARCHAR(10),
    gst_number VARCHAR(50),
    pan_number VARCHAR(50),
    bank_account_number VARCHAR(50),
    bank_ifsc VARCHAR(30),
    bank_name VARCHAR(100),
    verification_status VARCHAR(50) DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    rating NUMERIC(3,2) DEFAULT 5.00,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. VENUES (Halls, Palaces, Resorts, Lawn Listings)
CREATE TABLE IF NOT EXISTS public.venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.owners(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL DEFAULT 'Marriage Hall',
    category VARCHAR(100) NOT NULL DEFAULT 'Marriage Halls',
    category_slug VARCHAR(100) NOT NULL DEFAULT 'marriage-halls',
    status VARCHAR(50) DEFAULT 'PENDING_APPROVAL' CHECK (status IN ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'SUSPENDED')),
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    area VARCHAR(255),
    pin VARCHAR(10),
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    starting_price NUMERIC(12,2) NOT NULL DEFAULT 50000.00,
    price_weekday NUMERIC(12,2),
    price_weekend NUMERIC(12,2),
    price_full_day NUMERIC(12,2),
    advance_percentage INTEGER DEFAULT 25 CHECK (advance_percentage BETWEEN 10 AND 100),
    capacity_min INTEGER DEFAULT 100,
    capacity_max INTEGER NOT NULL DEFAULT 1000,
    rating NUMERIC(3,2) DEFAULT 5.00,
    review_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    has_3d_model BOOLEAN DEFAULT FALSE,
    model_3d_url TEXT,
    cover_image_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. VENUE IMAGES
CREATE TABLE IF NOT EXISTS public.venue_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    is_cover BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. VENUE VIDEOS
CREATE TABLE IF NOT EXISTS public.venue_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    title VARCHAR(255),
    video_type VARCHAR(50) DEFAULT 'WALKTHROUGH' CHECK (video_type IN ('WALKTHROUGH', 'DRONE', 'HIGHLIGHT', '360')),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. VENUE CATEGORIES
CREATE TABLE IF NOT EXISTS public.venue_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    hindi_name VARCHAR(100),
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50),
    description TEXT,
    price_type VARCHAR(50) DEFAULT 'fixed',
    starting_price NUMERIC(12,2) DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. VENUE FACILITIES
CREATE TABLE IF NOT EXISTS public.venue_facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    facility_name VARCHAR(150) NOT NULL,
    icon VARCHAR(50),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (venue_id, facility_name)
);

-- 9. VENUE AVAILABILITY (Date Slots for Conflict Prevention)
CREATE TABLE IF NOT EXISTS public.venue_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    event_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL DEFAULT 'Full Day' CHECK (time_slot IN ('Morning', 'Evening', 'Night', 'Full Day')),
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'PENDING', 'BOOKED', 'BLOCKED')),
    booking_id UUID,
    note TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (venue_id, event_date, time_slot)
);

-- 10. BOOKINGS (Mandatory Manual Owner Approval Flow - Phase 9)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code VARCHAR(50) NOT NULL UNIQUE,
    venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE RESTRICT,
    owner_id UUID NOT NULL REFERENCES public.owners(id) ON DELETE RESTRICT,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_mobile VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    event_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL DEFAULT 'Evening',
    guest_count INTEGER NOT NULL DEFAULT 100,
    special_requirements TEXT,
    base_price NUMERIC(12,2) NOT NULL,
    cleaning_fee NUMERIC(12,2) DEFAULT 0,
    discount NUMERIC(12,2) DEFAULT 0,
    gst_tax NUMERIC(12,2) DEFAULT 0,
    total_amount NUMERIC(12,2) NOT NULL,
    advance_required NUMERIC(12,2) NOT NULL,
    advance_paid NUMERIC(12,2) DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_OWNER_APPROVAL' CHECK (
        status IN ('REQUESTED', 'PENDING_OWNER_APPROVAL', 'APPROVED', 'ACCEPTED', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'COMPLETED')
    ),
    rejection_reason TEXT,
    owner_notes TEXT,
    approved_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. BOOKING STATUS HISTORY (State Machine Audit Trail)
CREATE TABLE IF NOT EXISTS public.booking_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    actor_id UUID,
    actor_role VARCHAR(50),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. PAYMENTS (Razorpay Orders & Advances)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    razorpay_order_id VARCHAR(100) NOT NULL UNIQUE,
    razorpay_payment_id VARCHAR(100) UNIQUE,
    razorpay_signature VARCHAR(255),
    amount NUMERIC(12,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED')),
    payment_method VARCHAR(50),
    invoice_number VARCHAR(100) UNIQUE,
    invoice_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. TRANSACTIONS (Immutable Financial Ledger)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    owner_id UUID REFERENCES public.owners(id) ON DELETE SET NULL,
    transaction_code VARCHAR(100) NOT NULL UNIQUE,
    amount NUMERIC(12,2) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('ADVANCE_TOKEN', 'FULL_PAYMENT', 'REFUND', 'PAYOUT')),
    status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. REVIEWS (Verified Customer Reviews)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(255),
    comment TEXT NOT NULL,
    owner_reply TEXT,
    owner_reply_at TIMESTAMPTZ,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. FAVORITES (Customer Shortlists)
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (profile_id, venue_id)
);

-- 16. NOTIFICATIONS (Realtime User Alerts)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'GENERAL',
    data JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. STAFF (Venue Employees & Roles)
CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.owners(id) ON DELETE CASCADE,
    venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    role VARCHAR(100) NOT NULL,
    experience_years INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. CONVERSATIONS (Customer-Owner Inquiries)
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES public.owners(id) ON DELETE CASCADE,
    last_message_text TEXT,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. MESSAGES (Direct Chat Threads)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    attachment_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. LOCATIONS (States, Districts, Cities, PIN Codes)
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (state, district, city, pin_code)
);

-- 21. SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    subject VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'GENERAL',
    status VARCHAR(50) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    priority VARCHAR(50) DEFAULT 'NORMAL',
    description TEXT NOT NULL,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. AUDIT LOGS (Platform Administrative Security Trail)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_name VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(100),
    target_id VARCHAR(100),
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- FOREIGN KEY PERFORMANCE INDEXES (Supabase Best Practices)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_auth_user ON public.profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_profile ON public.user_roles(profile_id);
CREATE INDEX IF NOT EXISTS idx_owners_profile ON public.owners(profile_id);
CREATE INDEX IF NOT EXISTS idx_venues_owner ON public.venues(owner_id);
CREATE INDEX IF NOT EXISTS idx_venues_city_state ON public.venues(city, state);
CREATE INDEX IF NOT EXISTS idx_venues_status ON public.venues(status);
CREATE INDEX IF NOT EXISTS idx_venue_images_venue ON public.venue_images(venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_videos_venue ON public.venue_videos(venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_facilities_venue ON public.venue_facilities(venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_avail_lookup ON public.venue_availability(venue_id, event_date);
CREATE INDEX IF NOT EXISTS idx_bookings_venue ON public.bookings(venue_id);
CREATE INDEX IF NOT EXISTS idx_bookings_owner ON public.bookings(owner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_booking_history_booking ON public.booking_status_history(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_transactions_booking ON public.transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_venue ON public.reviews(venue_id);
CREATE INDEX IF NOT EXISTS idx_favorites_profile ON public.favorites(profile_id);
CREATE INDEX IF NOT EXISTS idx_notifications_profile ON public.notifications(profile_id);
CREATE INDEX IF NOT EXISTS idx_staff_owner ON public.staff(owner_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON public.conversations(customer_id, owner_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);


-- >>> START: 20261103000002_rls_policies.sql <<<
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
USING (verification_status = 'VERIFIED' OR profile_id = (SELECT public.current_profile_id()) OR public.is_admin());

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


-- >>> START: 20261103000003_functions_and_triggers.sql <<<
-- ==============================================================================
-- HALL KHOJ FINDER — STORED FUNCTIONS, TRIGGERS & REALTIME (PHASE 9 & 12)
-- Implements atomic booking state machine, double-booking locking,
-- and automated profile creation from Supabase Auth.
-- ==============================================================================

-- 1. Automatic updated_at Trigger Function
CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply updated_at trigger to relevant tables
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_owners_updated_at ON public.owners;
CREATE TRIGGER set_owners_updated_at BEFORE UPDATE ON public.owners FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_venues_updated_at ON public.venues;
CREATE TRIGGER set_venues_updated_at BEFORE UPDATE ON public.venues FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_bookings_updated_at ON public.bookings;
CREATE TRIGGER set_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_payments_updated_at ON public.payments;
CREATE TRIGGER set_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

-- 2. Auth User -> Profile & Default Role Trigger
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role VARCHAR(50);
  v_profile_id UUID;
BEGIN
  -- Determine role from raw_user_meta_data safely (default 'customer')
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'customer');
  IF v_role NOT IN ('customer', 'owner') THEN
    v_role := 'customer'; -- Never permit self-assignment of 'admin'
  END IF;

  INSERT INTO public.profiles (
    auth_user_id,
    name,
    email,
    mobile
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email, 'Valued User'),
    NEW.email,
    NEW.raw_user_meta_data->>'mobile'
  ) RETURNING id INTO v_profile_id;

  INSERT INTO public.user_roles (profile_id, role)
  VALUES (v_profile_id, v_role);

  -- If registered as an owner, create initial owner stub
  IF v_role = 'owner' THEN
    INSERT INTO public.owners (
      profile_id,
      business_name,
      mobile,
      email,
      state,
      city
    ) VALUES (
      v_profile_id,
      COALESCE(NEW.raw_user_meta_data->>'business_name', 'My Wedding Venue'),
      COALESCE(NEW.raw_user_meta_data->>'mobile', '0000000000'),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'state', 'Uttar Pradesh'),
      COALESCE(NEW.raw_user_meta_data->>'city', 'Lucknow')
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- ==============================================================================
-- 3. PHASE 9: MANDATORY MANUAL OWNER APPROVAL (ATOMIC TRANSACTION WITH ROW LOCK)
-- Prevents double booking race conditions by locking the availability row FOR UPDATE.
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.approve_booking_atomic(
    p_booking_id UUID,
    p_owner_id UUID,
    p_note TEXT DEFAULT 'Approved by venue owner'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_booking public.bookings%ROWTYPE;
    v_conflict_count INTEGER;
    v_now TIMESTAMPTZ := NOW();
BEGIN
    -- 1. Lock the booking row for update
    SELECT * INTO v_booking
    FROM public.bookings
    WHERE id = p_booking_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'BOOKING_NOT_FOUND', 'message', 'Booking request not found.');
    END IF;

    -- Verify owner authorization
    IF v_booking.owner_id != p_owner_id AND NOT public.is_admin() THEN
        RETURN jsonb_build_object('success', false, 'error', 'UNAUTHORIZED', 'message', 'You can only approve bookings for your own venue.');
    END IF;

    -- Verify status is in approval-eligible state
    IF v_booking.status NOT IN ('REQUESTED', 'PENDING_OWNER_APPROVAL') THEN
        RETURN jsonb_build_object('success', false, 'error', 'INVALID_STATE', 'message', 'Booking is not in pending approval state. Current status: ' || v_booking.status);
    END IF;

    -- 2. Concurrency Safety: Check and lock venue availability date slot
    PERFORM 1 FROM public.venue_availability
    WHERE venue_id = v_booking.venue_id
      AND event_date = v_booking.event_date
      AND time_slot = v_booking.time_slot
    FOR UPDATE;

    -- Check if another booking was confirmed on the exact same date and slot
    SELECT COUNT(*) INTO v_conflict_count
    FROM public.bookings
    WHERE venue_id = v_booking.venue_id
      AND event_date = v_booking.event_date
      AND time_slot = v_booking.time_slot
      AND id != p_booking_id
      AND status IN ('CONFIRMED', 'ACCEPTED', 'APPROVED');

    IF v_conflict_count > 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'DATE_CONFLICT', 'message', 'Cannot approve: another booking is already confirmed for this date and time slot.');
    END IF;

    -- 3. Transition booking status to APPROVED
    UPDATE public.bookings
    SET status = 'APPROVED',
        owner_notes = p_note,
        approved_at = v_now,
        updated_at = v_now
    WHERE id = p_booking_id;

    -- 4. Record status change in immutable audit history
    INSERT INTO public.booking_status_history (
        booking_id,
        previous_status,
        new_status,
        actor_id,
        actor_role,
        note
    ) VALUES (
        p_booking_id,
        v_booking.status,
        'APPROVED',
        p_owner_id,
        'owner',
        p_note
    );

    -- 5. Lock date slot in venue_availability table
    INSERT INTO public.venue_availability (
        venue_id,
        event_date,
        time_slot,
        status,
        booking_id,
        note
    ) VALUES (
        v_booking.venue_id,
        v_booking.event_date,
        v_booking.time_slot,
        'PENDING',
        p_booking_id,
        'Reserved: Owner approved, awaiting advance token payment.'
    )
    ON CONFLICT (venue_id, event_date, time_slot)
    DO UPDATE SET
        status = 'PENDING',
        booking_id = p_booking_id,
        note = 'Reserved: Owner approved, awaiting advance token payment.',
        updated_at = v_now;

    -- 6. Emit Customer Notification
    IF v_booking.customer_id IS NOT NULL THEN
        INSERT INTO public.notifications (
            profile_id,
            title,
            message,
            type,
            data
        ) VALUES (
            v_booking.customer_id,
            'Booking Request Approved! 🎉',
            'Your booking request for ' || v_booking.event_date || ' has been approved by the venue owner. You can now pay the advance token to confirm.',
            'BOOKING_APPROVED',
            jsonb_build_object('bookingId', p_booking_id, 'bookingCode', v_booking.booking_code, 'advanceRequired', v_booking.advance_required)
        );
    END IF;

    RETURN jsonb_build_object('success', true, 'status', 'APPROVED', 'bookingId', p_booking_id);
END;
$$;

-- ==============================================================================
-- 4. REJECT BOOKING ATOMIC FUNCTION
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.reject_booking_atomic(
    p_booking_id UUID,
    p_owner_id UUID,
    p_reason TEXT DEFAULT 'Dates unavailable'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_booking public.bookings%ROWTYPE;
    v_now TIMESTAMPTZ := NOW();
BEGIN
    SELECT * INTO v_booking
    FROM public.bookings
    WHERE id = p_booking_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'BOOKING_NOT_FOUND', 'message', 'Booking request not found.');
    END IF;

    IF v_booking.owner_id != p_owner_id AND NOT public.is_admin() THEN
        RETURN jsonb_build_object('success', false, 'error', 'UNAUTHORIZED', 'message', 'Unauthorized.');
    END IF;

    UPDATE public.bookings
    SET status = 'REJECTED',
        rejection_reason = p_reason,
        rejected_at = v_now,
        updated_at = v_now
    WHERE id = p_booking_id;

    INSERT INTO public.booking_status_history (
        booking_id,
        previous_status,
        new_status,
        actor_id,
        actor_role,
        note
    ) VALUES (
        p_booking_id,
        v_booking.status,
        'REJECTED',
        p_owner_id,
        'owner',
        p_reason
    );

    -- Free availability slot if held
    UPDATE public.venue_availability
    SET status = 'AVAILABLE',
        booking_id = NULL,
        note = 'Slot freed after rejection',
        updated_at = v_now
    WHERE venue_id = v_booking.venue_id
      AND event_date = v_booking.event_date
      AND time_slot = v_booking.time_slot
      AND booking_id = p_booking_id;

    -- Notify Customer
    IF v_booking.customer_id IS NOT NULL THEN
        INSERT INTO public.notifications (
            profile_id,
            title,
            message,
            type,
            data
        ) VALUES (
            v_booking.customer_id,
            'Booking Request Update',
            'Your booking request for ' || v_booking.event_date || ' was declined by the venue: ' || p_reason,
            'BOOKING_REJECTED',
            jsonb_build_object('bookingId', p_booking_id, 'bookingCode', v_booking.booking_code, 'reason', p_reason)
        );
    END IF;

    RETURN jsonb_build_object('success', true, 'status', 'REJECTED', 'bookingId', p_booking_id);
END;
$$;

-- Enable Realtime for bookings, notifications, and messages
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings, public.notifications, public.messages;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Realtime publication setup skipped or handled by cloud manager.';
END;
$$;


-- >>> START: 20261103000004_storage_buckets.sql <<<
-- ==============================================================================
-- HALL KHOJ FINDER — SUPABASE STORAGE CONFIGURATION & POLICIES (PHASE 15)
-- Buckets: venue-images, venue-videos, venue-documents,
-- profile-avatars, booking-documents, payment-invoices.
-- Enforces MIME validation, file size restrictions, and owner isolation.
-- ==============================================================================

-- 1. Create Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('venue-images', 'venue-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('venue-videos', 'venue-videos', true, 104857600, ARRAY['video/mp4', 'video/webm', 'video/quicktime']),
  ('venue-documents', 'venue-documents', false, 15728640, ARRAY['application/pdf', 'image/jpeg', 'image/png']),
  ('profile-avatars', 'profile-avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('booking-documents', 'booking-documents', false, 15728640, ARRAY['application/pdf', 'image/jpeg', 'image/png']),
  ('payment-invoices', 'payment-invoices', false, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ==============================================================================
-- 2. STORAGE RLS POLICIES
-- ==============================================================================

-- VENUE IMAGES POLICIES
CREATE POLICY "Public read venue images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'venue-images');

CREATE POLICY "Authenticated owners upload venue images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'venue-images' AND
  (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

CREATE POLICY "Owners update and delete their own venue images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'venue-images' AND
  (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

-- VENUE VIDEOS POLICIES
CREATE POLICY "Public read venue videos"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'venue-videos');

CREATE POLICY "Authenticated owners upload venue videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'venue-videos' AND
  (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

CREATE POLICY "Owners delete own venue videos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'venue-videos' AND
  (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

-- PROFILE AVATARS POLICIES
CREATE POLICY "Public read avatars"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'profile-avatars');

CREATE POLICY "Users upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-avatars' AND
  (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

CREATE POLICY "Users update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-avatars' AND
  (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

-- PAYMENT INVOICES POLICIES (Private: accessible by customer, owner, and admin)
CREATE POLICY "Users read own invoices"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'payment-invoices' AND
  (
    (storage.foldername(name))[1] = (SELECT auth.uid())::text OR
    public.is_admin()
  )
);

