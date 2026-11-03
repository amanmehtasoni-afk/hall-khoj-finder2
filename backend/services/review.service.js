/**
 * Hall Khoj Finder — Verified Reviews & Ratings Engine
 * Enforces business rule: ONLY customers with a completed booking (status === 'COMPLETED')
 * can submit verified reviews. Recalculates venue aggregated ratings and review counts.
 */

const firestore = require('./firestore.service');
const notificationService = require('./notification.service');
const { generateId } = require('../utils/idGenerator');

// Helper to resolve which collection a listing belongs to
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

// 1. Submit Verified Review (Restricted strictly to COMPLETED bookings)
async function createReview({
  bookingId,
  serviceId,
  customerId,
  customerName,
  customerCity = 'India',
  rating,
  title,
  comment,
  photos = []
}) {
  if (!bookingId) {
    const err = new Error('A valid completed booking ID is required to submit a verified review.');
    err.code = 'BOOKING_ID_REQUIRED';
    err.statusCode = 400;
    throw err;
  }

  // 1. Verify Booking Eligibility
  const booking = await firestore.getDocument('bookings', bookingId);
  if (!booking) {
    const err = new Error(`Booking ${bookingId} not found.`);
    err.code = 'BOOKING_NOT_FOUND';
    err.statusCode = 404;
    throw err;
  }

  // Rule 1: Must be customer's own booking
  if (booking.customerId !== customerId) {
    const err = new Error('You can only review your own bookings.');
    err.code = 'FORBIDDEN';
    err.statusCode = 403;
    throw err;
  }

  // Rule 2: Booking MUST be COMPLETED
  if (booking.status !== 'COMPLETED') {
    const err = new Error(`Only completed bookings can be reviewed. Current booking status is ${booking.status}.`);
    err.code = 'REVIEW_NOT_ELIGIBLE';
    err.statusCode = 400;
    throw err;
  }

  // Rule 3: Prevent duplicate reviews for the same booking
  const existingReviews = await firestore.queryCollection('reviews', r => r.bookingId === bookingId);
  if (existingReviews.length > 0) {
    const err = new Error('You have already submitted a review for this completed booking.');
    err.code = 'DUPLICATE_REVIEW';
    err.statusCode = 409;
    throw err;
  }

  const sId = serviceId || booking.serviceId;
  const numRating = Math.max(1, Math.min(5, parseFloat(rating) || 5));
  const reviewId = generateId('rev');
  const nowIso = new Date().toISOString();

  const review = {
    id: reviewId,
    bookingId,
    serviceId: sId,
    serviceName: booking.serviceName || 'Event Venue',
    customerId,
    customerName: customerName || booking.customerName || 'Customer',
    customerCity,
    rating: numRating,
    title: (title || 'Great Service Experience!').trim(),
    comment: (comment || '').trim(),
    photos: Array.isArray(photos) ? photos : [],
    verifiedBooking: true,
    ownerReply: null,
    status: 'APPROVED', // APPROVED | FLAGGED | HIDDEN
    createdAt: nowIso,
    updatedAt: nowIso
  };

  await firestore.setDocument('reviews', reviewId, review);

  // 2. Recalculate listing rating and review count
  await recalculateListingRating(sId);

  // 3. Notify Venue Owner
  if (booking.ownerId) {
    await notificationService.createNotification({
      userId: booking.ownerId,
      type: 'BOOKING_UPDATE',
      title: `New ${numRating}★ Review Received!`,
      message: `${review.customerName} left a ${numRating}-star review for ${review.serviceName}: "${review.title}".`,
      data: { reviewId, serviceId: sId, bookingId, rating: numRating }
    });
  }

  return review;
}

// Recalculate and update aggregated rating on the listing document
async function recalculateListingRating(serviceId) {
  const allReviews = await firestore.queryCollection('reviews', r => r.serviceId === serviceId && r.status === 'APPROVED');
  const { venue, collection } = await findListingAndCollection(serviceId);

  if (venue && collection) {
    const count = allReviews.length;
    let avg = 5.0;
    if (count > 0) {
      const sum = allReviews.reduce((acc, r) => acc + (r.rating || 5), 0);
      avg = Math.round((sum / count) * 10) / 10;
    }

    await firestore.updateDocument(collection, venue.id, {
      rating: avg,
      reviewCount: (venue.reviewCount || 0) + 1
    });
  }
}

// 2. Get Public Reviews for a Listing
async function getListingReviews(serviceId) {
  const reviews = await firestore.queryCollection('reviews', r => r.serviceId === serviceId && r.status === 'APPROVED');
  reviews.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  let avgRating = 0;
  if (reviews.length > 0) {
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    avgRating = Math.round((sum / reviews.length) * 10) / 10;
  }

  return {
    total: reviews.length,
    averageRating: avgRating,
    reviews
  };
}

// 3. Get All Reviews (Public listing with optional filtering)
async function getAllReviews(query = {}) {
  const reviews = await firestore.getCollection('reviews');
  let filtered = reviews.filter(r => r.status === 'APPROVED');
  if (query.serviceId) {
    filtered = filtered.filter(r => r.serviceId === query.serviceId);
  }
  if (query.rating) {
    filtered = filtered.filter(r => r.rating >= Number(query.rating));
  }
  filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  return filtered;
}

// 4. Get Reviews by Customer
async function getUserReviews(customerId) {
  const reviews = await firestore.queryCollection('reviews', r => r.customerId === customerId);
  reviews.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  return reviews;
}

// 4. Owner Reply to Review
async function replyToReview(reviewId, actorId, actorRole, replyText) {
  const review = await firestore.getDocument('reviews', reviewId);
  if (!review) {
    const err = new Error(`Review ${reviewId} not found`);
    err.code = 'REVIEW_NOT_FOUND';
    err.statusCode = 404;
    throw err;
  }

  const { venue } = await findListingAndCollection(review.serviceId);
  if (actorRole !== 'admin' && venue && venue.ownerId !== actorId && actorRole !== 'owner') {
    const err = new Error('You do not have permission to reply to this review.');
    err.code = 'FORBIDDEN';
    err.statusCode = 403;
    throw err;
  }

  const nowIso = new Date().toISOString();
  const ownerReply = {
    text: replyText.trim(),
    repliedAt: nowIso
  };

  const updated = await firestore.updateDocument('reviews', reviewId, {
    ownerReply,
    updatedAt: nowIso
  });

  // Notify customer
  if (review.customerId) {
    await notificationService.createNotification({
      userId: review.customerId,
      type: 'BOOKING_UPDATE',
      title: 'Owner Replied to Your Review',
      message: `The owner of ${review.serviceName} responded to your review.`,
      data: { reviewId, serviceId: review.serviceId }
    });
  }

  return updated;
}

// 5. Admin Moderation
async function moderateReview(reviewId, newStatus) {
  const review = await firestore.getDocument('reviews', reviewId);
  if (!review) {
    const err = new Error(`Review ${reviewId} not found`);
    err.code = 'REVIEW_NOT_FOUND';
    err.statusCode = 404;
    throw err;
  }

  const updated = await firestore.updateDocument('reviews', reviewId, {
    status: newStatus,
    updatedAt: new Date().toISOString()
  });

  await recalculateListingRating(review.serviceId);
  return updated;
}

// 6. Delete Review
async function deleteReview(reviewId, actorId, actorRole) {
  const review = await firestore.getDocument('reviews', reviewId);
  if (!review) {
    const err = new Error(`Review ${reviewId} not found`);
    err.code = 'REVIEW_NOT_FOUND';
    err.statusCode = 404;
    throw err;
  }

  if (actorRole !== 'admin' && review.customerId !== actorId) {
    const err = new Error('You do not have permission to delete this review.');
    err.code = 'FORBIDDEN';
    err.statusCode = 403;
    throw err;
  }

  await firestore.deleteDocument('reviews', reviewId);
  await recalculateListingRating(review.serviceId);
  return { id: reviewId, deleted: true };
}

module.exports = {
  createReview,
  getListingReviews,
  getAllReviews,
  getUserReviews,
  replyToReview,
  moderateReview,
  deleteReview
};
