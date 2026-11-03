/**
 * Hall Khoj Finder — Firebase & Database Configuration
 * Integrates Firebase Admin SDK with graceful fallback when credentials are unconfigured.
 */

require('dotenv').config();

let db = null;
let isLiveFirebase = false;

// Check if Firebase credentials exist in environment
const projectId = process.env.FIREBASE_PROJECT_ID;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
console.log('Project ID:',projectId,'clientEmail:',clientEmail);

if (projectId && privateKey && clientEmail) {
  try {
    const { initializeApp, cert, getApps } = require('firebase-admin/app');
    const { getFirestore } = require('firebase-admin/firestore');
    
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n')
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
      });
    }
    db = getFirestore();
    isLiveFirebase = true;
    console.log('✓ [Firebase] Connected to live Cloud Firestore project:', projectId);
  } catch (err) {
    console.warn('⚠️ [Firebase] Could not initialize live Firebase Admin:', err.message);
  }
} else {
  console.log('ℹ️ [Firebase] Live credentials not set in .env. Initializing local transactional Firestore layer.');
}

module.exports = {
  db,
  isLiveFirebase
};
