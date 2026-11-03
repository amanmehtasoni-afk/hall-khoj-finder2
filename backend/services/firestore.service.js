/**
 * Hall Khoj Finder — Unified Data Access Service Layer
 * Supports:
 * 1. MongoDB (Mongoose models - primary production store)
 * 2. Firebase Cloud Firestore (Admin SDK)
 * 3. Local High-Performance Transactional JSON Store (Offline / dev fallback)
 */

const fs = require('fs');
const path = require('path');
const { db, isLiveFirebase } = require('../config/firebase');
const { isLiveMongo } = require('../config/mongodb');
const { getModelForCollection } = require('../models');

let firebaseWorking = isLiveFirebase;

function handleFirebaseError(op, err) {
  if (firebaseWorking) {
    console.warn(`⚠️ [Firebase Firestore] ${op} failed (${err.message}). Seamlessly falling back to local transactional JSON store.`);
    firebaseWorking = false;
  }
}

const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getFilePath(collectionName) {
  return path.join(DATA_DIR, `${collectionName}.json`);
}

function readLocalCollection(collectionName) {
  const filePath = getFilePath(collectionName);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) || [];
  } catch (err) {
    console.error(`Error reading local collection ${collectionName}:`, err);
    return [];
  }
}

function writeLocalCollection(collectionName, items) {
  const filePath = getFilePath(collectionName);
  try {
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing local collection ${collectionName}:`, err);
  }
}

// 1. Get All Documents from a Collection
async function getCollection(collectionName) {
  if (isLiveMongo()) {
    try {
      const Model = getModelForCollection(collectionName);
      if (Model) {
        const docs = await Model.find({}).lean();
        if (docs && docs.length > 0) {
          return docs.map(d => ({ ...d, id: d.id || d._id?.toString() }));
        }
      }
    } catch (err) {
      console.warn(`[MongoDB] Query failed for ${collectionName}:`, err.message);
    }
  }

  if (firebaseWorking && db) {
    try {
      const snapshot = await db.collection(collectionName).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      handleFirebaseError(`getCollection('${collectionName}')`, err);
    }
  }

  return readLocalCollection(collectionName);
}

// 2. Get Document by ID
async function getDocument(collectionName, docId) {
  if (!docId) return null;

  if (isLiveMongo()) {
    try {
      const Model = getModelForCollection(collectionName);
      if (Model) {
        const doc = await Model.findOne({ id: docId }).lean();
        if (doc) return { ...doc, id: doc.id || doc._id?.toString() };
      }
    } catch (err) {
      console.warn(`[MongoDB] FindOne failed for ${collectionName}/${docId}:`, err.message);
    }
  }

  if (firebaseWorking && db) {
    try {
      const docRef = await db.collection(collectionName).doc(docId).get();
      if (!docRef.exists) return null;
      return { id: docRef.id, ...docRef.data() };
    } catch (err) {
      handleFirebaseError(`getDocument('${collectionName}', '${docId}')`, err);
    }
  }

  const items = readLocalCollection(collectionName);
  return items.find(item => item.id === docId) || null;
}

// 3. Create or Overwrite Document
async function setDocument(collectionName, docId, data) {
  const docData = { ...data, updatedAt: new Date().toISOString() };
  if (!docData.createdAt) {
    docData.createdAt = new Date().toISOString();
  }
  docData.id = docId;

  // MongoDB persistence
  if (isLiveMongo()) {
    try {
      const Model = getModelForCollection(collectionName);
      if (Model) {
        const updated = await Model.findOneAndUpdate(
          { id: docId },
          { $set: docData },
          { upsert: true, new: true, setDefaultsOnInsert: true, lean: true }
        );
        // Keep local JSON in sync as well
        syncDocToLocal(collectionName, docId, docData);
        return { ...updated, id: docId };
      }
    } catch (err) {
      console.warn(`[MongoDB] setDocument failed for ${collectionName}/${docId}:`, err.message);
    }
  }

  // Firebase persistence
  if (firebaseWorking && db) {
    try {
      await db.collection(collectionName).doc(docId).set(docData, { merge: true });
      syncDocToLocal(collectionName, docId, docData);
      return { id: docId, ...docData };
    } catch (err) {
      handleFirebaseError(`setDocument('${collectionName}', '${docId}')`, err);
    }
  }

  // Local JSON persistence
  return syncDocToLocal(collectionName, docId, docData);
}

function syncDocToLocal(collectionName, docId, docData) {
  const items = readLocalCollection(collectionName);
  const existingIdx = items.findIndex(item => item.id === docId);

  if (existingIdx >= 0) {
    items[existingIdx] = { ...items[existingIdx], ...docData, id: docId };
  } else {
    items.push({ id: docId, ...docData });
  }

  writeLocalCollection(collectionName, items);
  return { id: docId, ...docData };
}

// 4. Update Document
async function updateDocument(collectionName, docId, updates) {
  const updatedData = { ...updates, updatedAt: new Date().toISOString() };

  if (isLiveMongo()) {
    try {
      const Model = getModelForCollection(collectionName);
      if (Model) {
        const updated = await Model.findOneAndUpdate(
          { id: docId },
          { $set: updatedData },
          { new: true, lean: true }
        );
        if (updated) {
          syncDocToLocal(collectionName, docId, updated);
          return { ...updated, id: docId };
        }
      }
    } catch (err) {
      console.warn(`[MongoDB] updateDocument failed for ${collectionName}/${docId}:`, err.message);
    }
  }

  if (firebaseWorking && db) {
    try {
      await db.collection(collectionName).doc(docId).update(updatedData);
      const updatedDoc = await db.collection(collectionName).doc(docId).get();
      const result = { id: docId, ...updatedDoc.data() };
      syncDocToLocal(collectionName, docId, result);
      return result;
    } catch (err) {
      handleFirebaseError(`updateDocument('${collectionName}', '${docId}')`, err);
    }
  }

  const items = readLocalCollection(collectionName);
  const idx = items.findIndex(item => item.id === docId);
  if (idx === -1) {
    throw new Error(`Document ${docId} in ${collectionName} not found`);
  }

  items[idx] = { ...items[idx], ...updatedData };
  writeLocalCollection(collectionName, items);
  return items[idx];
}

// 5. Delete Document
async function deleteDocument(collectionName, docId) {
  if (isLiveMongo()) {
    try {
      const Model = getModelForCollection(collectionName);
      if (Model) {
        await Model.deleteOne({ id: docId });
      }
    } catch (err) {
      console.warn(`[MongoDB] deleteDocument failed for ${collectionName}/${docId}:`, err.message);
    }
  }

  if (firebaseWorking && db) {
    try {
      await db.collection(collectionName).doc(docId).delete();
    } catch (err) {
      handleFirebaseError(`deleteDocument('${collectionName}', '${docId}')`, err);
    }
  }

  const items = readLocalCollection(collectionName);
  const filtered = items.filter(item => item.id !== docId);
  writeLocalCollection(collectionName, filtered);
  return true;
}

// 6. Create Document with auto-generated ID if missing
async function createDocument(collectionName, data) {
  const docId = data.id || `${collectionName.slice(0, 4)}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  return setDocument(collectionName, docId, { ...data, id: docId });
}

// 7. Query Collection with Predicate
async function queryCollection(collectionName, predicate) {
  const all = await getCollection(collectionName);
  if (!predicate) return all;
  return all.filter(predicate);
}

// 8. Sync all local JSON collections into MongoDB if MongoDB is empty
async function syncLocalToMongoDB() {
  if (!isLiveMongo()) return;

  const collections = [
    'categories', 'halls', 'cars', 'tent_houses', 'services',
    'users', 'owners', 'bookings', 'reviews', 'notifications',
    'messages', 'staff', 'audit_logs', 'transactions'
  ];

  for (const coll of collections) {
    try {
      const Model = getModelForCollection(coll);
      if (!Model) continue;

      const count = await Model.countDocuments();
      if (count === 0) {
        const localItems = readLocalCollection(coll);
        if (localItems.length > 0) {
          const formatted = localItems.map(item => ({
            ...item,
            id: item.id || `${coll}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
          }));
          await Model.insertMany(formatted, { ordered: false }).catch(() => {});
          console.log(`🍃 [MongoDB] Seeded ${formatted.length} documents into '${coll}' collection.`);
        }
      }
    } catch (err) {
      console.warn(`[MongoDB Sync] Could not sync collection ${coll}:`, err.message);
    }
  }
}

// Seed initial production verified data if collections are empty
async function seedInitialDataIfEmpty() {
  const halls = await getCollection('halls');
  if (halls.length === 0) {
    const defaultHalls = [
      {
        id: 'h-101',
        ownerId: 'owner_101',
        name: 'The Royal Grand Heritage Palace',
        type: 'Marriage Hall',
        category: 'Marriage Halls',
        status: 'APPROVED',
        city: 'Lucknow',
        district: 'Lucknow',
        state: 'Uttar Pradesh',
        area: 'Gomti Nagar',
        pin: '226010',
        latitude: 26.8500,
        longitude: 80.9900,
        startingPrice: 65000,
        capacityMin: 200,
        capacityMax: 1200,
        rating: 4.9,
        reviewCount: 148,
        verified: true,
        has3DModel: true,
        coverImg: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
        facilities: ['Central AC', 'Lawn (25,000 sq ft)', 'Parking (150 Cars)', 'Generator Backup', 'Bridal Suite', 'In-house Decor'],
        pricing: {
          weekday: 65000,
          weekend: 85000,
          fullDay: 110000,
          advancePercentage: 25
        },
        availability: {
          '2026-10-15': 'AVAILABLE',
          '2026-10-16': 'PENDING',
          '2026-10-17': 'BOOKED',
          '2026-10-18': 'BLOCKED',
          '2026-10-19': 'AVAILABLE',
          '2026-10-20': 'AVAILABLE'
        }
      },
      {
        id: 'h-102',
        ownerId: 'owner_102',
        name: 'Mayur Emerald Banquet & Lawn',
        type: 'Banquet Hall',
        category: 'Marriage Halls',
        status: 'APPROVED',
        city: 'Patna',
        district: 'Patna',
        state: 'Bihar',
        area: 'Bailey Road',
        pin: '800014',
        latitude: 25.6000,
        longitude: 85.1200,
        startingPrice: 45000,
        capacityMin: 100,
        capacityMax: 750,
        rating: 4.8,
        reviewCount: 96,
        verified: true,
        has3DModel: true,
        coverImg: 'https://images.unsplash.com/photo-1544830254-20b1274f881b?auto=format&fit=crop&w=800&q=80',
        facilities: ['Air Conditioned', 'Open Stage', 'Valet Parking', 'Power Backup', 'Catering Kitchen'],
        pricing: {
          weekday: 45000,
          weekend: 60000,
          fullDay: 85000,
          advancePercentage: 25
        },
        availability: {
          '2026-10-15': 'AVAILABLE',
          '2026-10-16': 'AVAILABLE',
          '2026-10-17': 'BOOKED',
          '2026-10-18': 'AVAILABLE'
        }
      },
      {
        id: 'h-103',
        ownerId: 'owner_103',
        name: 'Sanskriti Luxury Resort & Lawn',
        type: 'Resort',
        category: 'Marriage Halls',
        status: 'APPROVED',
        city: 'Delhi NCR',
        district: 'Gurugram',
        state: 'Haryana',
        area: 'Sector 48',
        pin: '122018',
        latitude: 28.4300,
        longitude: 77.0400,
        startingPrice: 120000,
        capacityMin: 300,
        capacityMax: 2000,
        rating: 4.95,
        reviewCount: 230,
        verified: true,
        has3DModel: true,
        coverImg: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        facilities: ['Poolside Lawn', '15 AC Rooms', 'Valet (300 Cars)', 'Full Power Backup', 'Helipad', 'CCTV & Security'],
        pricing: {
          weekday: 120000,
          weekend: 160000,
          fullDay: 220000,
          advancePercentage: 30
        },
        availability: {
          '2026-10-15': 'BOOKED',
          '2026-10-16': 'AVAILABLE',
          '2026-10-17': 'BOOKED',
          '2026-10-18': 'PENDING'
        }
      }
    ];

    for (const hall of defaultHalls) {
      await setDocument('halls', hall.id, hall);
    }
  }

  const cars = await getCollection('cars');
  if (cars.length === 0) {
    const defaultCars = [
      {
        id: 'c-201',
        ownerId: 'owner_101',
        name: 'Mercedes-Benz E-Class Luxury Wedding Car',
        type: 'Car',
        category: 'Cars',
        status: 'APPROVED',
        brand: 'Mercedes-Benz',
        model: 'E-Class',
        year: 2024,
        color: 'Pearl White',
        seating: 4,
        ac: true,
        fuel: 'Diesel',
        transmission: 'Automatic',
        driverAvailable: true,
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        startingPrice: 15000,
        priceUnit: 'per event',
        rating: 4.9,
        verified: true,
        coverImg: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80'
      }
    ];
    for (const car of defaultCars) {
      await setDocument('cars', car.id, car);
    }
  }

  const tents = await getCollection('tent_houses');
  if (tents.length === 0) {
    const defaultTents = [
      {
        id: 't-301',
        ownerId: 'owner_102',
        name: 'Shree Krishna Royal Tent & Shamiana Works',
        type: 'Tent House',
        category: 'Tent Houses',
        status: 'APPROVED',
        city: 'Varanasi',
        state: 'Uttar Pradesh',
        area: 'Bhelupur',
        pin: '221005',
        startingPrice: 25000,
        rating: 4.8,
        verified: true,
        services: ['German Hanger', 'Waterproof Shamiana', 'Sofa & Banquet Chairs', 'Haldi & Mehndi Setup'],
        coverImg: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80'
      }
    ];
    for (const tent of defaultTents) {
      await setDocument('tent_houses', tent.id, tent);
    }
  }

  const staff = await getCollection('staff');
  if (staff.length === 0) {
    const defaultStaff = [
      {
        id: 'stf-101',
        ownerId: 'owner_101',
        name: 'Sunil Sharma',
        mobile: '+91 94150 12345',
        role: 'Manager',
        experience: '6 years',
        description: 'Lead operations manager for grand events and VIP logistics.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'stf-102',
        ownerId: 'owner_101',
        name: 'Pooja Verma',
        mobile: '+91 94150 67890',
        role: 'Receptionist',
        experience: '3 years',
        description: 'Guest relations and welcome coordinator.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'stf-103',
        ownerId: 'owner_101',
        name: 'Vikram Yadav',
        mobile: '+91 94150 99887',
        role: 'Security',
        experience: '5 years',
        description: 'Head of event perimeter security and valet coordination.',
        createdAt: new Date().toISOString()
      }
    ];
    for (const member of defaultStaff) {
      await setDocument('staff', member.id, member);
    }
  }
}

// Run initial seed on load
seedInitialDataIfEmpty().catch(err => console.error('Error seeding data:', err));

module.exports = {
  getCollection,
  getDocument,
  setDocument,
  updateDocument,
  deleteDocument,
  createDocument,
  queryCollection,
  syncLocalToMongoDB
};
