# PortfolioHub

> A Next.js portfolio & service marketplace starter built with the App Router, TypeScript, Tailwind CSS and Supabase for auth and realtime/data. This repository provides a production-ready scaffold to showcase projects, manage profiles, chat, and review workflows.

---

## Key facts

- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: Tailwind CSS + PostCSS
- Authentication & database: Supabase (@supabase/ssr + @supabase/supabase-js)
- Package manager: pnpm (pnpm-lock.yaml present; pnpm recommended)
- Node: Recommended Node.js 18+ (Next.js 16+ and React 19 require a modern Node runtime)

## What this project contains

- `app/` - Next.js App Router pages and layout (root `layout.tsx`, routes like `auth`, `dashboard`, `project`, `profile`, etc.)
- `components/` - Reusable UI components and `ui/` primitives
- `lib/` - Context providers and utilities (auth-context, chat-context, review-context, supabase client wrappers)
- `public/` - Static assets
- `styles/` - global CSS and Tailwind entry (`globals.css`)
- `scripts/` - SQL scripts used to create/reset tables (e.g., `01-create-tables.sql`, `02-reset-and-add-services.sql`)

## Project metadata (from package.json)

- Name: `portfolio-hub`
- Version: `0.1.0`
- Key dependencies: `next@16`, `react@19`, `@supabase/ssr`, `@supabase/supabase-js`, `tailwindcss@^4`, and several Radix UI packages and UI utilities.
- Dev dependencies: `typescript@^5`, `tailwindcss`, `postcss`, `@types/*`.

## Environment variables

This project requires Supabase credentials in environment variables. Create a `.env.local` file in the project root (do NOT commit secrets).

Example `.env.local` (values are placeholders):

```powershell
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
# Optional (server-only) service role key if you run server-side tasks that need elevated privileges
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Notes:
- Client-side code (browser) uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see `lib/supabase/client.ts`).
- Server components and API routes use the server client wrapper which also expects the same public variables for initialization (see `lib/supabase/server.ts`) and may also use cookie helpers.
- Keep the service role key secret and only set it in server environments (CI, Vercel Environment Variables, etc.).

## Quick start (Development)

These commands assume you have pnpm installed. If you prefer npm or yarn, the same `package.json` scripts will work but pnpm is recommended because the repo includes a `pnpm-lock.yaml`.

Open PowerShell and run:

```powershell
pnpm install
pnpm dev
```

The app runs at http://localhost:3000 by default.

Available npm scripts (from `package.json`):

- `pnpm dev` — run Next.js in development mode (`next dev`)
- `pnpm build` — build for production (`next build`)
- `pnpm start` — run the production server (`next start`)
- `pnpm lint` — run ESLint over the repo

## Build & Production

Before deploying, build the project:

```powershell
pnpm install --frozen-lockfile
pnpm build
pnpm start
```

When deploying to Vercel (recommended for Next.js), set the same environment variables via the Vercel dashboard. Alternatively, any platform that supports Node & Next.js (Netlify, Render, Fly.io, plain VPS) will work.

## Supabase setup

1. Create a Supabase project at https://app.supabase.com/
2. Copy the Project URL and Anon Key into your `.env.local` as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. If you need to run the example SQL that ships with the repo, use the SQL editor in Supabase and run `scripts/01-create-tables.sql` and `scripts/02-reset-and-add-services.sql`.
4. Review Row Level Security (RLS) policies for your tables. The app may expect certain policies to be in place for secure read/write access.

## App architecture notes

- Root layout (`app/layout.tsx`) wraps the app with `AuthProvider`, `ChatProvider`, and `ReviewProvider` context providers.
- UI primitives live under `components/ui/` and follow a Radix + Tailwind approach.
- Supabase clients:
  - `lib/supabase/client.ts` creates a browser client using `@supabase/ssr` helper `createBrowserClient` and reads from `NEXT_PUBLIC_*` envs.
  - `lib/supabase/server.ts` creates a server client using cookies integration for server components/routes.

## Common troubleshooting

- App fails to fetch from Supabase: double-check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` and in your deployment provider.
- TypeScript build errors: `next.config.mjs` currently sets `typescript.ignoreBuildErrors: true` so builds may succeed despite TS errors — consider enabling strict builds for production.
- Port in use: change `PORT` env var or specify `pnpm dev -- -p 3001` to change the dev port.

## Security & secrets

- Never commit `.env.local` or any secrets. Add them to `.gitignore`.
- Keep service role keys server-only.

## Next steps & recommendations

- Add `.env.example` with variable names (no values) so contributors know required env vars.
- Add a CI workflow (GitHub Actions) for lint and build checks.
- Add a `LICENSE` file and contributor guidelines if this project will be open-source.

## Contribution

Contributions are welcome. A minimal workflow:

1. Fork the repo.
2. Create a feature branch: `git checkout -b feat/your-change`.
3. Run and test changes locally.
4. Open a pull request describing the change.

## Where to look in the codebase

- `app/` — App Router pages and route layouts
- `components/ui/` — Primitive UI components
- `lib/` — auth, chat, review contexts and Supabase clients
- `scripts/` — SQL scripts for DB setup

---

If you want, I can also:

- Add a `.env.example` file automatically.
- Create a short CONTRIBUTING.md and a basic GitHub Actions CI to run lint and build.

Tell me which of those you'd like me to add next.
