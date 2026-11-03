# Hall Khoj Finder — Existing Architecture
**Document Version:** 1.0.0  
**Target Environment:** Supabase Cloud + Vanilla JS / Three.js Frontend + Express Fallback

---

## 1. System High-Level Topology

```mermaid
flowchart TD
    subgraph Client["Frontend Client (HTML5 / Vanilla ES6+ / CSS3)"]
        UI["Web Interface (Cinematic Glassmorphism)"]
        Three["Three.js 3D Venue & Hero Engine"]
        ApiClient["Supabase Client & HKF_API Bridge"]
        ThemeEngine["Dark / Light Theme Controller"]
    end

    subgraph Supabase["Supabase Cloud Infrastructure"]
        SupaAuth["Supabase Auth (JWT, RBAC)"]
        SupaDB["Supabase PostgreSQL (22 Relational Tables + RLS)"]
        SupaStorage["Supabase Storage (6 Media Buckets)"]
        SupaRealtime["Supabase Realtime (WebSockets)"]
        SupaEdge["PostgreSQL Functions & Triggers"]
    end

    subgraph LegacyBackend["Express Backend (Cluster / Local Fallback)"]
        ExpressServer["Node.js Express Server (Port 3000)"]
        JSONStore["backend/data/*.json (14 Datasets)"]
        MongoBridge["Mongoose Models (MongoDB Atlas)"]
    end

    subgraph External["External Integrations"]
        Razorpay["Razorpay Payment Gateway"]
        Gemini["Google Gemini AI API"]
    end

    UI --> ApiClient
    Three --> UI
    ApiClient --> SupaAuth
    ApiClient --> SupaDB
    ApiClient --> SupaStorage
    ApiClient --> SupaRealtime
    ApiClient --> ExpressServer
    ExpressServer --> JSONStore
    ExpressServer --> MongoBridge
    ExpressServer --> Razorpay
    ExpressServer --> Gemini
    SupaEdge --> SupaDB
```

---

## 2. Data Flow & Storage Tiers

1. **Client Tier**:
   - Runs directly in browser without framework dependencies.
   - Communicates with Supabase directly for authentication, queries, realtime subscriptions, and media uploads using the Supabase JavaScript Client.
   - Express server acts as an alternate microservice / migration runner / Razorpay webhook verifier.

2. **Persistence Tier**:
   - Primary: Supabase PostgreSQL relational database with Row Level Security (RLS) policies.
   - Migration Source: `backend/data/*.json` containing verified production records for 152 users, 41 venues, 61 owners, 63 bookings, and 19 categories.
   - Storage Buckets: Supabase Storage for high-resolution images, walkthrough videos, invoices, and KYC documents.

3. **Booking State Machine (Crucial Business Rule)**:
   - Status Progression:
     `REQUESTED` / `PENDING_OWNER_APPROVAL` -> `APPROVED` (by Owner) or `REJECTED` (by Owner) -> `PENDING_PAYMENT` -> `CONFIRMED` -> `COMPLETED`.
   - Double-booking prevention enforced via SQL transactions and status checks.
