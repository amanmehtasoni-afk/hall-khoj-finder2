/**
 * Hall Khoj Finder — Customer-Owner Chat & Messaging Service
 * Protected direct messaging linked to event bookings & service inquiries with
 * participant authorization, unread tracking, and automated alert notifications.
 */

const firestore = require('./firestore.service');
const notificationService = require('./notification.service');
const { generateId } = require('../utils/idGenerator');

// Deterministic conversation ID generator
function resolveConversationId(bookingId, serviceId, userId1, userId2) {
  if (bookingId) {
    return `conv_b_${bookingId}`;
  }
  const sortedUsers = [userId1, userId2].sort();
  const sId = serviceId || 'general';
  return `conv_${sId}_${sortedUsers[0]}_${sortedUsers[1]}`;
}

async function sendMessage({
  senderId,
  senderName,
  senderRole,
  receiverId,
  bookingId,
  serviceId,
  content
}) {
  if (!content || content.trim().length === 0) {
    const err = new Error('Message content cannot be empty');
    err.code = 'VALIDATION_ERROR';
    err.statusCode = 400;
    throw err;
  }

  if (!receiverId) {
    const err = new Error('Receiver ID is required');
    err.code = 'VALIDATION_ERROR';
    err.statusCode = 400;
    throw err;
  }

  if (senderId === receiverId) {
    const err = new Error('Cannot send a message to yourself');
    err.code = 'SELF_MESSAGE_NOT_ALLOWED';
    err.statusCode = 400;
    throw err;
  }

  // Resolve service name and receiver name
  let serviceName = 'Event Service';
  if (bookingId) {
    const booking = await firestore.getDocument('bookings', bookingId);
    if (booking) {
      serviceName = booking.serviceName || serviceName;
      if (!serviceId) serviceId = booking.serviceId;
    }
  } else if (serviceId) {
    const halls = await firestore.getDocument('halls', serviceId);
    if (halls) serviceName = halls.name;
    else {
      const services = await firestore.getDocument('services', serviceId);
      if (services) serviceName = services.name;
      else {
        const cars = await firestore.getDocument('cars', serviceId);
        if (cars) serviceName = cars.name;
        else {
          const tents = await firestore.getDocument('tent_houses', serviceId);
          if (tents) serviceName = tents.name;
        }
      }
    }
  }

  const receiver = await firestore.getDocument('users', receiverId);
  const receiverName = receiver ? receiver.name : 'User';

  const conversationId = resolveConversationId(bookingId, serviceId, senderId, receiverId);
  const messageId = generateId('msg');
  const nowIso = new Date().toISOString();

  const message = {
    id: messageId,
    conversationId,
    bookingId: bookingId || null,
    serviceId: serviceId || null,
    serviceName,
    senderId,
    senderName: senderName || 'User',
    senderRole: (senderRole === 'user' || senderRole === 'customer') ? 'customer' : (senderRole || 'customer'),
    receiverId,
    receiverName,
    content: content.trim(),
    read: false,
    createdAt: nowIso,
    readAt: null
  };

  await firestore.setDocument('messages', messageId, message);

  // Dispatch real notification to receiver
  await notificationService.createNotification({
    userId: receiverId,
    type: 'MESSAGE',
    title: `New Message from ${senderName || 'Partner'}`,
    message: content.trim().length > 60 ? `${content.trim().slice(0, 60)}...` : content.trim(),
    data: {
      messageId,
      conversationId,
      bookingId,
      serviceId,
      senderId,
      senderName
    }
  });

  return message;
}

async function getConversations(userId) {
  // Fetch messages where user is either sender or receiver
  const allMessages = await firestore.queryCollection('messages', m => 
    m.senderId === userId || m.receiverId === userId
  );

  const threadMap = {};

  allMessages.forEach(msg => {
    const cId = msg.conversationId;
    if (!threadMap[cId]) {
      const isSender = msg.senderId === userId;
      threadMap[cId] = {
        conversationId: cId,
        bookingId: msg.bookingId,
        serviceId: msg.serviceId,
        serviceName: msg.serviceName,
        otherParticipant: {
          id: isSender ? msg.receiverId : msg.senderId,
          name: isSender ? msg.receiverName : msg.senderName,
          role: isSender ? (msg.receiverId.includes('owner') ? 'owner' : 'partner') : msg.senderRole
        },
        unreadCount: 0,
        lastMessage: null,
        updatedAt: msg.createdAt
      };
    }

    // Unread count for current user
    if (msg.receiverId === userId && !msg.read) {
      threadMap[cId].unreadCount++;
    }

    // Track latest message
    if (!threadMap[cId].lastMessage || new Date(msg.createdAt) > new Date(threadMap[cId].lastMessage.createdAt)) {
      threadMap[cId].lastMessage = {
        id: msg.id,
        content: msg.content,
        senderId: msg.senderId,
        senderName: msg.senderName,
        createdAt: msg.createdAt,
        read: msg.read
      };
      threadMap[cId].updatedAt = msg.createdAt;
    }
  });

  const conversationList = Object.values(threadMap);
  conversationList.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

  return conversationList;
}

async function getMessages(conversationId, actorId, actorRole) {
  const messages = await firestore.queryCollection('messages', m => m.conversationId === conversationId);

  // Participant authorization check
  if (actorRole !== 'admin' && messages.length > 0) {
    const isParticipant = messages.some(m => m.senderId === actorId || m.receiverId === actorId);
    if (!isParticipant) {
      const err = new Error('You do not have permission to view messages in this conversation.');
      err.code = 'FORBIDDEN';
      err.statusCode = 403;
      throw err;
    }
  }

  // Sort chronologically ascending
  messages.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));

  return messages;
}

async function markThreadAsRead(conversationId, userId) {
  const unreadMessages = await firestore.queryCollection('messages', m => 
    m.conversationId === conversationId && m.receiverId === userId && !m.read
  );

  const nowIso = new Date().toISOString();
  for (const msg of unreadMessages) {
    await firestore.updateDocument('messages', msg.id, {
      read: true,
      readAt: nowIso
    });
  }

  return { count: unreadMessages.length };
}

module.exports = {
  sendMessage,
  getConversations,
  getMessages,
  markThreadAsRead,
  resolveConversationId
};
