/**
 * Hall Khoj Finder — Staff Management Controller
 * Section 33: Role-based staff management. Staff cannot grant themselves owner permissions.
 */

const firestore = require('../services/firestore.service');
const { successResponse, errorResponse } = require('../utils/response');
const { generateId } = require('../utils/idGenerator');
const { STAFF_ROLES } = require('../config/constants');

async function listStaff(req, res, next) {
  try {
    const ownerId = req.user ? req.user.id : 'owner_101';
    const staffList = await firestore.queryCollection('staff', s => s.ownerId === ownerId || s.ownerId === 'owner_101');
    return successResponse(res, staffList, 'Staff members retrieved');
  } catch (err) {
    next(err);
  }
}

async function addStaff(req, res, next) {
  try {
    const { name, mobile, role, experience, description } = req.body;

    if (!name || !mobile || !role) {
      return errorResponse(res, 'Name, mobile, and role are required', 'VALIDATION_ERROR', 400);
    }

    const validRoles = Object.values(STAFF_ROLES);
    if (!validRoles.includes(role)) {
      return errorResponse(res, `Role must be one of: [${validRoles.join(', ')}]`, 'VALIDATION_ERROR', 400);
    }

    const staffId = generateId('stf');
    const newStaff = {
      id: staffId,
      ownerId: req.user ? req.user.id : 'owner_101',
      name: name.trim(),
      mobile: mobile.trim(),
      role: role,
      experience: experience || '1 year',
      description: description || '',
      createdAt: new Date().toISOString()
    };

    await firestore.setDocument('staff', staffId, newStaff);
    return successResponse(res, newStaff, 'Staff member added successfully', 201);
  } catch (err) {
    next(err);
  }
}

async function removeStaff(req, res, next) {
  try {
    const { id } = req.params;
    const staff = await firestore.getDocument('staff', id);
    if (!staff) {
      return errorResponse(res, 'Staff member not found', 'NOT_FOUND', 404);
    }

    if (req.user && req.user.role !== 'admin' && staff.ownerId !== req.user.id) {
      return errorResponse(res, 'Unauthorized to remove this staff member', 'FORBIDDEN', 403);
    }

    await firestore.deleteDocument('staff', id);
    return successResponse(res, { id }, 'Staff member removed successfully');
  } catch (err) {
    next(err);
  }
}

async function updateStaff(req, res, next) {
  try {
    const { id } = req.params;
    const staff = await firestore.getDocument('staff', id);
    if (!staff) {
      return errorResponse(res, 'Staff member not found', 'NOT_FOUND', 404);
    }

    if (req.user && req.user.role !== 'admin' && staff.ownerId !== req.user.id) {
      return errorResponse(res, 'Unauthorized to update this staff member', 'FORBIDDEN', 403);
    }

    const { name, mobile, role, experience, description, status } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (mobile) updates.mobile = mobile.trim();
    if (role) updates.role = role;
    if (experience) updates.experience = experience;
    if (description !== undefined) updates.description = description;
    if (status) updates.status = status;
    updates.updatedAt = new Date().toISOString();

    const updated = await firestore.updateDocument('staff', id, updates);
    return successResponse(res, updated, 'Staff member updated successfully');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listStaff,
  addStaff,
  updateStaff,
  removeStaff
};
