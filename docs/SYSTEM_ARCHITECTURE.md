# Hall Khoj Finder — System Architecture
**Version:** 2.0.0 (Modernized Supabase Architecture)

---

## 1. High-Level Architecture Diagram

```mermaid
flowchart TD
    subgraph Browser["Client Browser (Vanilla HTML5 / CSS3 / ES6+)"]
        UI["Web Interface (Glassmorphic)"]
        Theme["Theme Controller (Zero-Flash Dark/Light)"]
        Three["Three.js 3D Venue & Hero Engine"]
        SupaAdapter["Supabase Client Adapter (frontend/js/supabase-client.js)"]
        VideoEngine["Cinematic Video Hero (frontend/js/video-hero.js)"]
    end

    subgraph SupabaseCloud["Supabase Cloud Platform"]
        Auth["Supabase Auth (JWT, RBAC)"]
        Postgres["PostgreSQL DB (22 Relational Tables)"]
        RLS["Row Level Security Policies"]
        RPC["Stored Procedures (approve_booking_atomic)"]
        Storage["Storage Buckets (6 Media Buckets)"]
        Realtime["Realtime Channels (WebSockets)"]
    end

    subgraph PaymentEngine["Payment Infrastructure"]
        Razorpay["Razorpay Gateway (UPI, Cards, NetBanking)"]
        HMAC["Server-Side HMAC-SHA256 Verification"]
    end

    UI --> SupaAdapter
    Three --> UI
    VideoEngine --> UI
    Theme --> UI
    SupaAdapter --> Auth
    SupaAdapter --> Postgres
    SupaAdapter --> Storage
    SupaAdapter --> Realtime
    Postgres --> RLS
    Postgres --> RPC
    SupaAdapter --> Razorpay
    Razorpay --> HMAC
```

## 2. Component Boundaries
1. **Frontend Presentation**: Pure HTML5, CSS3 variables with glassmorphism blur filters, and Vanilla ES6+ modules without bulky frontend frameworks (React/Next).
2. **Data & Security Layer**: Supabase PostgreSQL handles data integrity, foreign key relations, unique constraints, and Row Level Security.
3. **Storage Tier**: Supabase Storage enforces bucket-level MIME restrictions (images, videos, PDF passes) and user-scoped file paths.
4. **Resilient Local Bridge**: When cloud keys are absent during local offline testing, `supabase-client.js` and `api.js` automatically bridge requests to the Express server and local verified JSON records.
