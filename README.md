# Cold DM Tracker

A simple SaaS MVP for tracking cold DMs and follow-ups. Never miss a follow-up again!

## Features

- ✅ Add and track cold DMs (X/Twitter, LinkedIn)
- ✅ Dashboard with "Today" and "Overdue" sections
- ✅ Search and filter DMs
- ✅ Status management (Waiting, In Conversation, Won, Lost)
- ✅ Daily email reminders at 8 AM (user's timezone)
- ✅ CSV export
- ✅ Mobile-responsive design
- ✅ Timezone auto-detection on signup
- ✅ Onboarding flow

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Prisma** + **PostgreSQL** (Supabase)
- **Clerk** (Authentication)
- **Resend** (Email)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Database (Supabase PostgreSQL)
DATABASE_URL=your_supabase_connection_string

# Resend Email
RESEND_API_KEY=your_resend_api_key

# Optional: For cron job authentication
CRON_SECRET=your_secret_key_for_cron_endpoint

# Optional: Your app URL (for email links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Database

1. Create a Supabase project and get your PostgreSQL connection string
2. Update `DATABASE_URL` in `.env.local`
3. Run migrations:

```bash
npx prisma migrate dev --name init
```

### 4. Set Up Clerk

1. Create a Clerk account at https://clerk.com
2. Create a new application
3. Copy your publishable key and secret key to `.env.local`

### 5. Set Up Resend

1. Create a Resend account at https://resend.com
2. Get your API key
3. Add it to `.env.local`
4. Update the `from` email in `app/api/cron/reminders/route.ts` with your verified domain

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Setting Up Daily Email Reminders

The cron job endpoint is at `/api/cron/reminders`. You need to set up a cron job to call this endpoint daily.

### Option 1: Vercel Cron (Recommended)

Add this to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/reminders",
      "schedule": "0 8 * * *"
    }
  ]
}
```

Note: This runs at 8 AM UTC. The endpoint handles timezone conversion for each user.

### Option 2: External Cron Service

Use a service like:
- [cron-job.org](https://cron-job.org)
- [EasyCron](https://www.easycron.com)

Set it to call: `https://yourdomain.com/api/cron/reminders` daily at 8 AM UTC (or adjust the schedule).

Make sure to set the `CRON_SECRET` environment variable and include it in the Authorization header:
```
Authorization: Bearer your_cron_secret
```

## Project Structure

```
/app
  /(auth)          # Auth pages (handled by Clerk)
  /dashboard       # Main dashboard
  /dms             # All DMs list
    /add           # Add new DM
    /[id]          # Edit/delete DM
  /settings        # User settings
  /onboarding      # Onboarding flow
  /api
    /cron/reminders # Daily email cron job
    /dms/export    # CSV export
  /actions         # Server actions
/components        # React components
/lib               # Utilities
/prisma            # Database schema
```

## Development

- Run migrations: `npx prisma migrate dev`
- Generate Prisma Client: `npx prisma generate`
- View database: `npx prisma studio`

## Deployment

1. Push to GitHub
2. Deploy to Vercel
3. Set environment variables in Vercel dashboard
4. Set up the cron job (see above)

## Next Steps (Phases 5-6)

- **Phase 5**: Use the tool yourself for 2 weeks, track 20+ cold DMs, identify pain points
- **Phase 6**: Give access to 5 users, gather feedback, validate product-market fit

## License

MIT

