/**
 * Hall Khoj Finder — Notifications Routes
 * /api/notifications
 */

const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notifications.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/', notificationsController.getNotifications);
router.patch('/read-all', notificationsController.markAllAsRead);
router.patch('/:id/read', notificationsController.markAsRead);
router.delete('/:id', notificationsController.deleteNotification);

module.exports = router;
