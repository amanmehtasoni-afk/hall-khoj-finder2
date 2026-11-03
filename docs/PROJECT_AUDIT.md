# Hall Khoj Finder — Comprehensive Project Audit
**Generated:** Autonomous Full-Stack Architecture Engine  
**Project:** Hall Khoj Finder (India's Premium 3D Event Services Marketplace)  
**Status:** In Progress (Phase 1 Completed)

---

## 1. Executive Summary & Codebase Anatomy

A complete forensic scan of `d:\hall khoj f` was conducted. The project is an event venue and vendor marketplace platform tailored for Indian wedding and celebration planning (Banquet halls, Marriage palaces, Luxury cars, Tent houses, Catering, DJ, Photographers).

### Core Components Identified:
1. **Frontend (`/frontend`)**:
   - Vanilla HTML5, CSS3, ES6+ JavaScript.
   - Core Pages: `index.html`, `search.html`, `hall-details.html`, `booking.html`, `dashboard.html` (Customer), `owner/dashboard.html` (Venue Owners), `admin/dashboard.html` (Platform Superadmin), `login.html`, `register.html`, `synopsis.html`.
   - 3D Visualization: Three.js integration in `three-hero.js` (ambient particle rings) and `three-venue.js` (procedural hall layout inspection with zones).
   - Multi-language engine: `i18n.js` with 14 Indian languages (Hindi, English, Bengali, Telugu, Marathi, Tamil, Urdu, Gujarati, Kannada, Odia, Malayalam, Punjabi, Assamese, Maithili).
2. **Backend (`/backend`)**:
   - Express.js REST API with clustering (`cluster.js` and `server.js`).
   - Tri-tier Data Layer (`firestore.service.js`):
     - Primary: MongoDB Mongoose models (Atlas connection configured).
     - Secondary: Firebase Firestore Admin SDK (optional connector).
     - Fallback: Local transactional JSON storage in `backend/data/*.json` containing 152 users, 61 owners, 41 venues, 63 bookings, 17 transactions, 11 reviews, 19 categories.
   - Core Services: Auth (JWT + bcrypt), Booking engine with date conflict checks, Razorpay payment verification, AI Search (Google Gemini), Notifications, Staff management, Invoices (PDFKit).
3. **Target Architecture (Supabase Migration & Modernization)**:
   - Supabase PostgreSQL (22 relational tables, RLS security, PostGIS geo-queries, stored procedures).
   - Supabase Auth (Customer, Owner, Admin RBAC).
   - Supabase Storage (venue-images, venue-videos, venue-documents, profile-avatars, booking-documents, payment-invoices).
   - Supabase Realtime (Live booking updates, chat, notifications).
   - Strict Manual Booking Approval: Enforced transactional status machine preventing double bookings.

---

## 2. Detailed Component Audit

| Component | Status | Detailed Findings |
| :--- | :--- | :--- |
| **Folder Structure** | Working / Reusable | Clean separation of `frontend`, `backend`, `data`, and `assets`. |
| **HTML Files** | Partially Working | High-quality pages exist (`index.html`, `hall-details.html`, `booking.html`, dashboards), but lacks dedicated standalone pages for Gallery, 3D Preview, Compare, Favorites, Forgot Password, Profile, Contact, About, Help, Privacy, and Terms. |
| **CSS Architecture** | Working / Needs Restyle | CSS tokens in `main.css` use old indigo/gold palette instead of the required **Cinematic Royal Wedding + Glassmorphism** (#071426, #123B68, #398BFF, #D9C7A0, Glass White). Dark/Light mode toggle lacks full dynamic switching across all pages. |
| **Hero Background** | Broken / Incomplete | Uses Three.js particle canvas only; lacks full-screen cinematic video hero with smooth transitions between multiple royal Indian wedding videos, MP4/WebM support, and poster fallbacks. |
| **Search Engine** | Working / Needs Expansion | Search bar supports text query and city; needs transparent multi-filter bar with State, District, City, PIN Code, Event Date, Guest Count, Venue Type, and Budget. |
| **Booking Engine** | Partially Working | Booking logic exists in `booking.service.js` and `booking.html`, but requires strict server-side **MANDATORY MANUAL BOOKING APPROVAL** rule enforcement (`PENDING_OWNER_APPROVAL` -> `APPROVED` / `REJECTED`) with PostgreSQL atomic locking. |
| **Authentication** | Partially Working | Uses Express JWT + bcrypt. Needs migration to Supabase Auth with secure RLS policies and client adapters, preventing client-side role manipulation. |
| **Database** | Migrating to Supabase | Currently uses local JSON + MongoDB. Must be migrated safely to Supabase PostgreSQL schema with 22 tables and foreign keys. |
| **3D Venue Preview** | Partially Working | Basic procedural geometry in `three-venue.js`. Needs dedicated full-screen 3D viewer with stage/seating layouts, chandelier visualization, lighting controls (Daylight, Sunset, Night Gala), and OrbitControls. |
| **Payment Gateway** | Partially Working | Razorpay test keys present. Needs server-side order generation, HMAC verification, invoice downloading, and strict rule: no advance token collection before owner approval. |
| **Dashboards** | Working / Needs Supabase Link | Customer, Owner, and Admin dashboards exist with rich feature sets; need alignment with Supabase client and modern glassmorphic theme. |

---

## 3. Security & Vulnerability Assessment

1. **Role-Based Access Control**: Must guarantee that users cannot elevate their own role to ADMIN. Supabase Auth `user_metadata` will NOT be trusted for authorization; roles will be validated via a secure `user_roles` table and server-side RPCs.
2. **Double Booking Prevention**: Concurrent booking requests for the same venue and date slot must be protected using PostgreSQL transaction isolation and row-level locks (`SELECT ... FOR UPDATE`).
3. **Environment Security**: No Supabase `service_role` keys or Razorpay secret keys will be leaked into frontend bundles. All sensitive actions must route through secure database RPCs or backend endpoints.

---

## 4. Audit Conclusion & Next Steps
The existing code provides a solid business foundation and data structure. We will preserve all 152+ users, 41+ venues, categories, bookings, and transactions, migrate them to Supabase PostgreSQL, overhaul the UI into the cinematic glassmorphism style, implement video hero transitions, and add missing customer pages and 3D preview controls.
