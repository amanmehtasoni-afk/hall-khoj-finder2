/**
 * Hall Khoj Finder — Notifications Controller
 */

const notificationService = require('../services/notification.service');
const { successResponse } = require('../utils/response');

async function getNotifications(req, res, next) {
  try {
    const userId = req.user.id;
    const { unreadOnly, limit } = req.query;
    const result = await notificationService.getUserNotifications(userId, {
      unreadOnly: unreadOnly === 'true',
      limit
    });
    return successResponse(res, result, 'User notifications retrieved');
  } catch (err) {
    next(err);
  }
}

async function markAsRead(req, res, next) {
  try {
    const updated = await notificationService.markAsRead(req.params.id, req.user.id);
    return successResponse(res, updated, 'Notification marked as read');
  } catch (err) {
    next(err);
  }
}

async function markAllAsRead(req, res, next) {
  try {
    const result = await notificationService.markAllAsRead(req.user.id);
    return successResponse(res, result, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
}

async function deleteNotification(req, res, next) {
  try {
    const result = await notificationService.deleteNotification(req.params.id, req.user.id);
    return successResponse(res, result, 'Notification deleted');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
