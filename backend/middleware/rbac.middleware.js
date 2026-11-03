/**
 * Hall Khoj Finder — Role-Based Access Control (RBAC) Middleware
 * Never trusts client role statements. Enforces server-verified authorization.
 */

const { errorResponse } = require('../utils/response');

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required before authorization check', 'UNAUTHORIZED', 401);
    }

    const userRole = req.user.role || 'customer';
    // Support customer & user as equivalent interchangeable roles
    const normalizedUserRole = userRole === 'user' ? 'customer' : userRole;
    const normalizedAllowed = allowedRoles.map(r => r === 'user' ? 'customer' : r);

    if (userRole === 'admin' || normalizedAllowed.includes(normalizedUserRole)) {
      return next();
    }

    return errorResponse(
      res,
      `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]`,
      'FORBIDDEN',
      403
    );
  };
}

module.exports = {
  authorize
};
