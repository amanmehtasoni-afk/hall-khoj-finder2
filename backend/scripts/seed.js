/**
 * Hall Khoj Finder — MongoDB Seeder Script
 * Run with: npm run seed
 */

require('dotenv').config();
const { connectMongoDB, isLiveMongo, mongoose } = require('../config/mongodb');
const { syncLocalToMongoDB } = require('../services/firestore.service');

async function runSeed() {
  console.log('====================================================');
  console.log('🌱 HALL KHOJ FINDER — MONGODB SEEDER');
  console.log('====================================================');

  const conn = await connectMongoDB();
  if (!conn) {
    console.error('❌ Could not connect to MongoDB. Check MONGODB_URI in your .env file.');
    process.exit(1);
  }

  console.log('🚀 Syncing local verified listings and collections to MongoDB...');
  await syncLocalToMongoDB();
  console.log('✓ Seeding complete!');
  await mongoose.disconnect();
  process.exit(0);
}

runSeed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
