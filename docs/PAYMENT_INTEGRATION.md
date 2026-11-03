# Hall Khoj Finder — Razorpay Payment Integration (Phase 17)

## 1. Flow Architecture
1. **Approval Prerequisite**: Payments are rejected if the booking is in `REQUESTED` or `PENDING_OWNER_APPROVAL`. Only status `APPROVED` or `ACCEPTED` unlocks the checkout.
2. **Order Generation**: The backend generates an official Razorpay order with `amount = advance_required * 100` (in paise).
3. **Checkout Modal**: The Razorpay SDK opens on the client allowing payment via UPI, Credit/Debit cards, or NetBanking.
4. **Server-Side Verification**: On return, the client transmits `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`. The backend calculates:
   ```javascript
   expectedSignature = crypto.createHmac('sha256', secret)
     .update(`${orderId}|${paymentId}`)
     .digest('hex');
   ```
   If valid using `crypto.timingSafeEqual`, the booking transitions to `CONFIRMED`.
5. **Decoupled Status**: Payment status (`SUCCESS`, `PENDING`, `FAILED`) is stored separately from booking status (`CONFIRMED`, `COMPLETED`).
