/**
 * Hall Khoj Finder — Messages Routes
 * /api/messages
 */

const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messages.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.post('/', messagesController.send);
router.get('/conversations', messagesController.getConversations);
router.get('/:conversationId', messagesController.getMessages);
router.patch('/:conversationId/read', messagesController.markAsRead);

module.exports = router;
