/**
 * Hall Khoj Finder — Owner Routes
 * /api/owners
 */

const express = require('express');
const router = express.Router();
const ownersController = require('../controllers/owners.controller');
const { authenticate, optionalAuthenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');

router.get('/stats', optionalAuthenticate, ownersController.getStats);
router.get('/profile', optionalAuthenticate, ownersController.getProfile);
router.patch('/profile', authenticate, authorize('owner', 'admin'), ownersController.updateProfile);
router.get('/listings', optionalAuthenticate, ownersController.getMyListings);
router.get('/analytics', optionalAuthenticate, ownersController.getAnalytics);
router.post('/block-date', optionalAuthenticate, ownersController.blockDate);
router.post('/unblock-date', optionalAuthenticate, ownersController.unblockDate);
router.post('/verify-email/send', optionalAuthenticate, ownersController.sendEmailVerification);
router.post('/verify-email/confirm', optionalAuthenticate, ownersController.confirmEmailVerification);

module.exports = router;
