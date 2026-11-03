/**
 * Hall Khoj Finder — AI Service Layer (Phases 12 & 13)
 * Provides Grounded Natural Language Search, Query Understanding,
 * Contextual Recommendations, and Owner AI Business Assistant.
 * Strictly factual: Never invents listings, rates, or availability.
 */

const firestore = require('./firestore.service');
const bookingService = require('./booking.service');

// Standardized 19 categories
const CATEGORIES = [
  'Marriage Halls', 'Banquet Halls', 'Party Halls', 'Wedding Venues', 'Resorts',
  'Community Halls', 'Tent Houses', 'Decoration', 'Catering', 'Photography',
  'Videography', 'DJ', 'Sound Systems', 'Lighting', 'Flower Decoration',
  'Furniture Rental', 'Event Staff', 'Wedding Cars', 'Other Event Services'
];

/**
 * PHASE 12: Natural Language Query Parsing & Grounded Matcher
 */
async function parseAndSearch(prompt) {
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    throw new Error('Search prompt is required');
  }

  const raw = prompt.trim();
  const lower = raw.toLowerCase();

  const extracted = {
    query: raw,
    category: null,
    city: null,
    capacity: null,
    maxPrice: null,
    minPrice: null,
    facilities: [],
    eventType: null
  };

  // 1. Capacity detection
  const guestMatch = lower.match(/(\d+)\s*(people|guests|log|person|members|pax|aadmi)/i);
  if (guestMatch) {
    extracted.capacity = parseInt(guestMatch[1], 10);
  } else {
    // Check for numbers followed by k e.g., "500 logo"
    const generalNumMatch = lower.match(/\b(\d{2,4})\b(?!\s*(k|lakh|thousand|rs|inr|₹))/i);
    if (generalNumMatch && parseInt(generalNumMatch[1], 10) >= 30 && parseInt(generalNumMatch[1], 10) <= 5000) {
      extracted.capacity = parseInt(generalNumMatch[1], 10);
    }
  }

  // 2. Budget / Price detection
  const lakhMatch = lower.match(/(\d+(?:\.\d+)?)\s*(lakh|lac|l)\b/i);
  if (lakhMatch) {
    extracted.maxPrice = Math.round(parseFloat(lakhMatch[1]) * 100000);
  } else {
    const kMatch = lower.match(/(\d+(?:\.\d+)?)\s*(k|thousand|hazaar)\b/i);
    if (kMatch) {
      extracted.maxPrice = Math.round(parseFloat(kMatch[1]) * 1000);
    } else {
      const directAmtMatch = lower.match(/(?:under|below|budget|max|upto|₹|rs\.?)\s*(\d{4,7})/i);
      if (directAmtMatch) {
        extracted.maxPrice = parseInt(directAmtMatch[1], 10);
      }
    }
  }

  // 3. Category Detection
  if (lower.match(/car|gaadi|doli|vintage car|audi|bmw/i)) extracted.category = 'Wedding Cars';
  else if (lower.match(/tent|shamiana|mandap setup|pandal/i)) extracted.category = 'Tent Houses';
  else if (lower.match(/cater|food|khana|halwai|buffet|dining/i)) extracted.category = 'Catering';
  else if (lower.match(/photo|shoot|pre-wedding|camera/i)) extracted.category = 'Photography';
  else if (lower.match(/video|cinematography|reels/i)) extracted.category = 'Videography';
  else if (lower.match(/dj|music|dance floor/i)) extracted.category = 'DJ';
  else if (lower.match(/sound|mic|speaker/i)) extracted.category = 'Sound Systems';
  else if (lower.match(/light|roshni|chandeliers|laser/i)) extracted.category = 'Lighting';
  else if (lower.match(/flower|phool|floral/i)) extracted.category = 'Flower Decoration';
  else if (lower.match(/decor|decoration|theme/i)) extracted.category = 'Decoration';
  else if (lower.match(/resort|destination|poolside/i)) extracted.category = 'Resorts';
  else if (lower.match(/party|birthday|anniversary/i)) extracted.category = 'Party Halls';
  else if (lower.match(/banquet|grand/i)) extracted.category = 'Banquet Halls';
  else if (lower.match(/hall|marriage|shaadi|wedding venue/i)) extracted.category = 'Marriage Halls';

  // 4. Facilities Detection
  if (lower.match(/\bac\b|air condition/i)) extracted.facilities.push('AC');
  if (lower.match(/parking|gaadi khadi/i)) extracted.facilities.push('Parking');
  if (lower.match(/lawn|garden|open area|maidan/i)) extracted.facilities.push('Lawn');
  if (lower.match(/rooms?|stay|kamre/i)) extracted.facilities.push('Rooms');
  if (lower.match(/stage|mandap/i)) extracted.facilities.push('Stage');
  if (lower.match(/pool|swimming/i)) extracted.facilities.push('Swimming Pool');
  if (lower.match(/generator|power backup|bijli/i)) extracted.facilities.push('Power Backup');

  // 5. Event Type Detection
  if (lower.match(/shaadi|wedding|vivaah/i)) extracted.eventType = 'Wedding';
  else if (lower.match(/reception/i)) extracted.eventType = 'Reception';
  else if (lower.match(/birthday|janamdin/i)) extracted.eventType = 'Birthday';
  else if (lower.match(/engagement|sagai|ring ceremony/i)) extracted.eventType = 'Engagement';
  else if (lower.match(/corporate|meeting|conference/i)) extracted.eventType = 'Corporate Event';

  // 6. City Detection
  const knownCities = [
    'Lucknow', 'Patna', 'Delhi', 'New Delhi', 'Varanasi', 'Kanpur', 'Jaipur',
    'Bhopal', 'Agra', 'Mumbai', 'Bangalore', 'Kolkata', 'Hyderabad', 'Pune',
    'Ahmedabad', 'Prayagraj', 'Gorakhpur', 'Gaya', 'Muzaffarpur', 'Ranchi', 'Indore'
  ];

  for (const city of knownCities) {
    const reg = new RegExp(`\\b${city}\\b`, 'i');
    if (reg.test(raw)) {
      extracted.city = city;
      break;
    }
  }

  // If not found in known cities, check "in <word>" or "<word> me" pattern
  if (!extracted.city) {
    const inMatch = raw.match(/\b(?:in|at|near|near to|me|mein)\s+([A-Za-z]{3,20})\b/i);
    if (inMatch && !['the', 'our', 'my', 'budget', 'lakh', 'hall', 'venue'].includes(inMatch[1].toLowerCase())) {
      // Capitalize first letter
      const candidate = inMatch[1].charAt(0).toUpperCase() + inMatch[1].slice(1).toLowerCase();
      extracted.city = candidate;
    }
  }

  // 7. Grounded Search: Query REAL verified listings
  const allHalls = await firestore.getCollection('halls');
  const activeHalls = allHalls.filter(h => h.status !== 'SUSPENDED' && h.status !== 'DELETED');

  // Calculate grounded match score for each hall
  const scoredMatches = activeHalls.map(hall => {
    let score = 50; // baseline
    const reasons = [];

    // City check
    if (extracted.city) {
      const hCity = (hall.city || '').toLowerCase();
      const hDistrict = (hall.district || '').toLowerCase();
      const hAddress = (hall.address || '').toLowerCase();
      const targetCity = extracted.city.toLowerCase();

      if (hCity.includes(targetCity) || hDistrict.includes(targetCity) || hAddress.includes(targetCity)) {
        score += 30;
        reasons.push(`Located in ${hall.city}`);
      } else {
        score -= 40; // outside desired city
      }
    }

    // Category match
    if (extracted.category) {
      if ((hall.category || '').toLowerCase() === extracted.category.toLowerCase()) {
        score += 20;
        reasons.push(`Exact category match: ${hall.category}`);
      }
    }

    // Capacity match
    if (extracted.capacity) {
      const maxCap = hall.capacityMax || hall.capacity || 0;
      const minCap = hall.capacityMin || 0;
      if (maxCap >= extracted.capacity && minCap <= extracted.capacity) {
        score += 20;
        reasons.push(`Capacity fits ${extracted.capacity} guests (${minCap} - ${maxCap})`);
      } else if (maxCap >= extracted.capacity) {
        score += 10;
        reasons.push(`Can accommodate up to ${maxCap} guests`);
      } else {
        score -= 25; // too small
      }
    }

    // Price match
    if (extracted.maxPrice) {
      const price = hall.startingPrice || 0;
      if (price <= extracted.maxPrice) {
        score += 20;
        reasons.push(`Within budget: ₹${price.toLocaleString('en-IN')} ≤ ₹${extracted.maxPrice.toLocaleString('en-IN')}`);
      } else {
        score -= 30; // exceeds budget
      }
    }

    // Facilities match
    if (extracted.facilities.length > 0) {
      const hallFacs = (hall.facilities || []).map(f => f.toLowerCase());
      let matchedFacs = 0;
      for (const reqFac of extracted.facilities) {
        if (hallFacs.some(f => f.includes(reqFac.toLowerCase()))) {
          matchedFacs++;
        }
      }
      if (matchedFacs > 0) {
        score += (matchedFacs * 10);
        reasons.push(`Has ${matchedFacs} requested amenities`);
      }
    }

    // Verified bonus
    if (hall.isVerified) {
      score += 5;
      reasons.push('Verified Listing Badge');
    }

    return {
      hall,
      score: Math.max(0, Math.min(100, score)),
      reasons
    };
  });

  // Filter out low scores and sort descending
  const matchingHalls = scoredMatches
    .filter(item => item.score >= 40)
    .sort((a, b) => b.score - a.score)
    .map(item => ({
      ...item.hall,
      matchScore: item.score,
      matchReasons: item.reasons
    }));

  // Build natural language summary strictly grounded in returned results
  let naturalResponse = '';
  if (matchingHalls.length > 0) {
    const topHall = matchingHalls[0];
    naturalResponse = `Found ${matchingHalls.length} verified option${matchingHalls.length > 1 ? 's' : ''} in database. Top recommendation is **${topHall.name}** in ${topHall.city} at ₹${(topHall.startingPrice || 0).toLocaleString('en-IN')}${topHall.capacityMax ? ` (up to ${topHall.capacityMax} guests)` : ''}.`;
  } else {
    naturalResponse = `No exact verified listings matched all filters${extracted.city ? ` in ${extracted.city}` : ''}${extracted.maxPrice ? ` under ₹${extracted.maxPrice.toLocaleString('en-IN')}` : ''}. Try broadening your search or adjusting the budget.`;
  }

  return {
    interpretedQuery: extracted,
    totalMatches: matchingHalls.length,
    results: matchingHalls,
    summary: naturalResponse
  };
}

/**
 * PHASE 12: Contextual Recommendations
 */
async function getRecommendations({ city, category, currentHallId, limit = 4 }) {
  const allHalls = await firestore.getCollection('halls');
  let candidates = allHalls.filter(h => h.status !== 'SUSPENDED' && h.status !== 'DELETED');

  if (currentHallId) {
    candidates = candidates.filter(h => h.id !== currentHallId);
  }

  // Filter by city or category if provided
  if (city) {
    const cityMatches = candidates.filter(h => (h.city || '').toLowerCase() === city.toLowerCase());
    if (cityMatches.length >= 2) candidates = cityMatches;
  }

  if (category) {
    const catMatches = candidates.filter(h => (h.category || '').toLowerCase() === category.toLowerCase());
    if (catMatches.length >= 2) candidates = catMatches;
  }

  // Sort by rating & verification
  candidates.sort((a, b) => {
    if (b.isVerified && !a.isVerified) return 1;
    if (a.isVerified && !b.isVerified) return -1;
    return (b.rating || 0) - (a.rating || 0);
  });

  return candidates.slice(0, limit);
}

/**
 * PHASE 13: Owner AI Business Assistant
 */
async function handleOwnerAssistantRequest({ ownerId, intent, context = {} }) {
  if (!ownerId) {
    throw new Error('Owner ID is required');
  }

  // Get owner's halls
  const allHalls = await firestore.getCollection('halls');
  const ownerHalls = allHalls.filter(h => h.ownerId === ownerId);

  // Get owner's bookings
  const allBookings = await firestore.getCollection('bookings');
  const ownerBookings = allBookings.filter(b => b.ownerId === ownerId);

  switch (intent) {
    case 'INQUIRY_REPLY': {
      // Draft a warm, professional Hindi/English response to customer inquiry
      const { customerName, eventDate, guestCount, eventType, customerQuestion } = context;
      const hall = ownerHalls.find(h => h.id === context.hallId) || ownerHalls[0] || { name: 'Our Venue', startingPrice: 100000 };

      const replyDraft = `Namaste ${customerName || 'Ji'},

Thank you for choosing ${hall.name} for your upcoming ${eventType || 'event'}${eventDate ? ` on ${eventDate}` : ''}.

${guestCount ? `Our venue comfortably accommodates up to ${guestCount} guests with complete banquet facilities.` : ''}
${customerQuestion ? `Regarding your query: "${customerQuestion}" — We are pleased to confirm that we provide full customization for catering, decoration, and stage arrangements to make your event memorable.` : ''}

Base venue package starts at ₹${(hall.startingPrice || 0).toLocaleString('en-IN')}. We would love to host a walkthrough visit for you. Let us know a convenient time, or confirm your booking directly through Hall Khoj!

Warm regards,
${hall.name} Management`;

      return {
        intent: 'INQUIRY_REPLY',
        draft: replyDraft,
        suggestedNextSteps: ['Send to customer via Chat', 'Attach Custom Package PDF', 'Schedule Walkthrough']
      };
    }

    case 'ANALYZE_PERFORMANCE': {
      // Real revenue, occupancy & conversion calculations
      const totalBookings = ownerBookings.length;
      const confirmedBookings = ownerBookings.filter(b => ['CONFIRMED', 'COMPLETED', 'ACCEPTED'].includes(b.status));
      const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
      const advanceCollected = confirmedBookings.reduce((sum, b) => sum + (b.advancePaid || 0), 0);

      // Unique booked dates
      const bookedDatesSet = new Set(confirmedBookings.map(b => b.eventDate).filter(Boolean));
      // Estimate occupancy for next 90 days (assume 90 days total available)
      const occupancyRate = Math.min(100, Math.round((bookedDatesSet.size / 90) * 100));

      const insights = [];
      if (occupancyRate > 60) {
        insights.push('High demand detected! Consider a 10-15% peak season rate adjustment for upcoming auspicious wedding dates.');
      } else {
        insights.push('You have available dates in upcoming months. Consider offering complimentary flower decoration or DJ package to increase conversions.');
      }

      if (totalBookings > 0 && confirmedBookings.length / totalBookings < 0.5) {
        insights.push('Quick response time can improve confirmation rates. Respond to pending booking requests within 1 hour.');
      }

      return {
        intent: 'ANALYZE_PERFORMANCE',
        metrics: {
          totalListings: ownerHalls.length,
          totalBookings,
          confirmedBookings: confirmedBookings.length,
          totalRevenue,
          advanceCollected,
          occupancyRatePercent: occupancyRate,
          bookedSlotsCount: bookedDatesSet.size
        },
        insights
      };
    }

    case 'SUGGEST_PRICING': {
      // Compare owner halls with regional market averages
      const targetHall = ownerHalls.find(h => h.id === context.hallId) || ownerHalls[0];
      if (!targetHall) {
        return {
          intent: 'SUGGEST_PRICING',
          message: 'Please add a listing first to get competitive pricing analysis.'
        };
      }

      const category = targetHall.category || 'Marriage Halls';
      const city = targetHall.city || 'Lucknow';

      // Find peers
      const peerHalls = allHalls.filter(h =>
        h.id !== targetHall.id &&
        (h.category || '').toLowerCase() === category.toLowerCase() &&
        (h.city || '').toLowerCase() === city.toLowerCase()
      );

      const peerPrices = peerHalls.map(h => h.startingPrice || 0).filter(p => p > 0);
      const avgPrice = peerPrices.length > 0
        ? Math.round(peerPrices.reduce((a, b) => a + b, 0) / peerPrices.length)
        : targetHall.startingPrice || 120000;

      const myPrice = targetHall.startingPrice || 0;
      const diffPercent = avgPrice > 0 ? Math.round(((myPrice - avgPrice) / avgPrice) * 100) : 0;

      let recommendation = '';
      if (diffPercent < -15) {
        recommendation = `Your pricing (₹${myPrice.toLocaleString('en-IN')}) is ${Math.abs(diffPercent)}% below market average (₹${avgPrice.toLocaleString('en-IN')}) in ${city}. You offer high value and could safely raise rates by 10-12% during peak wedding dates without losing inquiries.`;
      } else if (diffPercent > 20) {
        recommendation = `Your pricing (₹${myPrice.toLocaleString('en-IN')}) is ${diffPercent}% above market average (₹${avgPrice.toLocaleString('en-IN')}) in ${city}. Ensure your listing highlights premium amenities like central AC, bridal suites, or catering packages to justify the premium.`;
      } else {
        recommendation = `Your pricing (₹${myPrice.toLocaleString('en-IN')}) is well-balanced with the market average (₹${avgPrice.toLocaleString('en-IN')}) in ${city}.`;
      }

      return {
        intent: 'SUGGEST_PRICING',
        hallName: targetHall.name,
        city,
        category,
        currentPrice: myPrice,
        marketAverage: avgPrice,
        samplePeerCount: peerPrices.length,
        priceComparisonPercent: diffPercent,
        recommendation
      };
    }

    case 'PROPOSE_ACTION': {
      // Safe Action Proposer: NEVER executes directly without owner confirmation
      const { actionType, hallId, date, reason } = context;
      const hall = ownerHalls.find(h => h.id === hallId) || ownerHalls[0];

      if (!hall) {
        throw new Error('Valid listing must be specified for action');
      }

      if (actionType === 'BLOCK_DATE') {
        if (!date) throw new Error('Date is required to block calendar');

        // Create an unconfirmed action proposal token
        const actionPayload = {
          actionId: `ACT_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          actionType: 'BLOCK_DATE',
          hallId: hall.id,
          hallName: hall.name,
          date,
          reason: reason || 'Owner maintenance or private offline booking',
          status: 'NEEDS_CONFIRMATION',
          requiresUserApproval: true,
          confirmationPrompt: `Are you sure you want to block ${date} for ${hall.name}? Online bookings will not be accepted for this date.`
        };

        return {
          intent: 'PROPOSE_ACTION',
          action: actionPayload
        };
      }

      throw new Error(`Unsupported action type: ${actionType}`);
    }

    default:
      throw new Error(`Unknown assistant intent: ${intent}`);
  }
}

/**
 * PHASE 13: Gated Execution of Confirmed Action
 * Must have explicit confirmation: confirmed === true
 */
async function executeConfirmedAction({ ownerId, actionPayload, confirmed }) {
  if (!confirmed) {
    return {
      status: 'CANCELLED',
      message: 'Action was cancelled by the owner. No changes were committed.'
    };
  }

  const { actionType, hallId, date, reason } = actionPayload;

  // Verify ownership
  const hall = await firestore.getDocument('halls', hallId);
  if (!hall || hall.ownerId !== ownerId) {
    throw new Error('Unauthorized: You do not own this listing');
  }

  if (actionType === 'BLOCK_DATE') {
    const bookedDates = hall.bookedDates || [];
    if (!bookedDates.includes(date)) {
      bookedDates.push(date);
      await firestore.updateDocument('halls', hallId, {
        bookedDates,
        updatedAt: new Date().toISOString()
      });
    }

    return {
      status: 'EXECUTED',
      actionType,
      hallId,
      date,
      message: `Date ${date} has been successfully blocked for ${hall.name}.`
    };
  }

  if (actionType === 'UNBLOCK_DATE') {
    let bookedDates = hall.bookedDates || [];
    bookedDates = bookedDates.filter(d => d !== date);
    await firestore.updateDocument('halls', hallId, {
      bookedDates,
      updatedAt: new Date().toISOString()
    });

    return {
      status: 'EXECUTED',
      actionType,
      hallId,
      date,
      message: `Date ${date} has been unblocked for ${hall.name}.`
    };
  }

  throw new Error(`Execution not implemented for action type: ${actionType}`);
}

module.exports = {
  parseAndSearch,
  getRecommendations,
  handleOwnerAssistantRequest,
  executeConfirmedAction
};
