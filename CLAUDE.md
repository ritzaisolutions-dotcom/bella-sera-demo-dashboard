# Bella Sera Demo Dashboard

## Project Overview
Password-protected reservation management dashboard for Bella Sera. Shows monthly stats and a filterable reservations table sourced from Supabase.

## Tech Stack
- Next.js 14 (App Router), TypeScript
- Tailwind CSS (dark mode via `class` strategy)
- Supabase (`@supabase/supabase-js`) — `reservations` table
- No external UI libraries

## Environment Variables
Copy `.env.local.example` to `.env.local` and fill in values:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `DASHBOARD_PASSWORD` — login password (server-only, never `NEXT_PUBLIC_`)

## Development

```bash
npm install
npm run dev
```

## Project Structure
```
app/
  layout.tsx              # Root layout, dark mode base
  page.tsx                # Dashboard (Server Component)
  login/page.tsx          # Login page (Client Component)
  api/auth/login/         # POST — set auth cookie
  api/auth/logout/        # GET — clear cookie + redirect
  api/reservations/       # GET — fetch from Supabase
components/
  StatsBar.tsx            # Monthly stats (Server Component)
  ReservationsTable.tsx   # Filterable table (Client Component)
  StatusBadge.tsx         # Colored status pill
lib/
  supabase.ts             # Supabase client factory + types
  auth.ts                 # Cookie helpers (two APIs: next/headers vs NextRequest)
middleware.ts             # Edge auth guard
```

## Auth
- Simple password auth: POST `/api/auth/login` → httpOnly cookie
- Middleware protects all routes except `/login` and `/api/auth/*`
- Cookie name: `bella-auth`, 7-day expiry

## Supabase `reservations` Table Schema
```
id               uuid (PK)
created_at       timestamptz
date             date
time             time
name             text
phone            text
party_size       integer
notes            text (nullable)
status           text  — 'pending' | 'confirmed' | 'cancelled'
marketing_consent boolean
```

If RLS is enabled, add a policy allowing anon reads or switch to a service role key (non-`NEXT_PUBLIC_`).
