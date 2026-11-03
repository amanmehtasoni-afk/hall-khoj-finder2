# Hall Khoj Finder — Project Overview
**Platform:** India's #1 3D Event Services Marketplace  
**Tech Stack:** HTML5, CSS3, Vanilla ES6+ JavaScript, Three.js, Supabase (PostgreSQL, Auth, Storage, Realtime), Razorpay  
**Status:** Production Ready

---

## 1. Vision & Core Value Proposition
Hall Khoj Finder transforms wedding and event venue discovery across India. Combining cinematic royal aesthetics, glassmorphism UI, real-time availability calendars, and interactive 3D architectural walkthroughs, the platform allows couples and families to explore, inspect, and book verified marriage palaces, banquet halls, luxury wedding cars, and tent houses with 100% confidence.

## 2. Key Pillars & Business Rules
1. **Cinematic Royal Wedding UI**: Dark theme featuring Midnight Navy (`#071426`), Deep Royal Blue (`#123B68`), Electric Blue (`#398BFF`), Soft Champagne (`#D9C7A0`), and Glass White overlays. Clean White & Royal Blue light mode.
2. **Cinematic Multi-Video Hero**: Full-screen video player crossfading between high-definition Indian wedding loops, stages, and chandeliers with dark transparent overlays, WebM/MP4 support, and mobile optimization.
3. **Mandatory Manual Owner Approval**: Strictly enforced business rule preventing accidental or automated bookings. All requests enter `PENDING_OWNER_APPROVAL`. Only upon owner review and approval can advance tokens be collected.
4. **Interactive 3D Walkthrough**: Three.js WebGL venue visualizer with 360° OrbitControls, elevated royal mandap stage, banquet seating, crystal chandeliers, and dynamic lighting presets (Daylight, Sunset, Night Gala).
5. **Supabase Cloud Backbone**: 22 relational PostgreSQL tables, comprehensive Row Level Security (RLS), Supabase Storage for high-res media, and Supabase Realtime WebSocket notifications.
6. **25% Advance Token Protection**: Secure Razorpay integration verifying HMAC-SHA256 signatures before confirming dates, complete with automated GST invoice generation.
