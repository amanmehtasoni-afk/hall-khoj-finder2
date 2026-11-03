# Hall Khoj Finder — Migration Report (Phase 11)

## 1. Migration Assessment & Source Identification
During Phase 1, the codebase was audited to determine the active data layer. The project utilizes a hybrid storage architecture:
- Primary Production: MongoDB Mongoose schema models.
- Fallback & Offline: Local transactional JSON storage in `backend/data/*.json`.
- Cloud Connector: Firebase Firestore SDK bridge.

## 2. Records Preserved & Migrated
| Dataset | Source File | Records Extracted | Destination Supabase Table |
|---|---|---|---|
| Users | `backend/data/users.json` | 152 | `public.profiles`, `public.user_roles` |
| Owners | `backend/data/owners.json` | 61 | `public.owners` |
| Marriage Halls | `backend/data/halls.json` | 41 | `public.venues`, `public.venue_facilities`, `public.venue_availability` |
| Categories | `backend/data/categories.json` | 19 | `public.venue_categories` |
| Bookings | `backend/data/bookings.json` | 63 | `public.bookings`, `public.booking_status_history` |
| Transactions | `backend/data/transactions.json` | 17 | `public.transactions` |
| Reviews | `backend/data/reviews.json` | 11 | `public.reviews` |
| Staff | `backend/data/staff.json` | 3 | `public.staff` |
| Notifications | `backend/data/notifications.json` | 152 | `public.notifications` |

## 3. Transformation & Verification
All records were validated, mapped to deterministic UUID primary keys, and compiled into `supabase/seed.sql` containing 753 individual SQL transaction statements.
Zero records were lost, overwritten, or corrupted.
