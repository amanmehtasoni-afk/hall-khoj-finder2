# Hall Khoj Finder — Testing Guide (Phase 22)

## 1. Automated Test Runner
An automated test script `scratch/test_suite.js` is included in the project to verify:
1. Server Boot & Health Endpoint (`GET /api/health`).
2. Authentication (Customer, Owner, Admin login & token generation).
3. Public Listings Retrieval (`GET /api/halls`).
4. Real-time Availability & Conflict Checking (`GET /api/bookings/check-availability`).
5. Mandatory Manual Booking Workflow (`POST /api/bookings` -> `PENDING_OWNER_APPROVAL`).
6. Owner Manual Approval (`PATCH /api/bookings/:id/status` -> `APPROVED`).
7. Advance Payment Protection (Confirming payment is rejected prior to owner approval).
8. Razorpay Order Generation & HMAC Signature Verification.
9. Theme Toggle Controller (Checking localStorage persistence & zero-flash).
10. Three.js 3D Walkthrough assets and fallback integrity.

## 2. Executing Automated Tests
Run in powershell:
```bash
node scratch/test_suite.js
```
All tests report concrete pass/fail telemetry without simulated results.
