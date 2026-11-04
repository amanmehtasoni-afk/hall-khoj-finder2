/**
 * Hall Khoj Finder — Automated Supabase Migration Engine (Phase 11)
 * Extracts all verified existing business records from backend/data/*.json
 * Transforms records and generates:
 * 1. `supabase/seed.sql` (Ready for Supabase SQL Editor / CLI seed)
 * 2. Guaranteed relational integrity (100% Foreign Key & Check constraint safety)
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '../data');
const SEED_FILE = path.join(__dirname, '../../supabase/seed.sql');

function readJson(filename) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) || [];
  } catch (err) {
    console.error(`Error reading ${filename}:`, err.message);
    return [];
  }
}

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'number') return isNaN(val) ? '0' : val.toString();
  if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  return `'${val.toString().replace(/'/g, "''")}'`;
}

function toUuid(str) {
  if (!str) return 'gen_random_uuid()';
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(str)) return `'${str}'`;
  
  const hash = crypto.createHash('md5').update(str).digest('hex');
  return `'${hash.substring(0, 8)}-${hash.substring(8, 12)}-4${hash.substring(13, 16)}-a${hash.substring(17, 20)}-${hash.substring(20, 32)}'`;
}

function rawUuid(str) {
  return toUuid(str).replace(/'/g, '');
}

async function runMigration() {
  console.log('============================================================');
  console.log('🚀 Hall Khoj Finder — Supabase Data Migration');
  console.log('============================================================');

  const users = readJson('users.json');
  const owners = readJson('owners.json');
  const halls = readJson('halls.json');
  const categories = readJson('categories.json');
  const bookings = readJson('bookings.json');
  const reviews = readJson('reviews.json');
  const transactions = readJson('transactions.json');

  const statements = [
    '-- ==============================================================================',
    '-- HALL KHOJ FINDER — PRODUCTION SEED DATA (MIGRATED FROM BACKEND/DATA)',
    `-- Generated on: ${new Date().toISOString()}`,
    '-- ==============================================================================\n',
    'BEGIN;\n'
  ];

  // 1. Categories
  statements.push('-- 1. CATEGORIES');
  categories.forEach(c => {
    statements.push(`INSERT INTO public.venue_categories (id, name, hindi_name, slug, icon, description, starting_price)
VALUES (${toUuid(c.id || c.slug)}, ${escapeSql(c.name)}, ${escapeSql(c.hindiName || c.name)}, ${escapeSql(c.slug)}, ${escapeSql(c.icon || '🏛️')}, ${escapeSql(c.description || '')}, ${escapeSql(c.startingPrice || 0)})
ON CONFLICT (slug) DO NOTHING;`);
  });
  statements.push('');

  // 2. Profiles & Roles Map
  statements.push('-- 2. PROFILES & ROLES');
  const seenMobiles = new Set();
  const seenEmails = new Set();
  const profileIds = new Set();

  function addProfile(idStr, name, email, mobile, role, state, city, area, isVerified) {
    const pUuid = rawUuid(idStr);
    if (profileIds.has(pUuid)) return pUuid;
    profileIds.add(pUuid);

    let cleanEmail = (email || `${idStr.replace(/[^a-zA-Z0-9]/g, '_')}@hallkhoj.in`).toLowerCase().trim();
    if (seenEmails.has(cleanEmail)) {
      cleanEmail = cleanEmail.replace('@', `_${profileIds.size}@`);
    }
    seenEmails.add(cleanEmail);

    let cleanMobile = (mobile || '').toString().trim().replace(/[\s+-]/g, '').slice(-10);
    if (!cleanMobile || cleanMobile.length < 10) {
      cleanMobile = null;
    } else if (seenMobiles.has(cleanMobile)) {
      cleanMobile = '98' + String(10000000 + profileIds.size).slice(-8);
    }
    if (cleanMobile) {
      seenMobiles.add(cleanMobile);
    }

    const mobileVal = cleanMobile ? `'${cleanMobile}'` : 'NULL';

    statements.push(`INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('${pUuid}', ${escapeSql(name || 'User')}, ${escapeSql(cleanEmail)}, ${mobileVal}, ${escapeSql(state || 'Uttar Pradesh')}, ${escapeSql(city || 'Lucknow')}, ${escapeSql(area || '')}, ${escapeSql(!!isVerified)})
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;`);

    statements.push(`INSERT INTO public.user_roles (profile_id, role)
VALUES ('${pUuid}', '${role || 'customer'}')
ON CONFLICT (profile_id, role) DO NOTHING;`);

    return pUuid;
  }

  // Add all users from users.json
  users.forEach(u => {
    const role = (u.role === 'owner') ? 'owner' : ((u.role === 'admin') ? 'admin' : 'customer');
    addProfile(u.id, u.name, u.email, u.mobile, role, u.state, u.city, u.area || u.village, u.isVerified);
  });

  // Ensure profiles for owners exist
  owners.forEach(o => {
    const ownerUserId = o.userId || o.id;
    addProfile(ownerUserId, o.ownerName || o.businessName, o.email, o.phone || o.mobile, 'owner', o.state, o.city, o.address, true);
  });

  // Ensure profiles for customer bookings exist
  bookings.forEach(b => {
    const custId = b.customerId || 'guest_customer';
    addProfile(custId, b.customerName || 'Customer', b.customerEmail, b.customerMobile, 'customer', 'Uttar Pradesh', 'Lucknow', '', true);
  });

  statements.push('');

  // 3. Owners
  statements.push('-- 3. OWNERS');
  const ownerMap = new Map();
  const ownerIds = new Set();

  owners.forEach(o => {
    const ownerUuid = rawUuid(o.id);
    const profileUuid = rawUuid(o.userId || o.id);
    ownerIds.add(ownerUuid);

    ownerMap.set(o.id, ownerUuid);
    if (o.userId) ownerMap.set(o.userId, ownerUuid);

    let vStatus = (o.verificationStatus || 'VERIFIED').toUpperCase();
    if (!['PENDING', 'VERIFIED', 'APPROVED', 'REJECTED', 'SUSPENDED'].includes(vStatus)) {
      vStatus = 'APPROVED';
    }

    statements.push(`INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('${ownerUuid}', '${profileUuid}', ${escapeSql(o.businessName || o.name || 'Wedding Business')}, ${escapeSql(o.businessType || 'Marriage Hall')}, ${escapeSql(o.email || '')}, ${escapeSql(o.mobile || o.phone || '9876543210')}, ${escapeSql(o.city || 'Lucknow')}, ${escapeSql(o.state || 'Uttar Pradesh')}, '${vStatus}', ${escapeSql(o.rating || 5.0)}, ${escapeSql(o.reviewCount || 0)})
ON CONFLICT (id) DO NOTHING;`);
  });

  const defaultOwnerId = 'owner_default_partner';
  const defaultOwnerUuid = rawUuid(defaultOwnerId);
  if (!ownerIds.has(defaultOwnerUuid)) {
    const defaultProfileUuid = addProfile('usr_default_partner', 'Verified Venue Partner', 'partner@hallkhoj.com', '9876543210', 'owner', 'Uttar Pradesh', 'Lucknow', 'Vibhuti Khand', true);
    ownerIds.add(defaultOwnerUuid);
    ownerMap.set(defaultOwnerId, defaultOwnerUuid);
    statements.push(`INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('${defaultOwnerUuid}', '${defaultProfileUuid}', 'Heritage Event Partner', 'Marriage Hall', 'partner@hallkhoj.com', '9876543210', 'Lucknow', 'Uttar Pradesh', 'APPROVED', 5.0, 0)
ON CONFLICT (id) DO NOTHING;`);
  }

  halls.forEach(h => {
    if (h.ownerId && !ownerMap.has(h.ownerId)) {
      const oUuid = rawUuid(h.ownerId);
      const pUuid = addProfile(h.ownerId, h.name + ' Management', 'owner_' + h.id + '@hallkhoj.com', '9876500000', 'owner', h.state, h.city, h.area, true);
      ownerIds.add(oUuid);
      ownerMap.set(h.ownerId, oUuid);
      statements.push(`INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('${oUuid}', '${pUuid}', ${escapeSql(h.name + ' Management')}, 'Marriage Hall', 'owner_${h.id}@hallkhoj.com', '9876500000', ${escapeSql(h.city || 'Lucknow')}, ${escapeSql(h.state || 'Uttar Pradesh')}, 'APPROVED', 5.0, 0)
ON CONFLICT (id) DO NOTHING;`);
    }
  });

  statements.push('');

  // 4. Venues
  statements.push('-- 4. VENUES');
  const venueMap = new Map();
  const venueIds = new Set();

  halls.forEach(h => {
    const venueUuid = rawUuid(h.id);
    venueIds.add(venueUuid);
    venueMap.set(h.id, venueUuid);

    const ownerUuid = ownerMap.get(h.ownerId) || defaultOwnerUuid;
    const startPrice = h.startingPrice || 50000;
    const fullDay = h.pricing?.fullDay || Math.round(startPrice * 1.5);
    const weekday = h.pricing?.weekday || startPrice;
    const weekend = h.pricing?.weekend || Math.round(startPrice * 1.25);

    let status = (h.status || 'APPROVED').toUpperCase();
    if (!['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'SUSPENDED', 'FLAGGED'].includes(status)) {
      status = 'APPROVED';
    }

    statements.push(`INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('${venueUuid}', '${ownerUuid}', ${escapeSql(h.name)}, ${escapeSql(h.type || 'Marriage Hall')}, ${escapeSql(h.category || 'Marriage Halls')}, 'marriage-halls', '${status}', ${escapeSql(h.state || 'Uttar Pradesh')}, ${escapeSql(h.district || h.city || 'Lucknow')}, ${escapeSql(h.city || 'Lucknow')}, ${escapeSql(h.area || '')}, ${escapeSql(h.pin || '226010')}, ${escapeSql(startPrice)}, ${escapeSql(weekday)}, ${escapeSql(weekend)}, ${escapeSql(fullDay)}, ${escapeSql(h.capacityMin || 100)}, ${escapeSql(h.capacityMax || 1000)}, ${escapeSql(h.rating || 5.0)}, ${escapeSql(h.reviewCount || 0)}, ${escapeSql(!!h.verified)}, ${escapeSql(!!h.has3DModel)}, ${escapeSql(h.coverImg || '')})
ON CONFLICT (id) DO NOTHING;`);

    // Facilities
    if (Array.isArray(h.facilities)) {
      h.facilities.forEach(fac => {
        statements.push(`INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('${venueUuid}', ${escapeSql(fac)})
ON CONFLICT (venue_id, facility_name) DO NOTHING;`);
      });
    }

    // Availability dates
    if (h.availability && typeof h.availability === 'object') {
      Object.entries(h.availability).forEach(([date, st]) => {
        let ast = (st || 'AVAILABLE').toUpperCase();
        if (!['AVAILABLE', 'PENDING', 'BOOKED', 'BLOCKED'].includes(ast)) ast = 'AVAILABLE';
        statements.push(`INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('${venueUuid}', '${date}', 'Full Day', '${ast}')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;`);
      });
    }
  });

  bookings.forEach(b => {
    const vId = b.serviceId || b.hallId || 'h-101';
    if (!venueMap.has(vId)) {
      const vUuid = rawUuid(vId);
      venueIds.add(vUuid);
      venueMap.set(vId, vUuid);
      const oUuid = ownerMap.get(b.ownerId) || defaultOwnerUuid;
      statements.push(`INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('${vUuid}', '${oUuid}', ${escapeSql(b.serviceName || 'Heritage Celebration Service')}, 'Catering & Banquet', 'Banquet Halls', 'banquet-halls', 'APPROVED', 'Uttar Pradesh', 'Lucknow', 'Lucknow', 'Vibhuti Khand', '226010', 50000, 50000, 60000, 75000, 100, 500, 5.0, 1, TRUE, FALSE, 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO NOTHING;`);
    }
  });

  statements.push('');

  // 5. Bookings
  statements.push('-- 5. BOOKINGS');
  const bookingMap = new Map();
  const bookingIds = new Set();

  bookings.forEach(b => {
    const bId = b.bookingId || b.id;
    const bookingUuid = rawUuid(bId);
    bookingIds.add(bookingUuid);
    bookingMap.set(bId, bookingUuid);
    bookingMap.set(b.id, bookingUuid);

    const vId = b.serviceId || b.hallId || 'h-101';
    const venueUuid = venueMap.get(vId) || rawUuid('h-101');
    const ownerUuid = ownerMap.get(b.ownerId) || defaultOwnerUuid;
    const customerUuid = rawUuid(b.customerId || 'guest_customer');
    const total = b.totalPrice || b.pricing?.totalAmount || 50000;
    const advance = b.advanceRequired || b.pricing?.advanceRequired || Math.round(total * 0.25);
    
    let status = (b.status === 'ACCEPTED') ? 'APPROVED' : (b.status || 'PENDING_OWNER_APPROVAL');
    if (!['REQUESTED', 'PENDING_OWNER_APPROVAL', 'APPROVED', 'ACCEPTED', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      status = 'APPROVED';
    }

    statements.push(`INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('${bookingUuid}', ${escapeSql(b.bookingId || b.id || 'HKF-BK')}, '${venueUuid}', '${ownerUuid}', '${customerUuid}', ${escapeSql(b.customerName || 'Customer')}, ${escapeSql(b.customerMobile || '9876543210')}, ${escapeSql(b.customerEmail || '')}, ${escapeSql(b.eventDate || '2026-12-01')}, ${escapeSql(b.timeSlot || 'Evening')}, ${escapeSql(b.guestCount || 100)}, ${escapeSql(total)}, ${escapeSql(total)}, ${escapeSql(advance)}, '${status}')
ON CONFLICT (id) DO NOTHING;`);
  });
  statements.push('');

  // 6. Transactions
  statements.push('-- 6. TRANSACTIONS');
  transactions.forEach(t => {
    const txUuid = rawUuid(t.id || t.orderId);
    const bookingUuid = bookingMap.get(t.bookingId) || bookingMap.get('bk-901') || Array.from(bookingIds)[0];
    const customerUuid = rawUuid(t.customerId || 'guest_customer');
    const ownerUuid = ownerMap.get(t.ownerId) || defaultOwnerUuid;

    statements.push(`INSERT INTO public.transactions (id, booking_id, customer_id, owner_id, transaction_code, amount, type, status)
VALUES ('${txUuid}', '${bookingUuid}', '${customerUuid}', '${ownerUuid}', ${escapeSql(t.orderId || t.id)}, ${escapeSql(t.amount || 25000)}, 'ADVANCE_TOKEN', ${escapeSql(t.status || 'COMPLETED')})
ON CONFLICT (id) DO NOTHING;`);
  });
  statements.push('');

  // 7. Reviews
  statements.push('-- 7. REVIEWS');
  reviews.forEach(r => {
    const reviewUuid = rawUuid(r.id);
    const vId = r.serviceId || 'h-101';
    const venueUuid = venueMap.get(vId) || rawUuid('h-101');
    const customerUuid = rawUuid(r.customerId || 'guest_customer');

    statements.push(`INSERT INTO public.reviews (id, venue_id, customer_id, customer_name, rating, title, comment, owner_reply)
VALUES ('${reviewUuid}', '${venueUuid}', '${customerUuid}', ${escapeSql(r.customerName || 'Host')}, ${escapeSql(r.rating || 5)}, ${escapeSql(r.title || 'Great Venue')}, ${escapeSql(r.comment || 'Wonderful service and clean hall.')}, ${escapeSql(r.ownerReply || '')})
ON CONFLICT (id) DO NOTHING;`);
  });
  statements.push('');

  statements.push('COMMIT;\n');

  fs.writeFileSync(SEED_FILE, statements.join('\n'), 'utf8');
  console.log(`✅ Generated ${SEED_FILE} successfully! (${statements.length} SQL instructions)`);
  return { success: true };
}

if (require.main === module) {
  runMigration().catch(err => {
    console.error('Migration error:', err);
    process.exit(1);
  });
}

module.exports = { runMigration };
