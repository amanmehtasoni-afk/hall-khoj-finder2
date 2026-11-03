/**
 * Hall Khoj Finder — Seeder & Supabase Compiler Script
 * Seeds local verified listings and compiles Supabase seed.sql.
 * Run with: npm run seed
 */

require('dotenv').config();
const { execSync } = require('child_process');
const path = require('path');

async function runSeed() {
  console.log('====================================================');
  console.log('🌱 HALL KHOJ FINDER — DATA SEEDER & SUPABASE COMPILER');
  console.log('====================================================');

  console.log('🚀 Compiling local verified listings into supabase/seed.sql...');
  const scriptPath = path.join(__dirname, 'migrate_to_supabase.js');
  execSync(`node "${scriptPath}"`, { stdio: 'inherit' });
  console.log('✓ Seeding and Supabase compilation complete!');
  process.exit(0);
}

runSeed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
