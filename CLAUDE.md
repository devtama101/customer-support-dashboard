# Customer Support Dashboard

AI-powered support ticket system with chatbot, auto-summarization, and sentiment analysis.

## Quick Start

```bash
pnpm dev              # Start dev server (http://localhost:3000)
pnpm build            # Build for production
npx prisma studio     # Database GUI
npx prisma db push    # Push schema changes to DB
npx prisma db seed    # Seed demo data
```

**Demo Credentials:** `admin@example.com` / `admin123`

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router, Server Components) |
| UI | shadcn/ui + Tailwind CSS |
| Auth | NextAuth v5 (Credentials + Google OAuth) |
| DB | PostgreSQL + Prisma 7 |
| AI | Vercel AI SDK + Groq (llama-3.1-8b-instant) |
| Real-time | Pusher |
| Charts | Recharts |

---

## Architecture Pattern

```
Database (Prisma) → Server Actions → Types → Components → Pages
```

**No API routes for CRUD** - use Server Actions in `actions/` folder instead.

**Server Components by default** - only use `'use client'` for:
- Interactivity (onClick, useState, etc.)
- Browser APIs (localStorage, etc.)
- Third-party libs that require React context

---

## Coding Conventions

**See [CONVENTIONS.md](./CONVENTIONS.md) for the complete coding standards.**

Quick reference:
- Server Actions: `'use server'` at top, named exports, type cast Prisma results
- Types: `EntityWithRelations`, `CreateEntityInput`, `EntityFilters`
- Imports: React → Third-party → Internal lib → Actions → Components
- Components: Props interface, destructure in params, `cn()` for styles
- Next.js 16: `await params`, `await searchParams` (both are Promises)
- Auth: `await auth()` at start of protected pages
- Error handling: `notFound()` for missing, `console.error()` for async errors

---

## Critical: Next.js 16 Breaking Changes

```typescript
// ❌ WRONG (Next.js 15 and earlier)
export default function Page({ params, searchParams }: PageProps) {
  const id = params.id;
}

// ✅ CORRECT (Next.js 16)
export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;        // params is a Promise
  const { tab } = await searchParams; // searchParams is a Promise
}
```

This affects **all** dynamic routes `[id]/page.tsx`.

---

## Key File Locations

```
actions/
├── tickets.ts      # getTickets, createTicket, updateTicketStatus, assignTicket
├── customers.ts    # getCustomers, createCustomer, updateCustomer
├── messages.ts     # getTicketMessages, addMessage (triggers AI)
├── ai.ts           # generateSummary, generateTicketReply, suggestTicketPriority
├── agents.ts       # getAgents, getTeam
└── index.ts        # Re-exports all

lib/
├── auth.ts         # NextAuth v5 config
├── prisma.ts       # Prisma client singleton
├── ai.ts           # OpenAI client (analyzeSentiment, categorizeTicket)
├── schemas.ts      # Zod validation schemas
└── utils.ts        # cn() class merger

app/
├── dashboard/
│   ├── layout.tsx           # Auth wrapper + sidebar layout
│   ├── page.tsx             # Dashboard overview
│   ├── tickets/             # List, detail, new
│   ├── customers/           # List, detail, new, edit
│   ├── performance/         # Placeholder
│   ├── settings/            # Placeholder
│   └── widget-demo/         # Widget integration docs
├── widget/[teamId]/page.tsx # Customer-facing chat widget
├── login/page.tsx           # Login page
└── api/auth/[...nextauth]/  # NextAuth handler

components/
├── layout/                  # Sidebar, Header, DashboardLayout
├── ui/                      # shadcn base components
├── dashboard/               # StatsCard, Charts, RecentTickets
├── tickets/                 # TicketTable, TicketDetail, MessageList, etc.
└── customers/               # CustomerTable, QuickActions, etc.
```

---

## Auth Flow

```typescript
import { auth } from '@/lib/auth';

// In Server Components
const session = await auth();
// session.user.id, session.user.teamId, session.user.role

// Middleware (proxy.ts) protects /dashboard routes
// Unauthenticated users → /login
```

---

## Database Models

```prisma
Team       → has many Agents, Tickets
User       → has many Agents
Agent      → belongs to Team, User, has many Tickets
Customer   → has many Tickets
Ticket     → belongs to Team, Customer, Agent (optional), has many Messages, AiLogs
Message    → belongs to Ticket
AiLog      → belongs to Ticket (tracks AI token usage)
```

---

## AI Integration (Hybrid Model)

**Immediate (on new message):**
- Sentiment analysis: `-1` (negative) to `1` (positive)
- Category detection: "Billing", "Technical", "Feature Request", etc.

**On-Demand (agent clicks):**
- Summary generation
- Reply suggestions
- Priority suggestions

```typescript
import { generateSummary, generateTicketReply } from '@/actions';
const summary = await generateSummary(ticketId);
const reply = await generateTicketReply(ticketId);
```

---

## Common Patterns

### Creating a new page in dashboard:
```typescript
// app/dashboard/feature/page.tsx
import { auth } from '@/lib/auth';
import { Header } from '@/components/layout/Header';

export default async function FeaturePage() {
  const session = await auth();
  return (
    <>
      <Header title="Feature" subtitle="Description" />
      {/* content */}
    </>
  );
}
```

### Server Action pattern:
```typescript
// actions/feature.ts
'use server';

import { prisma } from '@/lib/prisma';

export async function getFeature(id: string) {
  return await prisma.feature.findUnique({ where: { id } });
}

export async function createFeature(data: CreateInput) {
  return await prisma.feature.create({ data });
}
```

### Type casting for JSON fields:
```typescript
// Prisma JsonValue fields need casting
const metadata = customer.metadata as Record<string, unknown> | null;
const phone = (metadata?.phone as string) || '';
```

---

## TypeScript Fixes Applied

| Issue | Fix |
|-------|-----|
| `AgentWithTeam` type | Define manually in `actions/agents.ts` |
| `z.record(z.any())` | Use `z.record(z.string(), z.any())` |
| `user.password` null | Handle OAuth users: `user.password \|\| ''` |
| `metadata` in JSX | Wrap with `String()` for ReactNode compatibility |
| `suggestReply` import | Renamed to `generateTicketReply` |
| `reasoningEffort` | Removed (not supported in AI SDK) |
| `enableServerActions` | Removed (not supported in NextAuth v5) |

---

## Completed Features

- ✅ **Pusher real-time** - Full integration with message updates and ticket notifications
- ✅ **Floating widget button** - `embed.js` script creates floating chat bubble
- ✅ **Customer rating** - Widget shows rating prompt after ticket resolution
- ✅ **Performance page** - Real metrics from database
- ✅ **404/500 error pages** - Custom error and not-found pages
- ✅ **Settings page** - Team name update, auto-assignment rules (add/delete)
- ✅ **Groq AI integration** - Using llama-3.1-8b-instant

---

## Widget Integration

Widget is embeddable via:

**Floating Button (Recommended):**
```html
<script src="https://your-domain.com/widget/embed.js" data-team-id="xxx"></script>
```

Options:
- `data-position`: 'left' | 'right' (default: 'right')
- `data-color`: Primary color hex (default: '#3b82f6')
- `data-title`: Widget title (default: 'Support Chat')
- `data-greeting`: Greeting message

**Iframe:**
```html
<iframe src="/widget/xxx" width="380" height="600"></iframe>
```

**Customer Rating:**
After a ticket is resolved, customers can rate their experience (1-5 stars). The rating appears:
automatically when the agent marks the ticket as resolved/closed.

See `/dashboard/widget-demo` for full integration docs.
