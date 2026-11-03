# Hall Khoj Finder — Backend Documentation

## 1. Dual-Architecture Overview
Hall Khoj Finder supports a dual-engine architecture:
1. **Primary Cloud Engine**: Supabase Cloud (PostgreSQL, Supabase Auth, Storage, Realtime, Database Functions/Triggers).
2. **Local Resilient Engine**: Express.js REST server on port 3000 (`backend/server.js`) connected to verified JSON datasets in `backend/data/` or MongoDB Atlas.

## 2. Express Server Routes & Controllers
- `auth.routes.js`: Mobile/Email registration, JWT generation, password hashing (`bcryptjs`).
- `halls.routes.js`: Public listings, category filters, detail queries.
- `bookings.routes.js`: Booking creation, availability checks, owner status transitions.
- `owners.routes.js`: Owner dashboard telemetry, hall management, staff CRUD.
- `admin.routes.js`: Superadmin controls, KYC queue, user suspensions, audit logs.
- `payments.routes.js`: Razorpay order creation, HMAC-SHA256 signature verification, refunds.
- `ai.routes.js`: Natural language search queries powered by Google Gemini API.
- `upload.routes.js`: Multi-part image/video uploads with MIME validation (`multer`).
- `notifications.routes.js`: User alert delivery and read receipts.
- `reviews.routes.js`: Verified customer reviews and owner reply mutations.

## 3. Resilience & Crash Prevention
The server includes a resilient bootloader: if external cloud connections (MongoDB or Supabase) encounter network latency or missing credentials, the server automatically boots in offline JSON fallback mode, guaranteeing 100% uptime for local development and academic evaluation.
