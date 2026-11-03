/**
 * Hall Khoj Finder — Grounded AI Routes (Phases 12 & 13)
 * /api/ai
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { authenticate, optionalAuthenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');

// Phase 12: Customer AI Search & Recommendations
router.post('/search', optionalAuthenticate, aiController.searchWithAI);
router.post('/parse', optionalAuthenticate, aiController.parseQuery);
router.get('/recommendations', optionalAuthenticate, aiController.getRecommendations);
router.post('/recommendations', optionalAuthenticate, aiController.getRecommendations);

// Phase 13: Owner AI Business Assistant
router.post('/owner/assistant', optionalAuthenticate, aiController.ownerAssistant);
router.post('/owner/execute-action', optionalAuthenticate, aiController.executeOwnerAction);

module.exports = router;
