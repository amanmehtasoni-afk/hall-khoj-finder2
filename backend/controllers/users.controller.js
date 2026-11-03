/**
 * Hall Khoj Finder — Users Controller
 * Phase 4: Customer System & Extended Profile Management
 */

const firestore = require('../services/firestore.service');
const { successResponse, errorResponse } = require('../utils/response');

// 1. Get Full User Profile
async function getProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const user = await firestore.getDocument('users', userId);
    if (!user) {
      return errorResponse(res, 'User profile not found', 'NOT_FOUND', 404);
    }

    const safeUser = { ...user };
    delete safeUser.password;

    // Ensure array fields exist
    safeUser.favorites = safeUser.favorites || [];
    safeUser.savedLocations = safeUser.savedLocations || [];

    return successResponse(res, safeUser, 'User profile retrieved successfully');
  } catch (err) {
    next(err);
  }
}

// 2. Update Customer Profile (Name, Mobile, Address, Location, Photo)
async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const existing = await firestore.getDocument('users', userId);
    if (!existing) {
      return errorResponse(res, 'User profile not found', 'NOT_FOUND', 404);
    }

    const {
      name,
      mobile,
      profilePhoto,
      address,
      state,
      district,
      city,
      village,
      pinCode
    } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (mobile !== undefined) updates.mobile = mobile.trim();
    if (profilePhoto !== undefined) updates.profilePhoto = profilePhoto.trim();
    if (address !== undefined) updates.address = address.trim();
    if (state !== undefined) updates.state = state.trim();
    if (district !== undefined) updates.district = district.trim();
    if (city !== undefined) updates.city = city.trim();
    if (village !== undefined) updates.village = village.trim();
    if (pinCode !== undefined) updates.pinCode = pinCode.trim();

    // STRICT SECURITY: Forbid client-side role or verification status modification
    delete updates.role;
    delete updates.isVerified;
    delete updates.id;
    delete updates.email;
    delete updates.password;

    const updatedUser = await firestore.updateDocument('users', userId, updates);
    const safeUser = { ...updatedUser };
    delete safeUser.password;

    return successResponse(res, safeUser, 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
}

// 3. Get User Favorites
async function getFavorites(req, res, next) {
  try {
    const userId = req.user.id;
    const user = await firestore.getDocument('users', userId);
    const favoriteIds = user?.favorites || [];

    if (favoriteIds.length === 0) {
      return successResponse(res, [], 'No favorites saved');
    }

    // Fetch details for each favorite venue
    const allHalls = await firestore.getCollection('halls');
    const allCars = await firestore.getCollection('cars');
    const allTents = await firestore.getCollection('tent_houses');
    const allServices = await firestore.getCollection('services');

    const combined = [...allHalls, ...allCars, ...allTents, ...allServices];
    const favoriteItems = combined.filter(item => favoriteIds.includes(item.id));

    return successResponse(res, favoriteItems, 'Favorites retrieved');
  } catch (err) {
    next(err);
  }
}

// 4. Toggle Favorite
async function toggleFavorite(req, res, next) {
  try {
    const userId = req.user.id;
    const { venueId } = req.body;

    if (!venueId) {
      return errorResponse(res, 'Venue/Service ID is required', 'VALIDATION_ERROR', 400);
    }

    const user = await firestore.getDocument('users', userId);
    if (!user) {
      return errorResponse(res, 'User not found', 'NOT_FOUND', 404);
    }

    const favorites = user.favorites || [];
    let isFavorited = false;
    let newFavorites = [];

    if (favorites.includes(venueId)) {
      newFavorites = favorites.filter(id => id !== venueId);
      isFavorited = false;
    } else {
      newFavorites = [...favorites, venueId];
      isFavorited = true;
    }

    await firestore.updateDocument('users', userId, { favorites: newFavorites });

    return successResponse(
      res,
      { isFavorited, favorites: newFavorites },
      isFavorited ? 'Added to favorites' : 'Removed from favorites'
    );
  } catch (err) {
    next(err);
  }
}

// 5. Get Saved Locations
async function getSavedLocations(req, res, next) {
  try {
    const userId = req.user.id;
    const user = await firestore.getDocument('users', userId);
    return successResponse(res, user?.savedLocations || [], 'Saved locations retrieved');
  } catch (err) {
    next(err);
  }
}

// 6. Add Saved Location
async function addSavedLocation(req, res, next) {
  try {
    const userId = req.user.id;
    const { label, address, city, district, state, pinCode } = req.body;

    if (!address || !city) {
      return errorResponse(res, 'Address and City are required for saved location', 'VALIDATION_ERROR', 400);
    }

    const user = await firestore.getDocument('users', userId);
    const existing = user?.savedLocations || [];

    const newLocation = {
      id: `loc_${Date.now()}`,
      label: label || 'Home',
      address,
      city,
      district: district || '',
      state: state || '',
      pinCode: pinCode || '',
      createdAt: new Date().toISOString()
    };

    const updatedLocations = [...existing, newLocation];
    await firestore.updateDocument('users', userId, { savedLocations: updatedLocations });

    return successResponse(res, newLocation, 'Location saved successfully', 201);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getFavorites,
  toggleFavorite,
  getSavedLocations,
  addSavedLocation
};
