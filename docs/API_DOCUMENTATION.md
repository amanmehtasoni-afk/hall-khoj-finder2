# Hall Khoj Finder — API Reference

## 1. Authentication
- `POST /api/auth/register`: Register new customer or owner.
- `POST /api/auth/login`: Authenticate with mobile/email and password.
- `GET /api/auth/me`: Retrieve current session user and role.

## 2. Venues & Search
- `GET /api/halls`: List all verified venues with optional filters (`category`, `city`, `state`, `district`, `maxPrice`, `capacity`).
- `GET /api/halls/:id`: Retrieve single venue details, facilities, and calendar.
- `POST /api/halls`: Create new venue (Owner role required).
- `PATCH /api/halls/:id`: Update venue details or pricing.

## 3. Bookings (Mandatory Manual Approval Flow)
- `POST /api/bookings`: Create booking request in status `PENDING_OWNER_APPROVAL`.
- `GET /api/bookings`: Retrieve user bookings (Customer or Owner scoped).
- `GET /api/bookings/:id`: Retrieve single booking breakdown and audit trail.
- `PATCH /api/bookings/:id/status`: Transition booking state (`APPROVED`, `REJECTED`, `CONFIRMED`).
- `GET /api/bookings/check-availability`: Verify date availability for a venue.
- `GET /api/bookings/:id/invoice`: Download generated PDF invoice pass.

## 4. Payments
- `POST /api/payments/create-order`: Generate Razorpay order for 25% token (Only allowed after owner approval).
- `POST /api/payments/verify`: Verify HMAC-SHA256 signature and mark booking `CONFIRMED`.
- `GET /api/payments/transactions`: View immutable transaction ledger.

## 5. System Health
- `GET /api/health`: Health status, storage mode, and server metrics.
