/**
 * Hall Khoj Finder — Categories Controller
 * Phase 7: 19 Event Categories Management & Discovery
 */

const firestore = require('../services/firestore.service');
const listingsService = require('../services/listings.service');
const { successResponse, errorResponse } = require('../utils/response');

async function list(req, res, next) {
  try {
    const categories = await listingsService.getCategoriesWithCounts();
    return successResponse(res, categories, '19 Event categories retrieved successfully');
  } catch (err) {
    next(err);
  }
}

async function getBySlug(req, res, next) {
  try {
    const slug = req.params.slug.toLowerCase();
    const categories = await firestore.getCollection('categories');
    const category = categories.find(c => c.slug === slug || c.id === slug);

    if (!category) {
      return errorResponse(res, `Category '${slug}' not found`, 'NOT_FOUND', 404);
    }

    const listings = await listingsService.getListingsByCategory(slug);

    return successResponse(res, {
      ...category,
      listings,
      totalListings: listings.length
    }, `Category details and listings for ${category.name} retrieved`);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  getBySlug
};
