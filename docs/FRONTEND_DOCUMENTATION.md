# Hall Khoj Finder — Frontend Documentation

## 1. Directory Structure
```
frontend/
├── index.html               # Cinematic Homepage with Video Hero & Advanced Search
├── search.html              # Search & Filter Engine with Leaflet Map
├── hall-details.html        # Venue Detail, 3D Layout Preview, Pricing & Reviews
├── gallery.html             # High-Resolution Photo Gallery with Lightbox
├── 3d-preview.html          # Dedicated Full-Screen 3D Walkthrough (Three.js)
├── compare.html             # Side-by-Side Venue Comparison Matrix
├── favorites.html           # Shortlisted & Saved Venues
├── booking.html             # Multi-step Booking Form with Mandatory Owner Review
├── login.html               # Multi-Role Sign In (Customer, Owner, Admin)
├── register.html            # Registration with Password Strength Verification
├── forgot-password.html     # Multi-step Password Recovery
├── profile.html             # Customer Profile Management & Settings
├── my-bookings.html         # Customer Reservation Tracking & Invoices
├── payment-history.html     # Financial Ledger & Tax Receipts
├── notifications.html       # Realtime Alerts Center
├── reviews.html             # Verified Reviews & Owner Responses
├── contact.html             # 24/7 Wedding Concierge & Direct Inquiry
├── about.html               # Platform Mission, Story & Core Values
├── help.html                # Searchable FAQ Knowledge Base
├── privacy.html             # Data Protection & Privacy Disclosures
├── terms.html               # Terms of Service & Manual Booking Rules
├── synopsis.html            # Project Synopsis & Academic Documentation
├── css/
│   ├── main.css             # Design tokens, color palette, dark/light themes
│   ├── components.css       # Header, search bar, cards, buttons, badges
│   ├── 3d.css               # 3D canvas wrappers, overlays, fallback orbs
│   └── animations.css       # Keyframe animations & reduced-motion queries
└── js/
    ├── theme.js             # Zero-flash dark/light mode controller
    ├── video-hero.js        # Multi-video crossfading hero player
    ├── supabase-client.js   # Client Supabase adapter & RBAC bridge
    ├── api.js               # REST API connector & session manager
    ├── search.js            # Multi-parameter filter & Leaflet map engine
    ├── three-hero.js        # Ambient celebration particles
    └── three-venue.js       # Procedural 3D venue layout inspector
```

## 2. Design Tokens & Color Palette
- **Midnight Navy**: `#071426` (Primary dark background)
- **Deep Royal Blue**: `#123B68` (Section & header depth)
- **Electric Blue**: `#398BFF` (Primary actions, buttons, focus rings)
- **Soft Champagne**: `#D9C7A0` (Accents, badges, pricing highlights)
- **White**: `#FFFFFF` (High-contrast typography)
- **Glass White**: `rgba(255, 255, 255, 0.10)` (Translucent cards & panels)
