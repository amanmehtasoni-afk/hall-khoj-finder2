/**
 * Hall Khoj Finder — ID Generator
 * Generates official formatted IDs (e.g. HKF-2026-000123 for bookings).
 */

function generateBookingId() {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `HKF-${year}-${randomDigits}`;
}

function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
}

module.exports = {
  generateBookingId,
  generateId
};
