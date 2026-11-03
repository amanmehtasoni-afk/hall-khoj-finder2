# Hall Khoj Finder — Deployment Guide (Phase 21)

## 1. Frontend Deployment (Vercel or Netlify)
The frontend consists of static HTML5, CSS3, Vanilla JavaScript, and Three.js assets located in `/frontend`.

### Deploying on Vercel:
1. Connect repository to Vercel.
2. Root directory: `./`
3. Output directory: `frontend`
4. Deploy using `vercel.json` rewrite configuration.

### Deploying on Netlify:
1. Connect repository to Netlify.
2. Publish directory: `frontend`
3. Deploy using `netlify.toml` configuration.

## 2. Backend & Database Deployment (Supabase Cloud)
1. Create a project at [supabase.com](https://supabase.com).
2. Go to the SQL Editor and execute in order:
   - `supabase/migrations/20261103000001_initial_schema.sql`
   - `supabase/migrations/20261103000002_rls_policies.sql`
   - `supabase/migrations/20261103000003_functions_and_triggers.sql`
   - `supabase/migrations/20261103000004_storage_buckets.sql`
   - `supabase/seed.sql`
3. Copy your project URL, Anon Key, and Service Role Key to your deployment environment variables.

## 3. Node.js Express API Server (Railway, Render, or Docker)
- Node.js version: 18+ (tested on Node.js v24.21.0)
- Start Command: `node backend/server.js` or `node backend/cluster.js`
- Docker: `docker build -t hall-khoj . && docker run -p 3000:3000 hall-khoj`
