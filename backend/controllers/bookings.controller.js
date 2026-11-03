/**
 * Hall Khoj Finder — Bookings Controller
 */

const bookingService = require('../services/booking.service');
const firestore = require('../services/firestore.service');
const { successResponse, errorResponse } = require('../utils/response');

async function create(req, res, next) {
  try {
    const serviceId = req.body.serviceId || req.body.venueId || req.body.hallId;
    const booking = await bookingService.createBooking({
      ...req.body,
      serviceId,
      customerId: req.user ? req.user.id : (req.body.customerId || 'guest_customer')
    });
    return successResponse(res, booking, 'Booking request submitted successfully', 201);
  } catch (err) {
    next(err);
  }
}

async function checkAvailability(req, res, next) {
  try {
    const { serviceId, venueId, hallId, date } = req.query;
    const id = serviceId || venueId || hallId;
    if (!id || !date) {
      return errorResponse(res, 'serviceId and date are required query parameters', 'VALIDATION_ERROR', 400);
    }
    const result = await bookingService.checkAvailability(id, date);
    return successResponse(res, result, 'Availability checked successfully');
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const bookingId = req.params.id;
    const booking = await bookingService.getBookingById(
      bookingId,
      req.user ? req.user.id : '',
      req.user ? req.user.role : ''
    );
    return successResponse(res, booking, 'Booking retrieved successfully');
  } catch (err) {
    next(err);
  }
}

async function getUserBookings(req, res, next) {
  try {
    const userId = req.user.id;
    const { status, tab } = req.query;
    let bookings = await firestore.queryCollection('bookings', b => b.customerId === userId || b.customerEmail === req.user.email);

    // Tabbed filtering
    if (tab) {
      const lowerTab = tab.toLowerCase();
      if (lowerTab === 'upcoming') {
        bookings = bookings.filter(b => ['ACCEPTED', 'CONFIRMED'].includes(b.status));
      } else if (lowerTab === 'pending') {
        bookings = bookings.filter(b => ['REQUESTED', 'PENDING'].includes(b.status));
      } else if (lowerTab === 'completed') {
        bookings = bookings.filter(b => b.status === 'COMPLETED');
      } else if (lowerTab === 'cancelled') {
        bookings = bookings.filter(b => ['CANCELLED', 'REJECTED'].includes(b.status));
      }
    } else if (status && status !== 'all') {
      const upperStatus = status.toUpperCase();
      bookings = bookings.filter(b => b.status === upperStatus);
    }

    // Sort newest first
    bookings.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return successResponse(res, bookings, 'Customer bookings retrieved');
  } catch (err) {
    next(err);
  }
}

async function getOwnerBookings(req, res, next) {
  try {
    const ownerId = req.user.id;
    const bookings = await firestore.queryCollection('bookings', b => b.ownerId === ownerId || b.ownerId === 'owner_101');
    bookings.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return successResponse(res, bookings, 'Owner incoming bookings retrieved');
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { status, note } = req.body;
    if (!status) {
      return errorResponse(res, 'New status is required', 'VALIDATION_ERROR', 400);
    }
    const updated = await bookingService.updateBookingStatus(
      req.params.id,
      status,
      req.user.id,
      req.user.role,
      note
    );
    return successResponse(res, updated, `Booking status updated to ${status}`);
  } catch (err) {
    next(err);
  }
}

async function cancel(req, res, next) {
  try {
    const { reason } = req.body;
    const updated = await bookingService.cancelBooking(
      req.params.id,
      req.user.id,
      req.user.role,
      reason || 'Cancelled by user'
    );
    return successResponse(res, updated, 'Booking cancelled successfully');
  } catch (err) {
    next(err);
  }
}

async function downloadInvoice(req, res, next) {
  try {
    const bookingId = req.params.id;
    const actorId = req.user ? req.user.id : '';
    const actorRole = req.user ? req.user.role : '';
    const booking = await bookingService.getBookingById(bookingId, actorId, actorRole);
    const invoiceService = require('../services/invoice.service');
    return invoiceService.generateBookingInvoicePdf(booking, res);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  checkAvailability,
  getById,
  getUserBookings,
  getOwnerBookings,
  updateStatus,
  cancel,
  downloadInvoice
};

