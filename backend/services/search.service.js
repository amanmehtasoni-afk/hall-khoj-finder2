/**
 * Hall Khoj Finder — Advanced Search & Filter Engine
 * Supports text matching, geolocation Haversine radius, multi-category filters, date availability, and server pagination.
 */

const firestore = require('./firestore.service');
const { calculateDistanceKm } = require('./booking.service');

// Well-known coordinates for Indian cities / towns as fallback
const CITY_COORDINATES = {
  'lucknow': { lat: 26.8467, lng: 80.9462 },
  'patna': { lat: 25.5941, lng: 85.1376 },
  'delhi': { lat: 28.6139, lng: 77.2090 },
  'new delhi': { lat: 28.6139, lng: 77.2090 },
  'noida': { lat: 28.5355, lng: 77.3910 },
  'greater noida': { lat: 28.4744, lng: 77.5040 },
  'gurgaon': { lat: 28.4595, lng: 77.0266 },
  'gurugram': { lat: 28.4595, lng: 77.0266 },
  'mumbai': { lat: 19.0760, lng: 72.8777 },
  'varanasi': { lat: 25.3176, lng: 82.9739 },
  'kanpur': { lat: 26.4499, lng: 80.3319 },
  'jaipur': { lat: 26.9124, lng: 75.7873 },
  'gorakhpur': { lat: 26.7606, lng: 83.3732 },
  'bhopal': { lat: 23.2599, lng: 77.4126 },
  'agra': { lat: 27.1767, lng: 78.0081 },
  'dehradun': { lat: 30.3165, lng: 78.0322 },
  'udaipur': { lat: 24.5854, lng: 73.7125 },
  'ranchi': { lat: 23.3441, lng: 85.3096 },
  'kolkata': { lat: 22.5726, lng: 88.3639 },
  'prayagraj': { lat: 25.4358, lng: 81.8463 },
  'allahabad': { lat: 25.4358, lng: 81.8463 },
  'ayodhya': { lat: 26.7922, lng: 82.1998 },
  'meerut': { lat: 28.9845, lng: 77.7064 },
  'ghaziabad': { lat: 28.6692, lng: 77.4538 }
};

// Category alias normalizer
function normalizeCategorySlug(raw) {
  if (!raw) return '';
  const slug = raw.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
  if (slug === 'cars' || slug === 'car' || slug === 'luxury-car' || slug === 'wedding-cars') return 'wedding-car';
  if (slug === 'tents' || slug === 'tent' || slug === 'tent-houses' || slug === 'shamiana') return 'tent-house';
  if (slug === 'halls' || slug === 'marriage-halls') return 'marriage-hall';
  if (slug === 'banquet-halls') return 'banquet-hall';
  if (slug === 'party-halls') return 'party-hall';
  if (slug === 'dj-sound' || slug === 'dj-services') return 'dj';
  if (slug === 'sound' || slug === 'audio') return 'sound-system';
  if (slug === 'lights' || slug === 'lighting-services') return 'lighting';
  if (slug === 'flowers' || slug === 'florist') return 'flower-decoration';
  if (slug === 'decor' || slug === 'decorations') return 'decoration';
  if (slug === 'caterers' || slug === 'caterer') return 'catering';
  if (slug === 'photographers' || slug === 'photographer') return 'photography';
  if (slug === 'videographers' || slug === 'videographer') return 'videography';
  if (slug === 'staff' || slug === 'event-staffing') return 'event-staff';
  return slug;
}

async function searchListings({
  q = '',
  category = '',
  city = '',
  village = '',
  district = '',
  state = '',
  pin = '',
  minPrice,
  maxPrice,
  capacity,
  minRating,
  verifiedOnly = false,
  date = '',
  facilities = [],
  nearMe = false,
  lat,
  lng,
  radius = 10,
  sortBy = 'nearest',
  page = 1,
  limit = 20
}) {
  // Aggregate listings from all collections
  const halls = await firestore.getCollection('halls');
  const cars = await firestore.getCollection('cars');
  const tents = await firestore.getCollection('tent_houses');
  const services = await firestore.getCollection('services');

  let allListings = [...halls, ...cars, ...tents, ...services];

  // Attach coordinates fallback if missing
  allListings = allListings.map(item => {
    let itemLat = item.latitude;
    let itemLng = item.longitude;
    if ((itemLat === undefined || itemLat === null) && item.city) {
      const cityKey = item.city.toLowerCase().trim();
      if (CITY_COORDINATES[cityKey]) {
        itemLat = CITY_COORDINATES[cityKey].lat;
        itemLng = CITY_COORDINATES[cityKey].lng;
      }
    }
    return {
      ...item,
      latitude: itemLat !== undefined ? itemLat : null,
      longitude: itemLng !== undefined ? itemLng : null
    };
  });

  // 1. Text Query Filter
  if (q && q.trim().length > 0) {
    const term = q.toLowerCase().trim();
    allListings = allListings.filter(item => {
      const nameMatch = item.name && item.name.toLowerCase().includes(term);
      const cityMatch = item.city && item.city.toLowerCase().includes(term);
      const areaMatch = item.area && item.area.toLowerCase().includes(term);
      const villageMatch = item.village && item.village.toLowerCase().includes(term);
      const distMatch = item.district && item.district.toLowerCase().includes(term);
      const pinMatch = item.pin && item.pin.includes(term);
      const catMatch = (item.category || item.type || '').toLowerCase().includes(term);
      const descMatch = item.description && item.description.toLowerCase().includes(term);
      const facMatch = Array.isArray(item.facilities) && item.facilities.some(f => f.toLowerCase().includes(term));
      return nameMatch || cityMatch || areaMatch || villageMatch || distMatch || pinMatch || catMatch || descMatch || facMatch;
    });
  }

  // 2. Category Filter
  if (category && category.trim().length > 0 && category.toLowerCase() !== 'all') {
    const targetSlug = normalizeCategorySlug(category);
    allListings = allListings.filter(item => {
      const itemCat = item.category || item.type || '';
      const itemSlug = normalizeCategorySlug(itemCat);
      const itemCustomSlug = item.categorySlug ? normalizeCategorySlug(item.categorySlug) : '';
      return itemSlug === targetSlug || itemCustomSlug === targetSlug || itemCat.toLowerCase() === category.toLowerCase();
    });
  }

  // 3. Location Filters (City, Village, District, State, PIN)
  if (city && city.trim().length > 0) {
    allListings = allListings.filter(item => 
      item.city && item.city.toLowerCase().includes(city.toLowerCase().trim())
    );
  }
  if (village && village.trim().length > 0) {
    allListings = allListings.filter(item =>
      item.village && item.village.toLowerCase().includes(village.toLowerCase().trim())
    );
  }
  if (district && district.trim().length > 0) {
    allListings = allListings.filter(item =>
      item.district && item.district.toLowerCase().includes(district.toLowerCase().trim())
    );
  }
  if (state && state.trim().length > 0) {
    allListings = allListings.filter(item => 
      item.state && item.state.toLowerCase().includes(state.toLowerCase().trim())
    );
  }
  if (pin && pin.trim().length > 0) {
    allListings = allListings.filter(item => item.pin === pin.trim());
  }

  // 4. Budget / Price Range
  if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
    const min = parseFloat(minPrice);
    allListings = allListings.filter(item => (item.startingPrice || 0) >= min);
  }
  if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
    const max = parseFloat(maxPrice);
    allListings = allListings.filter(item => (item.startingPrice || 0) <= max);
  }

  // 5. Capacity Filter
  if (capacity !== undefined && capacity !== null && capacity !== '') {
    const cap = parseInt(capacity, 10);
    allListings = allListings.filter(item => {
      if (!item.capacityMax) return true; // non-capacity listings (cars, decor) pass through
      return item.capacityMax >= cap;
    });
  }

  // 6. Rating Filter
  if (minRating !== undefined && minRating !== null && minRating !== '') {
    const minR = parseFloat(minRating);
    allListings = allListings.filter(item => (item.rating || 0) >= minR);
  }

  // 7. Verified Only Filter
  if (verifiedOnly === true || verifiedOnly === 'true') {
    allListings = allListings.filter(item => item.verified === true || item.ownerVerified === true);
  }

  // 8. Date Availability Filter
  if (date && date.trim().length > 0) {
    const targetDate = date.trim();
    allListings = allListings.filter(item => {
      if (item.availability && (item.availability[targetDate] === 'BOOKED' || item.availability[targetDate] === 'BLOCKED')) {
        return false;
      }
      return true;
    });
  }

  // 9. Facilities Filter
  if (facilities && facilities.length > 0) {
    const facArr = Array.isArray(facilities) ? facilities : [facilities];
    allListings = allListings.filter(item => {
      if (!item.facilities) return false;
      return facArr.every(f => 
        item.facilities.some(itemFac => itemFac.toLowerCase().includes(f.toLowerCase()))
      );
    });
  }

  // 10. Distance Calculation & Near Me Geolocation Filter
  const hasUserCoords = (lat !== undefined && lat !== null && lat !== '') && 
                        (lng !== undefined && lng !== null && lng !== '');
  if (hasUserCoords) {
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const maxDist = parseFloat(radius) || 10;

    allListings = allListings.map(item => {
      if (item.latitude && item.longitude) {
        const dist = calculateDistanceKm(userLat, userLng, item.latitude, item.longitude);
        const rounded = Math.round(dist * 10) / 10;
        return {
          ...item,
          distanceKm: rounded,
          distance: `${rounded} km away`
        };
      }
      return { ...item, distanceKm: 9999, distance: 'Distance unavailable' };
    });

    if (nearMe === 'true' || nearMe === true) {
      allListings = allListings.filter(item => item.distanceKm <= maxDist);
    }
  }

  // 11. Sorting
  if (sortBy === 'price-asc') {
    allListings.sort((a, b) => (a.startingPrice || 0) - (b.startingPrice || 0));
  } else if (sortBy === 'price-desc') {
    allListings.sort((a, b) => (b.startingPrice || 0) - (a.startingPrice || 0));
  } else if (sortBy === 'rating') {
    allListings.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === 'capacity') {
    allListings.sort((a, b) => (b.capacityMax || 0) - (a.capacityMax || 0));
  } else if (sortBy === 'newest') {
    allListings.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } else if (sortBy === 'nearest' && hasUserCoords) {
    allListings.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  }

  // 12. Server Pagination
  const totalCount = allListings.length;
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
  const startIndex = (p - 1) * l;
  const paginatedResults = allListings.slice(startIndex, startIndex + l);

  return {
    total: totalCount,
    page: p,
    limit: l,
    totalPages: Math.ceil(totalCount / l),
    results: paginatedResults
  };
}

/**
 * Autocomplete / Suggestions
 */
async function getSearchSuggestions(query = '') {
  if (!query || query.trim().length === 0) {
    return [];
  }
  const term = query.toLowerCase().trim();

  const halls = await firestore.getCollection('halls');
  const cars = await firestore.getCollection('cars');
  const tents = await firestore.getCollection('tent_houses');
  const services = await firestore.getCollection('services');
  const all = [...halls, ...cars, ...tents, ...services];

  const suggestions = new Set();

  for (const item of all) {
    if (item.name && item.name.toLowerCase().includes(term)) {
      suggestions.add(JSON.stringify({ text: item.name, type: 'venue', category: item.category || item.type, id: item.id }));
    }
    if (item.city && item.city.toLowerCase().startsWith(term)) {
      suggestions.add(JSON.stringify({ text: item.city, type: 'city', category: 'City' }));
    }
    if (item.area && item.area.toLowerCase().includes(term)) {
      suggestions.add(JSON.stringify({ text: `${item.area}, ${item.city}`, type: 'area', category: 'Area' }));
    }
    if (suggestions.size >= 8) break;
  }

  return Array.from(suggestions).map(s => JSON.parse(s));
}

/**
 * Popular Cities
 */
async function getPopularCities() {
  const halls = await firestore.getCollection('halls');
  const cars = await firestore.getCollection('cars');
  const tents = await firestore.getCollection('tent_houses');
  const services = await firestore.getCollection('services');
  const all = [...halls, ...cars, ...tents, ...services];

  const cityCounts = {};
  all.forEach(item => {
    if (item.city) {
      const c = item.city.trim();
      cityCounts[c] = (cityCounts[c] || 0) + 1;
    }
  });

  return Object.entries(cityCounts)
    .map(([city, count]) => ({
      city,
      count,
      coordinates: CITY_COORDINATES[city.toLowerCase()] || null
    }))
    .sort((a, b) => b.count - a.count);
}

module.exports = {
  searchListings,
  getSearchSuggestions,
  getPopularCities,
  CITY_COORDINATES
};
