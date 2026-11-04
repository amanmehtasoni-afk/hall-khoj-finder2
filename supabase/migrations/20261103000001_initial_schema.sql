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
    verification_status VARCHAR(50) DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'APPROVED', 'REJECTED', 'SUSPENDED')),
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
    status VARCHAR(50) DEFAULT 'PENDING_APPROVAL' CHECK (status IN ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'SUSPENDED', 'FLAGGED')),
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
