# Customer Support Dashboard

AI-powered customer support ticket system with auto-summarization, sentiment analysis, and smart reply suggestions.

![Dashboard Preview](./docs/screenshots/dashboard.png)

## Features

| Feature | Description |
|---------|-------------|
| **Ticket Management** | Create, view, update, and assign support tickets with status tracking |
| **AI Summarization** | Automatically condenses long ticket threads into concise summaries |
| **Sentiment Analysis** | Detects customer mood from messages to prioritize urgent cases |
| **Smart Reply Suggestions** | AI generates draft responses that agents can review and send |
| **Auto-Categorization** | Intelligently tags tickets by category (billing, technical, etc.) |
| **Real-time Updates** | Live ticket updates via WebSockets |
| **Analytics Dashboard** | Track response time, resolution rate, and agent performance |
| **Customer Rating** | Collect feedback after ticket resolution |
| **Multi-Tenant** | Support multiple teams with role-based access |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4, shadcn/ui |
| Auth | NextAuth.js v5 |
| Database | PostgreSQL + Prisma 7 |
| AI | Groq (llama-3.1-8b-instant) via Vercel AI SDK |
| Real-time | Pusher WebSockets |
| Charts | Recharts |

## Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Run database migrations
pnpm prisma migrate deploy

# (Optional) Seed demo data
npx prisma db seed

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

**Demo Credentials:** `admin@example.com` / `admin123`

## Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/supportdb"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# AI (Groq)
OPENAI_API_KEY="gsk_..."

# Real-time (Pusher)
NEXT_PUBLIC_PUSHER_KEY="..."
PUSHER_APP_ID="..."
PUSHER_SECRET="..."
```

## Project Status

- [x] Database schema
- [x] Core ticket system
- [x] AI integration (summarization, replies, sentiment)
- [x] Dashboard analytics
- [x] Customer chat widget
- [x] Real-time updates
- [x] Customer rating system
- [x] Performance metrics
- [x] Settings & auto-assignment rules

## Documentation

- [User Manual](./docs/user-manual.md) - Complete guide for using SupportHub
- [Coding Conventions](./CONVENTIONS.md) - Development standards and patterns
- [CLAUDE.md](./CLAUDE.md) - Project cheat sheet for AI assistants

## Screenshots

| Dashboard | Tickets |
|-----------|---------|
| ![Dashboard](./docs/screenshots/dashboard.png) | ![Tickets](./docs/screenshots/tickets-list.png) |

| Ticket Detail | Performance |
|---------------|-------------|
| ![Ticket Detail](./docs/screenshots/ticket-detail.png) | ![Performance](./docs/screenshots/performance.png) |

| Settings | Widget Demo |
|----------|-------------|
| ![Settings](./docs/screenshots/settings.png) | ![Widget Demo](./docs/screenshots/widget-demo.png) |

## Widget Integration

**Floating Button (Recommended):**
```html
<script src="https://your-domain.com/widget/embed.js" data-team-id="your-team-id"></script>
```

**Iframe Embed:**
```html
<iframe src="https://your-domain.com/widget/your-team-id" width="380" height="600"></iframe>
```

See `/dashboard/widget-demo` for full integration docs.

## License

MIT
