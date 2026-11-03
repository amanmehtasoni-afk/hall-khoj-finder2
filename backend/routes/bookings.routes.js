/**
 * Hall Khoj Finder — Bookings Routes
 * /api/bookings
 */

const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookings.controller');
const { validateBooking } = require('../middleware/validate.middleware');
const { authenticate, optionalAuthenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');

router.post('/', optionalAuthenticate, validateBooking, bookingsController.create);
router.get('/check-availability', bookingsController.checkAvailability);
router.get('/user', authenticate, bookingsController.getUserBookings);
router.get('/owner', authenticate, authorize('owner', 'admin'), bookingsController.getOwnerBookings);
router.get('/:id', authenticate, bookingsController.getById);
router.get('/:id/invoice', optionalAuthenticate, bookingsController.downloadInvoice);
router.patch('/:id/status', authenticate, authorize('owner', 'admin'), bookingsController.updateStatus);
router.post('/:id/cancel', authenticate, bookingsController.cancel);

module.exports = router;
