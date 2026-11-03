/**
 * Hall Khoj Finder — AI Controller (Phases 12 & 13)
 * Provides Grounded NLP Search & Owner AI Assistant endpoints.
 */

const aiService = require('../services/ai.service');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * POST /api/ai/search
 * Natural Language Search grounded in real verified listings
 */
async function searchWithAI(req, res, next) {
  try {
    const { prompt } = req.body;
    if (!prompt || !prompt.trim()) {
      return errorResponse(res, 'Search prompt is required', 'VALIDATION_ERROR', 400);
    }

    const data = await aiService.parseAndSearch(prompt);
    return successResponse(res, data, 'AI search completed successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/ai/parse
 * Backward-compatible parse endpoint returning interpretedFilters & groundedMatches
 */
async function parseQuery(req, res, next) {
  try {
    const { prompt } = req.body;
    if (!prompt || !prompt.trim()) {
      return errorResponse(res, 'Prompt text is required', 'VALIDATION_ERROR', 400);
    }

    const data = await aiService.parseAndSearch(prompt);
    return successResponse(res, {
      interpretedFilters: data.interpretedQuery,
      groundedMatches: data.results,
      message: data.summary
    }, 'Query parsed successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/ai/recommendations or POST /api/ai/recommendations
 */
async function getRecommendations(req, res, next) {
  try {
    const city = req.query?.city || req.body?.city;
    const category = req.query?.category || req.body?.category;
    const currentHallId = req.query?.currentHallId || req.body?.currentHallId;
    const limit = parseInt(req.query?.limit || req.body?.limit || 4, 10);

    const recommendations = await aiService.getRecommendations({
      city,
      category,
      currentHallId,
      limit
    });

    return successResponse(res, {
      recommendations,
      count: recommendations.length
    }, 'Contextual recommendations fetched successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/ai/owner/assistant
 * Inquiry drafting, performance analytics, competitive pricing, and proposed actions
 */
async function ownerAssistant(req, res, next) {
  try {
    const ownerId = req.user?.id || req.body.ownerId;
    const { intent, taskType, context } = req.body;
    const effectiveIntent = intent || taskType;

    if (!ownerId) {
      return errorResponse(res, 'Authentication required for Owner AI Assistant', 'AUTH_REQUIRED', 401);
    }
    if (!effectiveIntent) {
      return errorResponse(res, 'Assistant intent is required (e.g. INQUIRY_REPLY, ANALYZE_PERFORMANCE, SUGGEST_PRICING, PROPOSE_ACTION)', 'VALIDATION_ERROR', 400);
    }

    const result = await aiService.handleOwnerAssistantRequest({
      ownerId,
      intent: effectiveIntent,
      context: context || {}
    });

    return successResponse(res, result, 'Owner Assistant request processed successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/ai/owner/execute-action
 * Safely commits confirmed action after owner approval
 */
async function executeOwnerAction(req, res, next) {
  try {
    const ownerId = req.user?.id || req.body.ownerId;
    const { actionPayload, confirmed } = req.body;

    if (!ownerId) {
      return errorResponse(res, 'Authentication required', 'AUTH_REQUIRED', 401);
    }
    if (!actionPayload) {
      return errorResponse(res, 'Action payload is required', 'VALIDATION_ERROR', 400);
    }

    const result = await aiService.executeConfirmedAction({
      ownerId,
      actionPayload,
      confirmed: Boolean(confirmed)
    });

    return successResponse(res, result, 'Action execution processed');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  searchWithAI,
  parseQuery,
  getRecommendations,
  ownerAssistant,
  executeOwnerAction
};
