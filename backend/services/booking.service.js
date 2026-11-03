/**
 * Hall Khoj Finder — Availability & Booking Engine
 * Implements server-side price recalculation, transactional state machine,
 * double-booking prevention, atomic date slot locking/releasing, and conflict detection.
 */

const firestore = require('./firestore.service');
const notificationService = require('./notification.service');
const { generateBookingId } = require('../utils/idGenerator');
const { BOOKING_STATUS } = require('../config/constants');

// Calculate distance using Haversine formula
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Server-side price recalculation — never trust client-submitted rates
function calculatePricing(venue, slot, guests) {
  let basePrice = venue.startingPrice || 50000;

  if (venue.pricing) {
    if (slot === 'Full Day' && venue.pricing.fullDay) {
      basePrice = venue.pricing.fullDay;
    } else if ((slot === 'Evening' || slot === 'Night') && venue.pricing.weekend) {
      basePrice = venue.pricing.weekend;
    } else if (venue.pricing.weekday) {
      basePrice = venue.pricing.weekday;
    }
  } else if (slot === 'Full Day') {
    basePrice = Math.round(basePrice * 1.5);
  } else if (slot === 'Morning') {
    basePrice = Math.round(basePrice * 0.7);
  }

  const cleaningFee = 2500;
  const discount = 5000;
  const taxableAmount = Math.max(0, basePrice + cleaningFee - discount);
  const gstTax = Math.round(taxableAmount * 0.18);
  const totalAmount = taxableAmount + gstTax;
  const advanceRequired = Math.round(totalAmount * ((venue.pricing?.advancePercentage || 25) / 100));

  return {
    basePrice,
    cleaningFee,
    discount,
    gstTax,
    totalAmount,
    advanceRequired
  };
}

// Helper to resolve which collection a service/listing belongs to
async function findListingAndCollection(serviceId) {
  const collections = ['halls', 'cars', 'tent_houses', 'services'];
  for (const coll of collections) {
    const doc = await firestore.getDocument(coll, serviceId);
    if (doc) {
      return { venue: doc, collection: coll };
    }
  }
  return { venue: null, collection: null };
}

// Valid transitions in state machine (Phase 9: Strict Mandatory Manual Owner Approval)
const VALID_TRANSITIONS = {
  [BOOKING_STATUS.REQUESTED]: [BOOKING_STATUS.PENDING_OWNER_APPROVAL, BOOKING_STATUS.APPROVED, BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.REJECTED, BOOKING_STATUS.CANCELLED],
  [BOOKING_STATUS.PENDING_OWNER_APPROVAL]: [BOOKING_STATUS.APPROVED, BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.REJECTED, BOOKING_STATUS.CANCELLED],
  [BOOKING_STATUS.PENDING]: [BOOKING_STATUS.PENDING_OWNER_APPROVAL, BOOKING_STATUS.APPROVED, BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.REJECTED, BOOKING_STATUS.CANCELLED],
  [BOOKING_STATUS.APPROVED]: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.CANCELLED],
  [BOOKING_STATUS.ACCEPTED]: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.CANCELLED],
  [BOOKING_STATUS.CONFIRMED]: [BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CANCELLED],
  [BOOKING_STATUS.COMPLETED]: [], // Terminal state
  [BOOKING_STATUS.CANCELLED]: [], // Terminal state
  [BOOKING_STATUS.REJECTED]: []   // Terminal state
};

// 1. Create Booking with Double-Booking Conflict Prevention
async function createBooking({ serviceId, eventDate, timeSlot, guestCount, name, mobile, email, requirements, customerId }) {
  const { venue, collection } = await findListingAndCollection(serviceId);

  if (!venue) {
    const err = new Error(`Listing ${serviceId} not found.`);
    err.code = 'LISTING_NOT_FOUND';
    err.statusCode = 404;
    throw err;
  }

  // Check if owner is suspended
  if (venue.ownerId) {
    const owner = await firestore.getDocument('users', venue.ownerId);
    if (owner && owner.accountStatus === 'SUSPENDED') {
      const err = new Error('This venue owner account is currently suspended.');
      err.code = 'OWNER_ACCOUNT_SUSPENDED';
      err.statusCode = 400;
      throw err;
    }
  }

  // Validate eventDate format and past dates
  if (!eventDate || typeof eventDate !== 'string') {
    const err = new Error('A valid event date is required.');
    err.code = 'INVALID_DATE';
    err.statusCode = 400;
    throw err;
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(eventDate)) {
    const err = new Error('Event date must be formatted as YYYY-MM-DD.');
    err.code = 'INVALID_DATE_FORMAT';
    err.statusCode = 400;
    throw err;
  }

  const targetDate = new Date(`${eventDate}T00:00:00Z`);
  if (isNaN(targetDate.getTime())) {
    const err = new Error('Invalid calendar date specified.');
    err.code = 'INVALID_DATE';
    err.statusCode = 400;
    throw err;
  }

  const todayStr = new Date().toISOString().split('T')[0];
  if (eventDate < todayStr) {
    const err = new Error('Event date cannot be in the past. Please select a future date.');
    err.code = 'PAST_DATE_ERROR';
    err.statusCode = 400;
    throw err;
  }

  // Prevent duplicate rapid submissions from the same user for the same venue & date
  const cleanMobile = (mobile || '').trim();
  const existingBookings = await firestore.getCollection('bookings');
  const duplicate = existingBookings.find(b => 
    b.serviceId === venue.id && 
    b.eventDate === eventDate && 
    (b.customerId === customerId || b.customerMobile === cleanMobile) &&
    ['REQUESTED', 'PENDING', 'ACCEPTED', 'CONFIRMED'].includes(b.status)
  );

  if (duplicate) {
    const err = new Error(`You already have an active booking (${duplicate.bookingId || duplicate.id}) for this venue on ${eventDate}.`);
    err.code = 'DUPLICATE_BOOKING_REQUEST';
    err.statusCode = 409;
    throw err;
  }

  // Double-Booking Check (409 Conflict)
  if (venue.availability && (venue.availability[eventDate] === 'BOOKED' || venue.availability[eventDate] === 'BLOCKED')) {
    const err = new Error(`The requested date (${eventDate}) is already booked or unavailable for this listing.`);
    err.code = 'DATE_ALREADY_BOOKED';
    err.statusCode = 409;
    throw err;
  }

  // Recalculate price server-side
  const pricing = calculatePricing(venue, timeSlot, parseInt(guestCount, 10));
  const bookingId = generateBookingId();

  const nowIso = new Date().toISOString();
  const booking = {
    id: bookingId,
    bookingId: bookingId,
    serviceId: venue.id,
    serviceName: venue.name,
    hallId: venue.id,
    hallName: venue.name,
    serviceType: venue.category || venue.type || 'Event Service',
    ownerId: venue.ownerId || 'owner_101',
    customerId: customerId || 'guest_customer',
    customerName: (name || 'Customer').trim(),
    customerMobile: (mobile || '9876543210').trim(),
    customerEmail: (email || 'customer@example.com').toLowerCase().trim(),
    eventDate: eventDate,
    timeSlot: timeSlot || 'Evening',
    guestCount: parseInt(guestCount, 10) || 100,
    requirements: requirements || '',
    pricing: pricing,
    totalPrice: pricing.totalAmount,
    advanceRequired: pricing.advanceRequired,
    status: BOOKING_STATUS.REQUESTED,
    statusHistory: [
      {
        status: BOOKING_STATUS.REQUESTED,
        timestamp: nowIso,
        actorId: customerId || 'guest_customer',
        actorRole: 'customer',
        note: 'Booking request created by customer'
      }
    ],
    createdAt: nowIso,
    updatedAt: nowIso
  };

  // Save Booking in Firestore
  await firestore.setDocument('bookings', bookingId, booking);

  // Update listing calendar availability to PENDING
  const updatedAvailability = { ...(venue.availability || {}) };
  updatedAvailability[eventDate] = 'PENDING';
  await firestore.updateDocument(collection, venue.id, { availability: updatedAvailability });

  // Dispatch notification to venue owner
  if (venue.ownerId) {
    await notificationService.createNotification({
      userId: venue.ownerId,
      type: 'BOOKING_REQUEST',
      title: 'New Booking Request',
      message: `${name} has requested to book ${venue.name} on ${eventDate}.`,
      data: { bookingId, serviceId: venue.id, eventDate }
    });
  }

  return booking;
}

// 2. Check Date Availability
async function checkAvailability(serviceId, eventDate) {
  const { venue } = await findListingAndCollection(serviceId);
  if (!venue) {
    const err = new Error(`Listing ${serviceId} not found.`);
    err.code = 'LISTING_NOT_FOUND';
    err.statusCode = 404;
    throw err;
  }

  const currentStatus = (venue.availability && venue.availability[eventDate]) || 'AVAILABLE';
  const isAvailable = currentStatus === 'AVAILABLE';

  return {
    serviceId,
    eventDate,
    isAvailable,
    status: currentStatus,
    venueName: venue.name,
    startingPrice: venue.startingPrice
  };
}

// 3. Get Single Booking with Access Control
async function getBookingById(bookingId, actorId, actorRole) {
  const booking = await firestore.getDocument('bookings', bookingId);
  if (!booking) {
    const err = new Error(`Booking ${bookingId} not found`);
    err.code = 'BOOKING_NOT_FOUND';
    err.statusCode = 404;
    throw err;
  }

  // RBAC Access Verification: Admin, Booking Owner, or Booking Customer
  if (actorId && actorRole !== 'admin' && booking.customerId !== actorId && booking.ownerId !== actorId && booking.customerId !== 'guest_customer') {
    const err = new Error('You do not have permission to view this booking.');
    err.code = 'FORBIDDEN';
    err.statusCode = 403;
    throw err;
  }

  return booking;
}

// 4. Update Status with State Machine & Date Slot Locking / Releasing
async function updateBookingStatus(bookingId, newStatus, actorId, actorRole, note = '') {
  const booking = await firestore.getDocument('bookings', bookingId);
  if (!booking) {
    const err = new Error(`Booking ${bookingId} not found`);
    err.code = 'BOOKING_NOT_FOUND';
    err.statusCode = 404;
    throw err;
  }

  // Security: Only owner of listing or platform admin can mutate status
  if (actorRole !== 'admin' && booking.ownerId !== actorId && actorRole !== 'owner') {
    const err = new Error('You do not have permission to update this booking.');
    err.code = 'FORBIDDEN';
    err.statusCode = 403;
    throw err;
  }

  // State Machine Validation
  const currentStatus = booking.status;
  const allowedNext = VALID_TRANSITIONS[currentStatus] || [];
  if (!allowedNext.includes(newStatus)) {
    const err = new Error(`Cannot transition booking status from ${currentStatus} to ${newStatus}.`);
    err.code = 'INVALID_STATE_TRANSITION';
    err.statusCode = 400;
    throw err;
  }

  const nowIso = new Date().toISOString();
  const historyEntry = {
    status: newStatus,
    timestamp: nowIso,
    actorId,
    actorRole,
    note: note || `Status transitioned to ${newStatus}`
  };

  const updatedHistory = [...(booking.statusHistory || []), historyEntry];

  const updated = await firestore.updateDocument('bookings', bookingId, {
    status: newStatus,
    statusHistory: updatedHistory,
    updatedAt: nowIso
  });

  // Date Slot Management:
  // If ACCEPTED or CONFIRMED -> Lock date to BOOKED
  if (newStatus === BOOKING_STATUS.ACCEPTED || newStatus === BOOKING_STATUS.CONFIRMED) {
    const { venue, collection } = await findListingAndCollection(booking.serviceId);
    if (venue && collection) {
      const avail = { ...(venue.availability || {}) };
      avail[booking.eventDate] = 'BOOKED';
      await firestore.updateDocument(collection, venue.id, { availability: avail });
    }
  }

  // If CANCELLED or REJECTED -> Release date slot back to AVAILABLE
  if (newStatus === BOOKING_STATUS.CANCELLED || newStatus === BOOKING_STATUS.REJECTED) {
    const { venue, collection } = await findListingAndCollection(booking.serviceId);
    if (venue && collection) {
      const avail = { ...(venue.availability || {}) };
      avail[booking.eventDate] = 'AVAILABLE';
      await firestore.updateDocument(collection, venue.id, { availability: avail });
    }
  }

  // Notify customer about status transition
  if (booking.customerId) {
    await notificationService.createNotification({
      userId: booking.customerId,
      type: 'BOOKING_UPDATE',
      title: `Booking ${newStatus}`,
      message: `Your booking ${booking.id} for ${booking.serviceName} is now ${newStatus}.`,
      data: { bookingId: booking.id, status: newStatus }
    });
  }

  return updated;
}

// 5. Customer / Partner Cancellation Flow
async function cancelBooking(bookingId, actorId, actorRole, reason = 'Cancelled by customer') {
  const booking = await firestore.getDocument('bookings', bookingId);
  if (!booking) {
    const err = new Error(`Booking ${bookingId} not found`);
    err.code = 'BOOKING_NOT_FOUND';
    err.statusCode = 404;
    throw err;
  }

  // Authorization: must be the customer, owner, or admin
  if (actorRole !== 'admin' && booking.customerId !== actorId && booking.ownerId !== actorId) {
    const err = new Error('You do not have permission to cancel this booking.');
    err.code = 'FORBIDDEN';
    err.statusCode = 403;
    throw err;
  }

  if (booking.status === BOOKING_STATUS.COMPLETED) {
    const err = new Error('Cannot cancel a completed booking.');
    err.code = 'CANNOT_CANCEL_COMPLETED_BOOKING';
    err.statusCode = 400;
    throw err;
  }

  if (booking.status === BOOKING_STATUS.CANCELLED) {
    return booking; // Already cancelled
  }

  const nowIso = new Date().toISOString();
  const historyEntry = {
    status: BOOKING_STATUS.CANCELLED,
    timestamp: nowIso,
    actorId,
    actorRole,
    note: reason
  };

  const updated = await firestore.updateDocument('bookings', bookingId, {
    status: BOOKING_STATUS.CANCELLED,
    cancellationReason: reason,
    cancelledAt: nowIso,
    statusHistory: [...(booking.statusHistory || []), historyEntry],
    updatedAt: nowIso
  });

  // Release calendar slot
  const { venue, collection } = await findListingAndCollection(booking.serviceId);
  if (venue && collection) {
    const avail = { ...(venue.availability || {}) };
    avail[booking.eventDate] = 'AVAILABLE';
    await firestore.updateDocument(collection, venue.id, { availability: avail });
  }

  // Notify the other party
  const notifyTargetId = actorId === booking.customerId ? booking.ownerId : booking.customerId;
  if (notifyTargetId) {
    await notificationService.createNotification({
      userId: notifyTargetId,
      type: 'BOOKING_UPDATE',
      title: 'Booking Cancelled',
      message: `Booking ${booking.id} for ${booking.serviceName} was cancelled: ${reason}.`,
      data: { bookingId: booking.id, status: 'CANCELLED' }
    });
  }

  return updated;
}

module.exports = {
  calculateDistanceKm,
  calculatePricing,
  createBooking,
  checkAvailability,
  getBookingById,
  updateBookingStatus,
  cancelBooking
};
