const fs = require('fs');

const sql = fs.readFileSync('supabase/setup_complete_database.sql', 'utf8');

// Parse all INSERTs and collect IDs for each table
const insertedRecords = {
  profiles: new Set(),
  owners: new Set(),
  venues: new Set(),
  bookings: new Set(),
  payments: new Set()
};

// Also collect foreign key references
const referencesToCheck = [];

const insertRegex = /INSERT INTO public\.([a-zA-Z0-9_]+)\s*\(([^)]+)\)\s*VALUES\s*\(([\s\S]*?)\)\s*ON CONFLICT/gi;
let m;

while ((m = insertRegex.exec(sql)) !== null) {
  const table = m[1];
  const cols = m[2].split(',').map(c => c.trim());
  const valStr = m[3];
  
  // parse csv
  const vals = [];
  let cur = '';
  let inQuote = false;
  for (let i = 0; i < valStr.length; i++) {
    const c = valStr[i];
    if (c === "'" && (i === 0 || valStr[i-1] !== '\\')) {
      inQuote = !inQuote;
    } else if (c === ',' && !inQuote) {
      vals.push(cur.trim());
      cur = '';
      continue;
    }
    cur += c;
  }
  vals.push(cur.trim());

  const getVal = (col) => {
    const idx = cols.indexOf(col);
    if (idx === -1) return null;
    const v = vals[idx];
    if (!v || v === 'NULL') return null;
    return v.replace(/^'|'$/g, '');
  };

  const id = getVal('id');
  if (id && insertedRecords[table]) {
    insertedRecords[table].add(id);
  }

  // Check specific FK columns
  if (table === 'user_roles') {
    referencesToCheck.push({ source: 'user_roles', id, col: 'profile_id', val: getVal('profile_id'), targetTable: 'profiles' });
  } else if (table === 'owners') {
    referencesToCheck.push({ source: 'owners', id, col: 'profile_id', val: getVal('profile_id'), targetTable: 'profiles' });
  } else if (table === 'venues') {
    referencesToCheck.push({ source: 'venues', id, col: 'owner_id', val: getVal('owner_id'), targetTable: 'owners' });
  } else if (table === 'venue_images' || table === 'venue_videos' || table === 'venue_categories' || table === 'venue_facilities' || table === 'venue_availability') {
    referencesToCheck.push({ source: table, id, col: 'venue_id', val: getVal('venue_id'), targetTable: 'venues' });
  } else if (table === 'bookings') {
    referencesToCheck.push({ source: 'bookings', id, col: 'venue_id', val: getVal('venue_id'), targetTable: 'venues' });
    referencesToCheck.push({ source: 'bookings', id, col: 'owner_id', val: getVal('owner_id'), targetTable: 'owners' });
    referencesToCheck.push({ source: 'bookings', id, col: 'customer_id', val: getVal('customer_id'), targetTable: 'profiles' });
  } else if (table === 'payments') {
    referencesToCheck.push({ source: 'payments', id, col: 'booking_id', val: getVal('booking_id'), targetTable: 'bookings' });
    referencesToCheck.push({ source: 'payments', id, col: 'customer_id', val: getVal('customer_id'), targetTable: 'profiles' });
  } else if (table === 'transactions') {
    referencesToCheck.push({ source: 'transactions', id, col: 'payment_id', val: getVal('payment_id'), targetTable: 'payments' });
    referencesToCheck.push({ source: 'transactions', id, col: 'booking_id', val: getVal('booking_id'), targetTable: 'bookings' });
    referencesToCheck.push({ source: 'transactions', id, col: 'customer_id', val: getVal('customer_id'), targetTable: 'profiles' });
    referencesToCheck.push({ source: 'transactions', id, col: 'owner_id', val: getVal('owner_id'), targetTable: 'owners' });
  } else if (table === 'reviews') {
    referencesToCheck.push({ source: 'reviews', id, col: 'venue_id', val: getVal('venue_id'), targetTable: 'venues' });
    referencesToCheck.push({ source: 'reviews', id, col: 'customer_id', val: getVal('customer_id'), targetTable: 'profiles' });
  }
}

console.log('Inserted counts:', {
  profiles: insertedRecords.profiles.size,
  owners: insertedRecords.owners.size,
  venues: insertedRecords.venues.size,
  bookings: insertedRecords.bookings.size,
  payments: insertedRecords.payments.size
});

console.log('\nChecking all', referencesToCheck.length, 'Foreign Key references...');
const missingFKs = [];
for (const ref of referencesToCheck) {
  if (ref.val && insertedRecords[ref.targetTable]) {
    if (!insertedRecords[ref.targetTable].has(ref.val)) {
      missingFKs.push(ref);
    }
  }
}

console.log(`Found ${missingFKs.length} broken Foreign Key references:`);
const uniqueMissing = {};
for (const m of missingFKs) {
  const k = `${m.source}.${m.col} -> ${m.targetTable} (${m.val})`;
  uniqueMissing[k] = (uniqueMissing[k] || 0) + 1;
}
console.log(uniqueMissing);
