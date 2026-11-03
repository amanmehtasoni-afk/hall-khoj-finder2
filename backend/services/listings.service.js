/**
 * Hall Khoj Finder — Unified Listings Service
 * Phase 7: Business Listing System across all 19 Event Categories
 */

const firestore = require('./firestore.service');

// Standardize category slug mapping
function normalizeSlug(str) {
  if (!str) return 'other-services';
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function getAllListings() {
  const halls = await firestore.getCollection('halls');
  const cars = await firestore.getCollection('cars');
  const tents = await firestore.getCollection('tent_houses');
  const services = await firestore.getCollection('services');

  // Standardize items into uniform listing model
  const standardizedHalls = halls.map(h => ({
    ...h,
    collection: 'halls',
    category: h.category || 'Marriage Hall',
    categorySlug: normalizeSlug(h.category || h.type || 'Marriage Hall'),
    type: h.type || 'Marriage Hall',
    priceUnit: h.priceUnit || 'per day',
    startingPrice: h.startingPrice || 65000,
    status: h.status || 'APPROVED'
  }));

  const standardizedCars = cars.map(c => ({
    ...c,
    collection: 'cars',
    category: 'Wedding Car',
    categorySlug: 'wedding-car',
    type: 'Wedding Car',
    priceUnit: c.priceUnit || 'per event',
    startingPrice: c.startingPrice || 15000,
    status: c.status || 'APPROVED'
  }));

  const standardizedTents = tents.map(t => ({
    ...t,
    collection: 'tent_houses',
    category: 'Tent House',
    categorySlug: 'tent-house',
    type: 'Tent House',
    priceUnit: t.priceUnit || 'per event',
    startingPrice: t.startingPrice || 25000,
    status: t.status || 'APPROVED'
  }));

  const standardizedServices = services.map(s => ({
    ...s,
    collection: 'services',
    category: s.category || 'Other Event Services',
    categorySlug: s.categorySlug || normalizeSlug(s.category || 'Other Event Services'),
    type: s.type || s.category,
    priceUnit: s.priceUnit || 'per event',
    startingPrice: s.startingPrice || 10000,
    status: s.status || 'APPROVED'
  }));

  return [
    ...standardizedHalls,
    ...standardizedCars,
    ...standardizedTents,
    ...standardizedServices
  ];
}

async function getListingById(id) {
  if (!id) return null;
  const all = await getAllListings();
  return all.find(l => l.id === id) || null;
}

async function getListingsByCategory(categorySlug) {
  const all = await getAllListings();
  const slug = normalizeSlug(categorySlug);
  return all.filter(l => l.categorySlug === slug || normalizeSlug(l.category) === slug);
}

async function searchListings({ q, category, city, minPrice, maxPrice, minCapacity, verified }) {
  let listings = await getAllListings();

  // Only return live / approved listings in search
  listings = listings.filter(l => l.status === 'APPROVED');

  if (category && category !== 'all') {
    const slug = normalizeSlug(category);
    listings = listings.filter(l => l.categorySlug === slug || normalizeSlug(l.category) === slug);
  }

  if (city && city !== 'all') {
    const lowerCity = city.toLowerCase().trim();
    listings = listings.filter(l => (l.city || '').toLowerCase().includes(lowerCity));
  }

  if (minPrice !== undefined && !isNaN(minPrice)) {
    listings = listings.filter(l => (l.startingPrice || 0) >= Number(minPrice));
  }

  if (maxPrice !== undefined && !isNaN(maxPrice)) {
    listings = listings.filter(l => (l.startingPrice || 0) <= Number(maxPrice));
  }

  if (minCapacity !== undefined && !isNaN(minCapacity)) {
    listings = listings.filter(l => (l.capacityMax || l.capacity || 1000) >= Number(minCapacity));
  }

  if (verified === true || verified === 'true') {
    listings = listings.filter(l => l.verified === true);
  }

  if (q && q.trim()) {
    const query = q.toLowerCase().trim();
    listings = listings.filter(l =>
      (l.name && l.name.toLowerCase().includes(query)) ||
      (l.city && l.city.toLowerCase().includes(query)) ||
      (l.area && l.area.toLowerCase().includes(query)) ||
      (l.category && l.category.toLowerCase().includes(query)) ||
      (Array.isArray(l.facilities) && l.facilities.some(f => f.toLowerCase().includes(query)))
    );
  }

  return listings;
}

async function getCategoriesWithCounts() {
  const categories = await firestore.getCollection('categories');
  const allListings = await getAllListings();

  return categories.map(cat => {
    const count = allListings.filter(l => l.categorySlug === cat.slug || normalizeSlug(l.category) === cat.slug).length;
    return {
      ...cat,
      listingCount: count
    };
  });
}

module.exports = {
  getAllListings,
  getListingById,
  getListingsByCategory,
  searchListings,
  getCategoriesWithCounts,
  normalizeSlug
};
