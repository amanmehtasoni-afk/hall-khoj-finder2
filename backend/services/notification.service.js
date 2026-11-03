/**
 * Hall Khoj Finder — Notification Service
 * Manages in-app notifications, unread tracking, and dispatching alerts for
 * booking transitions, customer-owner messages, KYC verifications, and system events.
 */

const firestore = require('./firestore.service');
const { generateId } = require('../utils/idGenerator');

async function createNotification({ userId, type = 'SYSTEM', title, message, data = {} }) {
  if (!userId) return null;

  const notifId = generateId('notif');
  const nowIso = new Date().toISOString();

  const notification = {
    id: notifId,
    userId,
    type, // 'BOOKING_REQUEST' | 'BOOKING_UPDATE' | 'MESSAGE' | 'KYC_UPDATE' | 'SYSTEM'
    title,
    message,
    data,
    read: false,
    createdAt: nowIso,
    readAt: null
  };

  await firestore.setDocument('notifications', notifId, notification);
  return notification;
}

async function getUserNotifications(userId, { unreadOnly = false, limit = 50 } = {}) {
  let allNotifs = await firestore.queryCollection('notifications', n => n.userId === userId);

  const unreadCount = allNotifs.filter(n => !n.read).length;

  if (unreadOnly) {
    allNotifs = allNotifs.filter(n => !n.read);
  }

  // Sort newest first
  allNotifs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  const l = Math.max(1, Math.min(100, parseInt(limit, 10) || 50));
  const paginated = allNotifs.slice(0, l);

  return {
    unreadCount,
    total: allNotifs.length,
    notifications: paginated
  };
}

async function markAsRead(notificationId, userId) {
  const notif = await firestore.getDocument('notifications', notificationId);
  if (!notif) {
    const err = new Error(`Notification ${notificationId} not found`);
    err.code = 'NOTIFICATION_NOT_FOUND';
    err.statusCode = 404;
    throw err;
  }

  if (notif.userId !== userId) {
    const err = new Error('You do not have permission to modify this notification.');
    err.code = 'FORBIDDEN';
    err.statusCode = 403;
    throw err;
  }

  const updated = await firestore.updateDocument('notifications', notificationId, {
    read: true,
    readAt: new Date().toISOString()
  });

  return updated;
}

async function markAllAsRead(userId) {
  const userNotifs = await firestore.queryCollection('notifications', n => n.userId === userId && !n.read);
  const nowIso = new Date().toISOString();

  for (const notif of userNotifs) {
    await firestore.updateDocument('notifications', notif.id, {
      read: true,
      readAt: nowIso
    });
  }

  return { count: userNotifs.length };
}

async function deleteNotification(notificationId, userId) {
  const notif = await firestore.getDocument('notifications', notificationId);
  if (!notif) {
    const err = new Error(`Notification ${notificationId} not found`);
    err.code = 'NOTIFICATION_NOT_FOUND';
    err.statusCode = 404;
    throw err;
  }

  if (notif.userId !== userId) {
    const err = new Error('You do not have permission to delete this notification.');
    err.code = 'FORBIDDEN';
    err.statusCode = 403;
    throw err;
  }

  await firestore.deleteDocument('notifications', notificationId);
  return { id: notificationId, deleted: true };
}

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
