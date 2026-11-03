/**
 * Hall Khoj Finder — Halls Controller
 */

const firestore = require('../services/firestore.service');
const { successResponse, errorResponse } = require('../utils/response');
const { generateId } = require('../utils/idGenerator');

async function list(req, res, next) {
  try {
    const halls = await firestore.getCollection('halls');
    return successResponse(res, halls, 'Halls retrieved successfully');
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const hall = await firestore.getDocument('halls', req.params.id);
    if (!hall) {
      return errorResponse(res, `Venue with ID ${req.params.id} not found`, 'NOT_FOUND', 404);
    }
    return successResponse(res, hall, 'Hall details retrieved');
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const ownerId = req.user ? req.user.id : (req.body.ownerId || 'owner_101');
    const { name, city, forceDuplicate, status, isDraft } = req.body;

    // Duplicate check (Requirement 22)
    if (!forceDuplicate && name && city) {
      const allHalls = await firestore.getCollection('halls');
      const cleanName = name.trim().toLowerCase();
      const cleanCity = city.trim().toLowerCase();

      const duplicate = allHalls.find(h => 
        (h.ownerId === ownerId || h.ownerId === 'owner_101') &&
        h.name && h.name.trim().toLowerCase() === cleanName &&
        h.city && h.city.trim().toLowerCase() === cleanCity
      );

      if (duplicate) {
        return res.status(409).json({
          success: false,
          code: 'DUPLICATE_WARNING',
          message: 'A similar hall listing already exists with this name and location.',
          existingHall: {
            id: duplicate.id,
            name: duplicate.name,
            city: duplicate.city,
            status: duplicate.status
          }
        });
      }
    }

    const hallId = generateId('h');
    const initialStatus = isDraft ? 'DRAFT' : (status || 'PENDING_APPROVAL');

    const newHall = {
      ...req.body,
      id: hallId,
      ownerId: ownerId,
      status: initialStatus,
      rating: 5.0,
      reviewCount: 0,
      verified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    delete newHall.forceDuplicate;
    delete newHall.isDraft;

    await firestore.setDocument('halls', hallId, newHall);
    return successResponse(res, newHall, isDraft ? 'Draft saved successfully' : 'Listing submitted for admin approval', 201);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const hall = await firestore.getDocument('halls', req.params.id);
    if (!hall) {
      return errorResponse(res, 'Venue not found', 'NOT_FOUND', 404);
    }
    if (req.user && req.user.role !== 'admin' && hall.ownerId !== req.user.id) {
      return errorResponse(res, 'Unauthorized to edit this venue', 'FORBIDDEN', 403);
    }
    const updated = await firestore.updateDocument('halls', req.params.id, {
      ...req.body,
      updatedAt: new Date().toISOString()
    });
    return successResponse(res, updated, 'Hall updated successfully');
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { status, reason } = req.body;
    if (!status) {
      return errorResponse(res, 'Status is required', 'VALIDATION_ERROR', 400);
    }
    const hall = await firestore.getDocument('halls', req.params.id);
    if (!hall) {
      return errorResponse(res, 'Venue not found', 'NOT_FOUND', 404);
    }
    if (req.user && req.user.role !== 'admin' && hall.ownerId !== req.user.id) {
      return errorResponse(res, 'Unauthorized to update status', 'FORBIDDEN', 403);
    }
    const updates = { status, updatedAt: new Date().toISOString() };
    if (reason) updates.rejectionReason = reason;

    const updated = await firestore.updateDocument('halls', req.params.id, updates);
    return successResponse(res, updated, `Listing status updated to ${status}`);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const hall = await firestore.getDocument('halls', req.params.id);
    if (!hall) {
      return errorResponse(res, 'Venue not found', 'NOT_FOUND', 404);
    }
    if (req.user && req.user.role !== 'admin' && hall.ownerId !== req.user.id) {
      return errorResponse(res, 'Unauthorized to delete this venue', 'FORBIDDEN', 403);
    }
    await firestore.deleteDocument('halls', req.params.id);
    return successResponse(res, { id: req.params.id }, 'Venue deleted successfully');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  updateStatus,
  remove
};

