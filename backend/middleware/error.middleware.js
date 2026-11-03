/**
 * Hall Khoj Finder — Central Error Handling Middleware
 * Ensures no raw stack traces leak to client and returns standardized JSON errors.
 */

const { errorResponse } = require('../utils/response');

function errorHandler(err, req, res, next) {
  console.error(`❌ [API Error] ${req.method} ${req.url}:`, err.message);
  if (err.stack && process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected server error occurred. Please try again later.';

  return errorResponse(res, message, code, statusCode);
}

function notFoundHandler(req, res) {
  return errorResponse(
    res,
    `API endpoint ${req.method} ${req.originalUrl} not found`,
    'ENDPOINT_NOT_FOUND',
    404
  );
}

module.exports = {
  errorHandler,
  notFoundHandler
};
