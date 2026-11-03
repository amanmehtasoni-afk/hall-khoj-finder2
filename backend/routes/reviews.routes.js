/**
 * Hall Khoj Finder — Reviews Routes
 * /api/reviews
 */

const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviews.controller');
const { authenticate, optionalAuthenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');

// Public read endpoint for listing reviews
router.get('/', reviewsController.getAll);
router.get('/listing/:serviceId', reviewsController.getListingReviews);

// Customer endpoints
router.post('/', authenticate, reviewsController.create);
router.get('/user', authenticate, reviewsController.getUserReviews);
router.delete('/:id', authenticate, reviewsController.remove);

// Owner reply endpoint
router.post('/:id/reply', authenticate, authorize('owner', 'admin'), reviewsController.reply);

// Admin moderation endpoint
router.patch('/:id/status', authenticate, authorize('admin'), reviewsController.moderate);

module.exports = router;
