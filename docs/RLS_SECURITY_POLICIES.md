# Hall Khoj Finder — Row Level Security (RLS) Policies

## 1. Zero-Trust Access Model
RLS is active across all 22 database tables in `public`. Policies adhere to Supabase performance and security benchmarks:

1. **Subquery Wrapping**: `(select auth.uid())` is used instead of bare `auth.uid()` to allow Postgres to execute the lookup once per query rather than per row.
2. **Explicit Target Roles**: `TO authenticated` and `TO anon` are used to prevent anonymous privilege escalation.
3. **Dual-Clause Updates**: Every `UPDATE` policy includes both a `USING` condition (restricting which rows can be selected for modification) and a `WITH CHECK` condition (restricting what values can be written, preventing reassignment of foreign keys like `user_id` or `owner_id`).

## 2. Table-by-Table Policy Summary
- `profiles`: Public viewable; users can only update their own record; admins have full access.
- `user_roles`: Read-only to authenticated profile owners; managed strictly by admin functions.
- `owners`: Verified owners public; draft/unverified only visible to owner or admin.
- `venues`: Approved venues public; drafts and updates restricted to the venue's verified owner.
- `bookings`: Customers see own bookings; owners only see bookings for their venues; admins see all.
- `payments` & `transactions`: Restricted to customer, venue owner, and superadmin.
- `favorites`: Strict customer ownership isolation.
