/**
 * Hall Khoj Finder — Payments Routes (Phase 15)
 * /api/payments
 */

const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/payments.controller');
const { authenticate, optionalAuthenticate } = require('../middleware/auth.middleware');

router.post('/create-order', optionalAuthenticate, paymentsController.createOrder);
router.post('/verify', optionalAuthenticate, paymentsController.verify);
router.post('/refund', optionalAuthenticate, paymentsController.refund);
router.get('/history', optionalAuthenticate, paymentsController.getHistory);
router.get('/:bookingId', optionalAuthenticate, paymentsController.getByBooking);

module.exports = router;
