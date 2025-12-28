# Cold DM Tracker

A SaaS application for tracking cold direct messages and follow-ups. Never miss a follow-up again.

## Features

- Add and track cold DMs (X/Twitter, LinkedIn)
- Dashboard with "Today" and "Overdue" sections
- Search and filter DMs
- Status management (Waiting, In Conversation, Won, Lost)
- Daily email reminders at 8 AM in user's timezone
- CSV export
- Mobile-responsive design
- Timezone auto-detection on signup
- Onboarding flow

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Authentication:** Clerk
- **Email:** Resend
- **Analytics:** Vercel Analytics & Speed Insights
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (Supabase recommended)
- Clerk account
- Resend account

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
DIRECT_URL=your_supabase_direct_connection_string

# Resend Email
RESEND_API_KEY=your_resend_api_key

# Cron job authentication
CRON_SECRET=your_secret_key_for_cron_endpoint

# App URL (for email links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Database

1. Create a Supabase project and get your PostgreSQL connection string
2. Update `DATABASE_URL` and `DIRECT_URL` in `.env.local`
3. Run migrations:

```bash
npx prisma migrate dev
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

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npx prisma studio` | Open Prisma database GUI |
| `npx prisma migrate dev` | Run database migrations |
| `npx prisma generate` | Generate Prisma Client |

## Project Structure

```
app/
├── (auth)/              # Auth pages (sign-in, sign-up via Clerk)
├── api/
│   ├── cron/reminders/  # Daily email reminder cron endpoint
│   └── dms/export/      # CSV export endpoint
├── dashboard/           # Main dashboard
├── dms/                 # DM management
│   ├── page.tsx         # All DMs list
│   ├── add/             # Add new DM
│   └── [id]/            # Edit/delete DM
├── settings/            # User preferences
├── onboarding/          # First-time user flow
└── actions/             # Server actions

components/
├── ui/                  # shadcn/ui components
└── email/               # Email templates

lib/                     # Utilities (auth, prisma, resend)
prisma/                  # Database schema and migrations
```

## Database Schema

**Users**
- `id` - Unique identifier
- `email` - User email
- `timezone` - User timezone (default: America/New_York)
- `email_reminders_enabled` - Email preference toggle
- `onboarded` - Onboarding completion status

**DMs**
- `id` - Unique identifier
- `user_id` - Foreign key to Users
- `name` - Contact name
- `platform` - X or LinkedIn
- `sent_date` - When the DM was sent
- `followup_date` - When to follow up
- `status` - Waiting, In Conversation, Won, or Lost
- `note` - Optional notes

## Daily Email Reminders

The cron job endpoint is at `/api/cron/reminders`. It sends reminder emails to users who have DMs due for follow-up.

### Vercel Cron (Recommended)

The cron is configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/reminders",
      "schedule": "0 3 * * *"
    }
  ]
}
```

This runs at 3 AM UTC. The endpoint checks each user's timezone to send emails at 8 AM local time.

### External Cron Service

Alternatively, use a service like [cron-job.org](https://cron-job.org) or [EasyCron](https://www.easycron.com).

Set it to call: `https://yourdomain.com/api/cron/reminders`

Include the authorization header:
```
Authorization: Bearer your_cron_secret
```

## Deployment

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

The cron job will automatically run based on `vercel.json` configuration.

## License

MIT
