# Hall Khoj Finder — Maintenance & Operational Runbook

## 1. Routine Health Monitoring
Check server health at `GET /api/health`. The response returns JSON containing system uptime, memory usage, and active database status.

## 2. Adding New Venue Categories
To add a new category to the platform:
1. Insert into Supabase:
   ```sql
   INSERT INTO public.venue_categories (name, hindi_name, slug, icon, description, starting_price)
   VALUES ('Destination Resort', 'डेस्टिनेशन रिसॉर्ट', 'destination-resort', '🏝️', 'Luxury destination venues', 150000);
   ```
2. The frontend category pills and filters will automatically pick up the new category.

## 3. Handling Double Booking Inquiries
If an owner reports a scheduling conflict:
1. Check `booking_status_history` for the venue ID and event date.
2. The atomic procedure `approve_booking_atomic` guarantees that only one request can ever be confirmed for a single slot. All competing requests are either placed in pending review or rejected with reason.
