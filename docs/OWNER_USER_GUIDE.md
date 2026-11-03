# Hall Khoj Finder — Venue Owner User Guide (Phase 8)

## 1. Onboarding & Registration
1. Register with role **"List Your Business / Venue Owner"** at `/register.html?role=owner`.
2. Complete your business KYC profile: Business Name, GST Number, PAN, Address, and Bank Account details.
3. Once verified, open the Owner Portal (`/owner/dashboard.html`).

## 2. Listing a Marriage Hall or Event Service
1. Click **"+ Add Hall / New Listing"**.
2. Enter Hall Dimensions, Seating Capacity (Min/Max), AC details, Lawn size, and Parking spaces.
3. Configure pricing: Weekday rate, Weekend rate, Full Day package, and Advance token percentage (default 25%).
4. Upload high-definition photos and walkthrough videos to Supabase Storage.

## 3. Availability Calendar Management
1. Navigate to the **Calendar** tab.
2. Click any calendar date to mark it `BLOCKED` for private maintenance or `AVAILABLE`.

## 4. Reviewing and Approving Booking Inquiries (Critical)
1. In the **Bookings / Inquiries** tab, view incoming requests in status `PENDING_OWNER_APPROVAL`.
2. Inspect the customer's event date, time slot, guest count, and special requirements.
3. Click **"Approve Booking"** to lock the slot and notify the customer to pay the advance token, or click **"Reject"** with a polite reason.
