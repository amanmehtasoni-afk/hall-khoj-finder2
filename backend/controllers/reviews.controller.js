/**
 * Hall Khoj Finder — Reviews Controller
 */

const reviewService = require('../services/review.service');
const { successResponse, errorResponse } = require('../utils/response');

async function create(req, res, next) {
  try {
    const { bookingId, serviceId, rating, title, comment, photos, customerCity } = req.body;
    if (!bookingId || !rating) {
      return errorResponse(res, 'bookingId and rating are required', 'VALIDATION_ERROR', 400);
    }

    const review = await reviewService.createReview({
      bookingId,
      serviceId,
      customerId: req.user.id,
      customerName: req.user.name,
      customerCity: customerCity || req.user.city || 'India',
      rating,
      title,
      comment,
      photos
    });

    return successResponse(res, review, 'Verified review submitted successfully', 201);
  } catch (err) {
    next(err);
  }
}

async function getAll(req, res, next) {
  try {
    const reviews = await reviewService.getAllReviews(req.query);
    return successResponse(res, reviews, 'Reviews retrieved successfully');
  } catch (err) {
    next(err);
  }
}

async function getListingReviews(req, res, next) {
  try {
    const serviceId = req.params.serviceId;
    const data = await reviewService.getListingReviews(serviceId);
    return successResponse(res, data, 'Listing reviews retrieved successfully');
  } catch (err) {
    next(err);
  }
}

async function getUserReviews(req, res, next) {
  try {
    const reviews = await reviewService.getUserReviews(req.user.id);
    return successResponse(res, reviews, 'Customer reviews retrieved successfully');
  } catch (err) {
    next(err);
  }
}

async function reply(req, res, next) {
  try {
    const reviewId = req.params.id;
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return errorResponse(res, 'Reply text is required', 'VALIDATION_ERROR', 400);
    }

    const updated = await reviewService.replyToReview(
      reviewId,
      req.user.id,
      req.user.role,
      text
    );
    return successResponse(res, updated, 'Owner reply posted successfully');
  } catch (err) {
    next(err);
  }
}

async function moderate(req, res, next) {
  try {
    const reviewId = req.params.id;
    const { status } = req.body;
    if (!status || !['APPROVED', 'FLAGGED', 'HIDDEN'].includes(status)) {
      return errorResponse(res, 'Valid status is required (APPROVED, FLAGGED, HIDDEN)', 'VALIDATION_ERROR', 400);
    }

    const updated = await reviewService.moderateReview(reviewId, status);
    return successResponse(res, updated, `Review status updated to ${status}`);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const reviewId = req.params.id;
    const result = await reviewService.deleteReview(reviewId, req.user.id, req.user.role);
    return successResponse(res, result, 'Review deleted successfully');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  getAll,
  getListingReviews,
  getUserReviews,
  reply,
  moderate,
  remove
};
