/**
 * Hall Khoj Finder — Input Validation Middleware
 * Validates request schemas and enforces password complexity and required fields.
 */

const { errorResponse } = require('../utils/response');

function validateRegistration(req, res, next) {
  const { name, email, mobile, password } = req.body;

  if (!name || name.trim().length < 2) {
    return errorResponse(res, 'Full name is required (minimum 2 characters)', 'VALIDATION_ERROR', 400);
  }

  // Mobile number is strictly required (10 digits)
  const mobileRegex = /^[6-9]\d{9}$/;
  const cleanMobile = (mobile || '').replace(/[\s+-]/g, '').slice(-10);
  if (!mobileRegex.test(cleanMobile)) {
    return errorResponse(res, 'A valid 10-digit Indian mobile number is required (e.g. 9876543210)', 'VALIDATION_ERROR', 400);
  }

  // Email is completely optional
  if (email && email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return errorResponse(res, 'If provided, email must be a valid email address', 'VALIDATION_ERROR', 400);
    }
  }

  // Password Policy: Min 8 chars
  const pwd = password || '';
  if (pwd.length < 8) {
    return errorResponse(
      res,
      'Password must be at least 8 characters long',
      'WEAK_PASSWORD',
      400
    );
  }

  next();
}

function validateLogin(req, res, next) {
  const { email, mobile, identifier, password } = req.body;
  const userIdentifier = mobile || identifier || email;
  if (!userIdentifier || !password) {
    return errorResponse(res, 'Mobile number and password are required', 'VALIDATION_ERROR', 400);
  }
  next();
}

function validateBooking(req, res, next) {
  const serviceId = req.body.serviceId || req.body.venueId || req.body.hallId;
  req.body.serviceId = serviceId;
  const name = req.body.name || req.body.customerName;
  const mobile = req.body.mobile || req.body.customerMobile;
  const email = req.body.email || req.body.customerEmail || '';
  req.body.name = name;
  req.body.mobile = mobile;
  req.body.email = email;
  const { eventDate, timeSlot, guestCount } = req.body;

  if (!serviceId) {
    return errorResponse(res, 'Service / Venue ID is required', 'VALIDATION_ERROR', 400);
  }

  if (!eventDate || isNaN(Date.parse(eventDate))) {
    return errorResponse(res, 'A valid event date is required (YYYY-MM-DD)', 'VALIDATION_ERROR', 400);
  }

  const validSlots = ['Morning', 'Afternoon', 'Evening', 'Night', 'Full Day'];
  let normalizedSlot = timeSlot;
  if (timeSlot) {
    const matched = validSlots.find(s => timeSlot.toLowerCase().startsWith(s.toLowerCase()));
    if (matched) normalizedSlot = matched;
  }
  req.body.timeSlot = normalizedSlot;

  if (!normalizedSlot || !validSlots.includes(normalizedSlot)) {
    return errorResponse(res, `Time slot must be one of: [${validSlots.join(', ')}]`, 'VALIDATION_ERROR', 400);
  }

  if (!guestCount || parseInt(guestCount, 10) <= 0) {
    return errorResponse(res, 'Guest count must be greater than zero', 'VALIDATION_ERROR', 400);
  }

  if (!name || !mobile) {
    return errorResponse(res, 'Customer name and 10-digit mobile number are required', 'VALIDATION_ERROR', 400);
  }

  next();
}

module.exports = {
  validateRegistration,
  validateLogin,
  validateBooking
};
