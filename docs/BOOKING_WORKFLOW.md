# Hall Khoj Finder — Mandatory Manual Booking Workflow (Phase 9)

## 1. Overview & Critical Business Rule
**AUTOMATIC CONFIRMATION IS STRICTLY PROHIBITED.**

Every booking request submitted on Hall Khoj Finder represents a legal intent to hire a venue or service. Because Indian weddings involve complex logistical, seasonal, and ceremonial variables, all reservations require **explicit owner approval** before any payment can be collected.

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant UI as Customer Frontend
    participant API as Supabase / Express API
    participant DB as PostgreSQL DB
    actor Owner
    participant Gateway as Razorpay

    Customer->>UI: Selects Venue, Date & Slot
    Customer->>UI: Submits Booking Request
    UI->>API: POST /api/bookings (status: PENDING_OWNER_APPROVAL)
    API->>DB: Check Availability & Insert Booking
    DB-->>API: Booking ID Created
    API-->>Owner: Realtime Alert: New Booking Request
    Note over Customer,Owner: Status is PENDING_OWNER_APPROVAL. Payment is LOCKED.

    Owner->>API: Opens Dashboard & Reviews Request
    alt Owner Rejects
        Owner->>API: Calls reject_booking_atomic(bookingId, reason)
        API->>DB: Status -> REJECTED, Free Availability Slot
        API-->>Customer: Notification: Request Declined
    else Owner Approves
        Owner->>API: Calls approve_booking_atomic(bookingId, note)
        API->>DB: SELECT ... FOR UPDATE (Lock Slot)
        API->>DB: Re-verify Conflict & Status -> APPROVED
        API-->>Customer: Realtime Alert: Booking Approved! Pay Token
        Note over Customer,Gateway: Status is APPROVED. Payment is UNLOCKED.

        Customer->>Gateway: Initiates 25% Advance Token Payment
        Gateway-->>API: Webhook: Payment Success (HMAC Signature)
        API->>DB: Verify Signature & Status -> CONFIRMED
        API-->>Customer: Instant GST Invoice & Date Locked
    end
```

## 2. Double-Booking Prevention Guarantees
1. `SELECT ... FOR UPDATE` row locks are acquired during approval.
2. The availability slot is marked `PENDING` upon approval and `BOOKED` upon payment.
3. If two concurrent requests arrive for the exact same slot, the first approval commits and the second fails with a `409 DATE_CONFLICT` error.
