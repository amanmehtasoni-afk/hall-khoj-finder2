# Hall Khoj Finder — Bug Report & Vulnerability Analysis
**Audit Date:** November 2026  
**Status:** Remediating across Phases 2 - 24

---

## 1. Discovered Bugs and Deficiencies

| ID | Module | Severity | Description | Remediation Plan |
| :--- | :--- | :--- | :--- | :--- |
| **BUG-01** | Frontend Hero | High | Homepage hero only has Three.js particles; no cinematic royal Indian wedding background video with multi-video rotation and transitions. | Implement multi-video HTML5 background player with smooth crossfade, dark transparent overlay, WebM/MP4 support, and image fallbacks. |
| **BUG-02** | Color Scheme | Medium | Current CSS palette uses dark indigo (`#070a13`) and bright magenta (`#ec4899`) instead of specified palette: Midnight Navy (`#071426`), Deep Royal Blue (`#123B68`), Electric Blue (`#398BFF`), Soft Champagne (`#D9C7A0`), and Glass White. | Update `main.css` and `components.css` with exact design tokens and glassmorphic blur filters. |
| **BUG-03** | Theme Switcher | Medium | Dark/Light mode toggle is partially present on some pages and missing on others, leading to flash of unstyled content or unreadable contrast. | Create a centralized `theme.js` utility that syncs `localStorage`, supports system preference, and updates root classes without flicker. |
| **BUG-04** | Booking Flow | Critical | Booking status machine in some routes permitted direct confirmation without mandatory owner approval. | Enforce **MANDATORY MANUAL BOOKING APPROVAL** rule: no booking can enter `CONFIRMED` or accept payment until owner issues explicit `APPROVED` status. |
| **BUG-05** | Missing Pages | High | Customer website lacks dedicated pages for Gallery, 3D Preview, Compare Venues, Favorites, Forgot Password, Profile, Contact, About, Help, Privacy, and Terms. | Create all missing responsive pages in `frontend/` with full navigation links and functional handlers. |
| **BUG-06** | 3D Venue Lighting | Medium | `three-venue.js` has only static ambient lights; lacks dynamic controls for Daylight, Sunset, and Night Gala lighting modes, chandeliers, and OrbitControls. | Upgrade 3D engine with dynamic lighting presets, chandelier glow shaders, stage/seating layout markers, and camera controls. |
| **BUG-07** | Supabase Migration | Critical | System currently depends on local JSON files and MongoDB; lacks Supabase PostgreSQL schema, migrations, RLS policies, and Auth integration. | Write 22 PostgreSQL migration tables, RLS policies, DB functions, and seeding scripts to migrate all data to Supabase. |
| **BUG-08** | Payment Logic | High | Advance payment token was initiated prior to owner acceptance. | Decouple payment initiation from booking creation; unlock payment gateway only after status transitions to `APPROVED`. |
