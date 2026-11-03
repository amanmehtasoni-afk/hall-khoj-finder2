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
