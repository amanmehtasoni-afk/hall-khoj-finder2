# Hall Khoj Finder — Supabase Setup Guide

## 1. Prerequisites
- A Supabase project created on [supabase.com](https://supabase.com).
- Supabase Project URL, Publishable `anon` Key, and `service_role` Key.

## 2. Migration Execution Sequence
Execute the migration scripts located in `/supabase/migrations/` in sequential order:

1. **Initial Schema**:
   Run `supabase/migrations/20261103000001_initial_schema.sql` to generate all 22 tables and performance indexes.
2. **Row Level Security**:
   Run `supabase/migrations/20261103000002_rls_policies.sql` to activate zero-trust policies for customers, owners, and admins.
3. **Functions & Triggers**:
   Run `supabase/migrations/20261103000003_functions_and_triggers.sql` to install `approve_booking_atomic`, `reject_booking_atomic`, `handle_new_auth_user`, and realtime channels.
4. **Storage Buckets**:
   Run `supabase/migrations/20261103000004_storage_buckets.sql` to initialize `venue-images`, `venue-videos`, and invoice buckets.
5. **Data Seeding**:
   Run `supabase/seed.sql` to load all 152 users, 61 owners, 41 venues, 19 categories, 63 bookings, and 17 transactions.

## 3. Environment Variables
Add your credentials to `.env`:
```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
