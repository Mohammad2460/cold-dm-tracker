# AI Coding Agent Instructions

These instructions help an AI agent work productively in this Next.js SaaS MVP. Follow the conventions and patterns documented here and reference the linked files for canonical examples.

## Big Picture
- Architecture: Next.js 14 App Router with server actions, Clerk auth, Prisma (PostgreSQL via Supabase), Tailwind + shadcn/ui, Resend email.
- Data flow: Auth via Clerk middleware, `getOrCreateUser()` provisions a DB user, server actions mutate data and trigger `revalidatePath`/`redirect`, UI client components call server actions, scheduled email reminders via cron endpoint.
- Key directories: [app](app), [lib](lib), [prisma](prisma), [components](components).

## Developer Workflows
- Dev server: `npm run dev` from [package.json](package.json).
- Migrations: `npx prisma migrate dev` and client generation via `npx prisma generate` (see [README.md](README.md)).
- DB inspect: `npx prisma studio` for quick data checks.
- Cron: Hit [app/api/cron/reminders/route.ts](app/api/cron/reminders/route.ts) via Vercel Cron or external service with `Authorization: Bearer ${CRON_SECRET}` at 8 AM UTC; endpoint handles per-user timezone.

## Authentication & User Provisioning
- All non-public routes are protected by Clerk middleware in [middleware.ts](middleware.ts) with redirect to sign-in.
- Use `getOrCreateUser()` in [lib/auth.ts](lib/auth.ts) to obtain the current app user; it auto-creates a `User` record with detected timezone and defaults (`email_reminders_enabled: true`, `onboarded: false`). Avoid duplicating this pattern.

## Data Model & Conventions
- Prisma models in [prisma/schema.prisma](prisma/schema.prisma): `User` and `DM`.
- Note: The generated client maps `DM` to `prisma.dM` (capital M) due to model casing; follow usage as seen in actions and routes.
- Status values: `"Waiting"`, `"In Conversation"`, `"Won"`, `"Lost"`.
- Platforms: `"X"` or `"LinkedIn"` (see zod enums in [app/actions/dms.ts](app/actions/dms.ts)).
- Ownership checks: Always scope queries by `user_id` to prevent cross-user access (see `findFirst` patterns in [app/actions/dms.ts](app/actions/dms.ts)).

## Server Actions Pattern
- Place mutations in [app/actions](app/actions) with `"use server"` and zod validation. Examples: `addDM`, `updateDMStatus`, `updateDM`, `deleteDM` in [app/actions/dms.ts](app/actions/dms.ts).
- After mutations, call `revalidatePath` for affected pages and optionally `redirect` to the canonical location.
- Forms post directly to server actions (see [app/dms/[id]/page.tsx](app/dms/%5Bid%5D/page.tsx)). Client components call actions and then `router.refresh()` (see [components/dm-status-buttons.tsx](components/dm-status-buttons.tsx)).

## UI Patterns
- Use shadcn/ui components under [components/ui](components/ui) and utility `cn()` from [lib/utils.ts](lib/utils.ts).
- Client-side search/filter is done with local state + `useMemo` (see [components/dms-list.tsx](components/dms-list.tsx)). Keep filtering logic performant and simple.
- Destructive actions use confirmation dialogs (see [components/delete-dm-button.tsx](components/delete-dm-button.tsx)).

## Email & Timezones
- Resend client is initialized in [lib/resend.ts](lib/resend.ts) and requires `RESEND_API_KEY`. Fail fast on missing env.
- Reminder emails are sent in [app/api/cron/reminders/route.ts](app/api/cron/reminders/route.ts) using `date-fns-tz` to compute "today" per user timezone; HTML email is constructed inline. Update the `from` address to your verified domain.

## CSV Export
- CSV generation lives in [app/api/dms/export/route.ts](app/api/dms/export/route.ts) with proper quoting and date formatting. Reuse this approach for future exports.

## Env Vars (Required)
- Clerk: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`.
- Database: `DATABASE_URL` (Supabase Postgres).
- Email: `RESEND_API_KEY`.
- Cron: `CRON_SECRET` (for reminders endpoint).
- App URL: `NEXT_PUBLIC_APP_URL` for links in emails.

## Common Gotchas
- Always use `getOrCreateUser()` before user-scoped DB operations.
- Remember `prisma.dM` model casing.
- After any mutation, revalidate relevant paths to keep UI in sync.
- Validate input with zod in server actions; parse `FormData` to correct types (dates, enums).
- Timezone logic happens at send-time; do not pre-convert follow-up dates to UTC in the DB.

## When Adding Features
- Prefer server actions for mutations; guard with ownership checks and zod.
- Co-locate small API routes under `app/api/...` only when needed (e.g., non-form triggers like export/cron).
- Keep UI components thin; delegate data changes to actions and refresh via `router.refresh()`.
