# Hall Khoj Finder — Authentication & RBAC Guide

## 1. Multi-Role Segregation (Customer, Owner, Admin)
The platform enforces role verification on the server side:
- **CUSTOMER**: Can explore venues, inspect 3D models, submit booking requests, manage shortlist favorites, pay advance tokens, and review attended venues.
- **OWNER**: Can register venues, upload photos and walkthrough videos, manage pricing packages, block dates on availability calendars, hire staff, and approve or reject booking requests for their own properties.
- **ADMIN**: Can review owner KYC verification documents, approve or flag listings, suspend fraudulent accounts, inspect revenue analytics, and audit security logs.

## 2. Security Safeguards
1. **Self-Escalation Prevention**: The `handle_new_auth_user()` database trigger explicitly restricts user metadata role assignments to `'customer'` or `'owner'`. Setting role to `'admin'` via client payload is rejected.
2. **Session Persistence**: Sessions are maintained through Supabase Auth tokens in `localStorage` with automated refresh cycles.
3. **Password Security**: Passwords must contain a minimum of 6 characters and are hashed using `bcrypt` (or Argon2 via Supabase GoTrue).
