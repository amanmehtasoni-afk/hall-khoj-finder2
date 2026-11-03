/**
 * Hall Khoj Finder — Search Controller
 */

const searchService = require('../services/search.service');
const { successResponse } = require('../utils/response');

async function search(req, res, next) {
  try {
    const results = await searchService.searchListings({
      q: req.query.q,
      category: req.query.category,
      city: req.query.city,
      village: req.query.village,
      district: req.query.district,
      state: req.query.state,
      pin: req.query.pin,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      capacity: req.query.capacity,
      minRating: req.query.minRating,
      verifiedOnly: req.query.verifiedOnly,
      date: req.query.date,
      facilities: req.query.facilities ? (Array.isArray(req.query.facilities) ? req.query.facilities : req.query.facilities.split(',')) : [],
      nearMe: req.query.nearMe,
      lat: req.query.lat,
      lng: req.query.lng,
      radius: req.query.radius,
      sortBy: req.query.sortBy,
      page: req.query.page,
      limit: req.query.limit
    });

    return successResponse(res, results, 'Search results retrieved');
  } catch (err) {
    next(err);
  }
}

async function suggestions(req, res, next) {
  try {
    const query = req.query.q || '';
    const items = await searchService.getSearchSuggestions(query);
    return successResponse(res, items, 'Search suggestions retrieved');
  } catch (err) {
    next(err);
  }
}

async function cities(req, res, next) {
  try {
    const cityList = await searchService.getPopularCities();
    return successResponse(res, cityList, 'Popular cities retrieved');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  search,
  suggestions,
  cities
};
