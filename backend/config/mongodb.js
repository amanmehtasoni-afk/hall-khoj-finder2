/**
 * Hall Khoj Finder — MongoDB Connection Manager
 * Provides reliable, production-ready Mongoose connection with graceful fallback.
 */

require('dotenv').config();
const mongoose = require('mongoose');

let isConnected = false;
let connectionError = null;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hallkhoj';

async function connectMongoDB() {
  if (isConnected) return mongoose.connection;

  // If user has not configured MONGODB_URI and we are not in forced mongo mode,
  // we try with a quick timeout (2.5s) so the server never hangs.
  try {
    console.log(`🍃 [MongoDB] Connecting to: ${MONGODB_URI.replace(/:([^@]+)@/, ':****@')} ...`);
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 20,
      minPoolSize: 5,
      retryWrites: true,
      w: 'majority'
    });

    isConnected = true;
    connectionError = null;
    console.log('✓ [MongoDB] Connected successfully to database:', mongoose.connection.name);

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ [MongoDB] Disconnected from database.');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✓ [MongoDB] Reconnected to database.');
      isConnected = true;
    });

    return mongoose.connection;
  } catch (err) {
    isConnected = false;
    connectionError = err.message;
    console.warn(`ℹ️ [MongoDB] Could not connect to MongoDB (${err.message}).`);
    console.log('ℹ️ [MongoDB] Running in Dual-Mode: falling back to local transactional JSON layer.');
    console.log('💡 [Tip] To use MongoDB, set MONGODB_URI in your .env file or start local MongoDB on port 27017.');
    return null;
  }
}

function isLiveMongo() {
  return isConnected && mongoose.connection.readyState === 1;
}

function getMongoStatus() {
  return {
    connected: isLiveMongo(),
    readyState: mongoose.connection.readyState,
    readyStateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
    database: mongoose.connection.name || null,
    host: mongoose.connection.host || null,
    uri: MONGODB_URI ? MONGODB_URI.replace(/:([^@]+)@/, ':****@') : null,
    lastError: connectionError
  };
}

module.exports = {
  connectMongoDB,
  mongoose,
  isLiveMongo,
  getMongoStatus
};
