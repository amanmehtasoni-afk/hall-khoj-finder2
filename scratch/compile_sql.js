const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, '../supabase/migrations');
const seedFile = path.join(__dirname, '../supabase/seed.sql');
const outFile = path.join(__dirname, '../supabase/setup_complete_database.sql');
const schemaOutFile = path.join(__dirname, '../supabase/1_schema_and_policies.sql');

let resetHeader = `-- ==============================================================================
-- HALL KHOJ FINDER — COMPLETE ONE-CLICK SUPABASE SETUP SCRIPT (AUTO-RESOLVED)
-- Resolves duplicate mobile/email constraints and safely initializes full schema
-- ==============================================================================

-- 1. CLEAN RESET (Safely wipes any half-created tables from previous failed run)
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- 2. RESTORE SUPABASE GRANTS
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;

`;

const files = [
  '20261103000001_initial_schema.sql',
  '20261103000002_rls_policies.sql',
  '20261103000003_functions_and_triggers.sql',
  '20261103000004_storage_buckets.sql'
];

let schemaContent = resetHeader;

files.forEach(f => {
  const p = path.join(migrationsDir, f);
  if (fs.existsSync(p)) {
    schemaContent += '\n-- >>> START: ' + f + ' <<<\n';
    schemaContent += fs.readFileSync(p, 'utf8') + '\n';
  }
});

fs.writeFileSync(schemaOutFile, schemaContent, 'utf8');

let fullContent = schemaContent;
if (fs.existsSync(seedFile)) {
  fullContent += '\n-- >>> START: SEED DATA <<<\n';
  fullContent += fs.readFileSync(seedFile, 'utf8') + '\n';
}

fs.writeFileSync(outFile, fullContent, 'utf8');
console.log('Successfully generated setup_complete_database.sql (' + (fullContent.length / 1024).toFixed(1) + ' KB)');
console.log('Successfully generated 1_schema_and_policies.sql (' + (schemaContent.length / 1024).toFixed(1) + ' KB)');
