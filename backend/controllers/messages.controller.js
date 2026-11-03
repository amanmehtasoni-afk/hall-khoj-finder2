/**
 * Hall Khoj Finder — Messages Controller
 */

const messageService = require('../services/message.service');
const { successResponse } = require('../utils/response');

async function send(req, res, next) {
  try {
    const { receiverId, bookingId, serviceId } = req.body;
    const content = req.body.content || req.body.text || req.body.message;
    const message = await messageService.sendMessage({
      senderId: req.user.id,
      senderName: req.user.name,
      senderRole: req.user.role,
      receiverId,
      bookingId,
      serviceId,
      content
    });
    return successResponse(res, message, 'Message sent successfully', 201);
  } catch (err) {
    next(err);
  }
}

async function getConversations(req, res, next) {
  try {
    const list = await messageService.getConversations(req.user.id);
    return successResponse(res, list, 'Conversations retrieved successfully');
  } catch (err) {
    next(err);
  }
}

async function getMessages(req, res, next) {
  try {
    const conversationId = req.params.conversationId;
    const messages = await messageService.getMessages(
      conversationId,
      req.user.id,
      req.user.role
    );
    return successResponse(res, messages, 'Message thread retrieved successfully');
  } catch (err) {
    next(err);
  }
}

async function markAsRead(req, res, next) {
  try {
    const conversationId = req.params.conversationId;
    const result = await messageService.markThreadAsRead(conversationId, req.user.id);
    return successResponse(res, result, 'Thread messages marked as read');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  send,
  getConversations,
  getMessages,
  markAsRead
};
