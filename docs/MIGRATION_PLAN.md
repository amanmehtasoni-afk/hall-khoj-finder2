# Hall Khoj Finder — Supabase Migration Plan

## 1. Migration Overview
This plan specifies the deterministic migration from the existing local JSON datasets (`backend/data/*.json`) and MongoDB models into Supabase Cloud (PostgreSQL, Supabase Auth, Storage, and Realtime).

## 2. Source Data Identification
The existing project contains:
- `users.json`: 152 records (Customers, Owners, Superadmins)
- `owners.json`: 61 records (Verified venues and vendor owners with GST/KYC)
- `halls.json`: 41 records (Full wedding venue listings with capacity and pricing)
- `cars.json`: 2 records (Luxury wedding vehicles)
- `tent_houses.json`: 2 records (Shamiana and tent rentals)
- `services.json`: 13 records (Catering, DJ, Decorators, Photographers)
- `bookings.json`: 63 records (Historical and active event bookings)
- `reviews.json`: 11 records (Customer feedback and owner replies)
- `transactions.json`: 17 records (Razorpay payments and token advances)
- `categories.json`: 19 records (Marketplace categories)
- `staff.json`: 3 records (Venue employees)
- `messages.json`: 16 records (Direct inquiries)
- `notifications.json`: 152 records (User alerts)
- `audit_logs.json`: 30 records (Security and administrative logs)

## 3. Destination Supabase PostgreSQL Tables (22 Tables)
1. `profiles`
2. `user_roles`
3. `owners`
4. `venues`
5. `venue_images`
6. `venue_videos`
7. `venue_categories`
8. `venue_facilities`
9. `venue_availability`
10. `bookings`
11. `booking_status_history`
12. `payments`
13. `transactions`
14. `reviews`
15. `favorites`
16. `notifications`
17. `staff`
18. `conversations`
19. `messages`
20. `locations`
21. `support_tickets`
22. `audit_logs`

## 4. Execution Sequence
1. **Schema Definition**: Write SQL migration scripts in `/supabase/migrations/` creating all 22 tables with primary keys (`UUID` or consistent IDs), foreign keys, check constraints, and performance indexes.
2. **Data Export & Transformation**: Build Node.js migration script (`backend/scripts/migrate_to_supabase.js`) that reads `backend/data/*.json`, normalizes foreign keys and timestamps, and generates SQL INSERT statements and JSON payloads.
3. **RLS & Security Enforcement**: Add granular Row Level Security policies adhering to Supabase best practices (`(select auth.uid())` subqueries, `TO authenticated` / `TO anon`).
4. **Storage Setup**: Configure policies for `venue-images`, `venue-videos`, `venue-documents`, `profile-avatars`, `booking-documents`, and `payment-invoices`.
5. **Client Adapter**: Implement `frontend/js/supabase-client.js` with auto-fallback to the local REST API if Supabase credentials are in development/offline mode.
