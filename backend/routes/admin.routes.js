/**
 * Hall Khoj Finder — Admin Routes
 * /api/admin
 * Phase 6: Platform Administration with Strict RBAC
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, optionalAuthenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');

// Public / optional overview metrics
router.get('/metrics', optionalAuthenticate, adminController.getMetrics);

// All operational & management admin routes strictly require 'admin' role
const requireAdmin = [authenticate, authorize('admin')];

router.get('/verifications', ...requireAdmin, adminController.getVerificationQueue);
router.post('/verify-owner', ...requireAdmin, adminController.verifyOwner);
router.get('/users', ...requireAdmin, adminController.getUsers);
router.patch('/users/:id/status', ...requireAdmin, adminController.updateUserStatus);
router.get('/listings', ...requireAdmin, adminController.getListings);
router.patch('/listings/:id/status', ...requireAdmin, adminController.updateListingStatus);
router.get('/audit-logs', ...requireAdmin, adminController.getAuditLogs);

module.exports = router;
