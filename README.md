# Customer Support Dashboard

AI-powered customer support ticket system with auto-summarization, sentiment analysis, and smart reply suggestions.

## What It Does

The Customer Support Dashboard helps support teams work more efficiently by combining traditional ticket management with AI-powered features:

### Core Features

| Feature | What It Does |
|---------|--------------|
| **Ticket Management** | Create, view, update, and assign support tickets with status tracking (Open, In Progress, Waiting, Resolved, Closed) |
| **AI Summarization** | Automatically condenses long ticket threads into concise summaries so agents can quickly understand context |
| **Sentiment Analysis** | Detects customer mood from messages (negative to positive scale) to prioritize urgent or frustrated customers |
| **Smart Reply Suggestions** | AI generates draft responses that agents can review, edit, and send |
| **Auto-Categorization** | Intelligently tags tickets by category (billing, technical, feature request, etc.) |
| **Real-time Updates** | Live ticket updates via WebSockets so the team stays in sync |
| **Analytics Dashboard** | Track metrics like response time, resolution rate, and agent performance |
| **Multi-Tenant** | Support multiple teams with role-based access (Admin, Agent) |

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **AI**: OpenAI API via Vercel AI SDK
- **Real-time**: Pusher WebSockets
- **Auth**: NextAuth.js v5

## Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
pnpm prisma migrate deploy

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Required Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI (for AI features)
OPENAI_API_KEY="sk-..."

# Pusher (for real-time updates)
NEXT_PUBLIC_PUSHER_KEY="..."
PUSHER_APP_ID="..."
PUSHER_SECRET="..."
```

See `.env.example` for all available options.

## Project Status

- [x] Database schema
- [x] Project setup
- [ ] Core ticket system
- [ ] AI integration
- [ ] Dashboard analytics
- [ ] Customer chat widget

## License

MIT
