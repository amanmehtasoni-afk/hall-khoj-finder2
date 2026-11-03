# Hall Khoj Finder — Database Schema (22 PostgreSQL Tables)

| # | Table Name | Purpose | Primary Key | Key Foreign Keys |
|---|---|---|---|---|
| 1 | `profiles` | Extended user identity, contact & location | UUID | `auth_user_id -> auth.users(id)` |
| 2 | `user_roles` | Role assignment (customer, owner, staff, admin) | UUID | `profile_id -> profiles(id)` |
| 3 | `owners` | Business KYC, GST, pan and bank info | UUID | `profile_id -> profiles(id)` |
| 4 | `venues` | Marriage halls, palaces, banquets, lawns | UUID | `owner_id -> owners(id)` |
| 5 | `venue_images` | High-res gallery media | UUID | `venue_id -> venues(id)` |
| 6 | `venue_videos` | Walkthrough and drone clips | UUID | `venue_id -> venues(id)` |
| 7 | `venue_categories`| 19 marketplace categories | UUID | None (Unique slug) |
| 8 | `venue_facilities`| AC, lawn, parking, bridal suite, decor | UUID | `venue_id -> venues(id)` |
| 9 | `venue_availability`| Date & time slot availability calendar | UUID | `venue_id -> venues(id)` |
| 10 | `bookings` | Event reservations & price calculations | UUID | `venue_id -> venues(id)`, `owner_id -> owners(id)` |
| 11 | `booking_status_history` | Audit trail of status transitions | UUID | `booking_id -> bookings(id)` |
| 12 | `payments` | Razorpay orders, payments & invoice links | UUID | `booking_id -> bookings(id)` |
| 13 | `transactions` | Immutable financial ledger | UUID | `booking_id -> bookings(id)`, `payment_id -> payments(id)` |
| 14 | `reviews` | Verified ratings, feedback & owner replies | UUID | `venue_id -> venues(id)` |
| 15 | `favorites` | Customer shortlisted venues | UUID | `profile_id -> profiles(id)`, `venue_id -> venues(id)` |
| 16 | `notifications` | Realtime user alerts and events | UUID | `profile_id -> profiles(id)` |
| 17 | `staff` | Venue employees (managers, security) | UUID | `owner_id -> owners(id)` |
| 18 | `conversations` | Customer-owner inquiry channels | UUID | `customer_id -> profiles(id)`, `owner_id -> owners(id)` |
| 19 | `messages` | Direct chat thread messages | UUID | `conversation_id -> conversations(id)` |
| 20 | `locations` | Geographic database (State, District, PIN) | UUID | Unique (state, district, city, pin) |
| 21 | `support_tickets` | Customer service tickets & resolutions | UUID | `profile_id -> profiles(id)` |
| 22 | `audit_logs` | Platform administrative security events | UUID | `actor_id -> profiles(id)` |
