/**
 * Hall Khoj Finder — Standardized API Response Utilities
 * Matches Section 37 JSON format requirements.
 */

function successResponse(res, data = {}, message = 'Operation successful', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

function errorResponse(res, message = 'An error occurred', code = 'INTERNAL_ERROR', statusCode = 500, details = null) {
  const payload = {
    success: false,
    message,
    code
  };
  if (details && process.env.NODE_ENV !== 'production') {
    payload.details = details;
  }
  return res.status(statusCode).json(payload);
}

module.exports = {
  successResponse,
  errorResponse
};
