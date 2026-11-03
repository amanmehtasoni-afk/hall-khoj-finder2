# Hall Khoj Finder — Backup & Disaster Recovery Guide

## 1. Supabase Automated Backups
Supabase Cloud executes automated daily database backups (WAL-G / Point-In-Time Recovery on Pro tiers).

## 2. Manual PostgreSQL Dump
To generate an immediate snapshot of the 22 relational tables:
```bash
pg_dump -h db.your-project.supabase.co -U postgres -d postgres -F c -b -v -f backup_$(date +%Y%m%d).dump
```

## 3. Local Dataset Archival
The verified production records are preserved in `backend/data/*.json`. Ensure this directory is retained during git commits and cold-storage archives.
To regenerate the seed SQL file at any time:
```bash
node backend/scripts/migrate_to_supabase.js
```
