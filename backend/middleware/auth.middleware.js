/**
 * Hall Khoj Finder — Authentication Middleware
 * Extracts and verifies JWT bearer token from request headers.
 */

const { verifyToken } = require('../services/auth.service');
const { errorResponse } = require('../utils/response');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Authentication token missing or invalid', 'UNAUTHORIZED', 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return errorResponse(res, 'Session expired or invalid token', 'UNAUTHORIZED', 401);
  }

  req.user = decoded;
  next();
}

// Optional Auth (for public search routes that personalize if user is logged in)
function optionalAuthenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }
  next();
}

module.exports = {
  authenticate,
  optionalAuthenticate
};
