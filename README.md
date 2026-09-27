# Solvify — Service Marketplace MVP

Find, compare, contact, and hire local professionals.

## Stack
Next.js 15 · TypeScript · Tailwind · Supabase (Postgres + Auth + Storage) · Vercel

## Setup

1. `npm install`
2. Copy `.env.example` → `.env.local`, fill Supabase keys
3. In Supabase SQL editor, run in order:
   - `database/migrations/0001_init.sql`
   - `database/migrations/0002_triggers.sql`
   - `database/migrations/0003_rls.sql`
   - `database/migrations/0004_auth_sync.sql`
4. Supabase → Authentication → Providers → Email: **disable email confirmation** (dev only)
5. Supabase → Authentication → URL Configuration:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/**`
6. `npm run dev`

## Create the first admin
Register normally, then run in Supabase SQL:
```sql
update public.users set role = 'ADMIN' where email = 'you@example.com';