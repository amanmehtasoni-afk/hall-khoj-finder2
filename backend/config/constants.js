/**
 * Hall Khoj Finder — System Constants & Role Segregation
 * Section 38: Strict server-side RBAC roles.
 */

module.exports = {
  ROLES: {
    CUSTOMER: 'customer',
    USER: 'user',       // Alias for customer
    OWNER: 'owner',
    STAFF: 'staff',
    ADMIN: 'admin'
  },

  STAFF_ROLES: {
    MANAGER: 'Manager',
    RECEPTIONIST: 'Receptionist',
    CLEANER: 'Cleaner',
    SECURITY: 'Security',
    CHEF: 'Chef',
    DECORATOR: 'Decorator',
    EVENT_COORDINATOR: 'Event Coordinator'
  },
  
  BOOKING_STATUS: {
    REQUESTED: 'REQUESTED',
    PENDING_OWNER_APPROVAL: 'PENDING_OWNER_APPROVAL',
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    ACCEPTED: 'ACCEPTED',
    CONFIRMED: 'CONFIRMED',
    REJECTED: 'REJECTED',
    CANCELLED: 'CANCELLED',
    COMPLETED: 'COMPLETED'
  },

  PAYMENT_STATUS: {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED',
    CANCELLED: 'CANCELLED'
  },

  LISTING_STATUS: {
    DRAFT: 'DRAFT',
    PENDING_APPROVAL: 'PENDING_APPROVAL',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    SUSPENDED: 'SUSPENDED',
    PAUSED: 'PAUSED'
  },

  CATEGORIES: [
    'Marriage Halls',
    'Cars',
    'Tent Houses',
    'Decoration',
    'Lighting',
    'Catering',
    'Photography',
    'DJ',
    'Sound System',
    'Furniture',
    'Flower Decoration',
    'Catering Staff',
    'Event Staff'
  ]
};
