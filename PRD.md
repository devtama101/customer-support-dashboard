# Project 2: Customer Support Dashboard (AI)

> AI-powered support ticket system with chatbot, auto-summarization, and sentiment analysis.

**Difficulty:** ⭐⭐⭐ | **Timeline:** 5-6 days | **AI:** Medium (Hybrid: immediate + on-demand)

---

## Tech Stack

| Layer | Tech | Why |
|-------|------|-----|
| Framework | Next.js 16 + App Router | Server Components, Server Actions |
| UI | shadcn/ui + Tailwind CSS v4 | Accessible components, rapid dev |
| Real-time | Pusher WebSocket | Bidirectional live updates |
| AI | Vercel AI SDK + OpenAI | Hybrid: immediate + on-demand |
| Charts | Recharts | Simple, React-native charts |
| Rich Text | Tiptap | Agent reply editor |
| Forms | React Hook Form + Zod | Type-safe validation |
| Auth | NextAuth v5 (beta) | Credentials + Google OAuth |
| DB | PostgreSQL + Prisma | Type-safe ORM |
| Deploy | Vercel + Supabase | Free tier friendly |

---

## Installation Commands

### Core Dependencies
```bash
pnpm add ai@6.0.97 @ai-sdk/react@3.0.99 @ai-sdk/openai@3.0.30 recharts@3.7.0 @tiptap/react@3.20.0 @tiptap/pm@3.20.0 @tiptap/starter-kit@3.20.0 prisma@7.4.1 @prisma/client@7.4.1 pusher-js@8.4.0 next-auth@beta lucide-react@0.575.0 date-fns@4.1.0 react-hook-form@7.71.2 @hookform/resolvers@5.2.2 zod@4.3.6 clsx@2.1.1 tailwind-merge@3.5.0
```

### Dev Dependencies
```bash
pnpm add -D @types/node@latest @types/react@latest @types/react-dom@latest prisma@7.4.1
```

### Initialize Tools
```bash
# Prisma (Database ORM)
npx prisma init

# shadcn/ui (UI Components)
npx shadcn@latest init
```

### Package List Reference

| Package | Version | Purpose |
|---------|---------|---------|
| `ai` | 6.0.97 | Vercel AI SDK core |
| `@ai-sdk/react` | 3.0.99 | React hooks for AI |
| `@ai-sdk/openai` | 3.0.30 | OpenAI provider |
| `recharts` | 3.7.0 | Charts & graphs |
| `@tiptap/react` | 3.20.0 | Rich text editor |
| `@tiptap/pm` | 3.20.0 | Tiptap ProseMirror |
| `@tiptap/starter-kit` | 3.20.0 | Tiptap extensions bundle |
| `prisma` | 7.4.1 | Database ORM CLI |
| `@prisma/client` | 7.4.1 | Prisma client |
| `pusher-js` | 8.4.0 | Real-time updates |
| `next-auth` | beta (v5) | Auth v5 (App Router) |
| `lucide-react` | 0.575.0 | Icon library |
| `date-fns` | 4.1.0 | Date utilities |
| `react-hook-form` | 7.71.2 | Form management |
| `@hookform/resolvers` | 5.2.2 | Form validation adapters |
| `zod` | 4.3.6 | Schema validation |
| `clsx` | 2.1.1 | Class name utility |
| `tailwind-merge` | 3.5.0 | Tailwind class merger |

---

## Core Features

**Ticket Management**
- Ticket list with filters (status, priority, assignee, sentiment)
- Ticket detail view with conversation thread
- Assignment, tagging, priority management
- Status workflow: Open → In Progress → Waiting → Resolved → Closed

**AI Features (Hybrid Model)**
- **Immediate** (on new message):
  - Sentiment analysis (-1 to +1 score)
  - Auto-categorization
- **On-Demand** (agent clicks button):
  - Auto-summarize long ticket threads
  - AI-suggested reply drafts (editable)
  - Smart priority suggestion
- All AI actions logged for token tracking

**Dashboard & Analytics**
- Overview: open tickets, avg response time, resolution rate
- Sentiment breakdown chart
- Agent performance metrics
- Volume trends (daily/weekly)

**Customer-Facing**
- Embeddable chat widget (simple iframe/script)
- Chat creates ticket automatically
- Customer gets email updates on ticket status

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Dashboard  │  │ Ticket Views │  │   Customer Widget    │  │
│  │  (Server Cmp)│  │(Server Cmp)  │  │   /widget route      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                  │                     │               │
│         └──────────────────┴─────────────────────┘               │
│                            │                                     │
│                    ┌───────▼────────┐                            │
│                    │  Server Actions│  (No API layer)            │
│                    │  - tickets.ts  │                            │
│                    │  - customers.ts│                            │
│                    │  - messages.ts │                            │
│                    │  - ai.ts       │                            │
│                    └───────┬────────┘                            │
└────────────────────────────┼─────────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                         Data Layer                               │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────┐   │
│  │   Prisma ORM   │  │   PostgreSQL   │  │   OpenAI API     │   │
│  │                 │  │                 │  │   (AI features)  │   │
│  └────────────────┘  └────────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

                    AI Processing (Hybrid Model)
                    ────────────────────────────
                    On New Message:
                    ✦ Sentiment Analysis (immediate)
                    ✦ Category Detection (immediate)

                    On-Demand (Agent Clicks):
                    ✦ Generate Summary
                    ✦ Suggest Reply
                    ✦ Suggest Priority

                    Real-time: Pusher WebSocket
```

---

## Database

```
teams (id, name, settings)
agents (id, team_id, user_id, role)
users (id, email, name, image, password)
customers (id, email, name, metadata)
tickets (
  id, team_id, customer_id, assigned_agent_id,
  subject, description, status, priority, category,
  sentiment_score, ai_summary,
  created_at, updated_at, resolved_at
)
messages (id, ticket_id, sender_type, sender_id, body, created_at)
ai_logs (id, ticket_id, action_type, input, output, tokens_used, created_at)
```

---

## Implementation Phases

**Overall Progress: █████████████ 95%** (Foundation → Dashboard → Tickets → Customers → Widget complete)

### Development Approach
**Pattern:** `Database (Prisma) → Server Actions → Types → Components → Integration`

**Decisions:**
| Aspect | Choice |
|--------|--------|
| Authentication | Credentials + Google OAuth (Both) |
| AI Processing | Hybrid (immediate sentiment/category, on-demand summary) |
| UI Components | shadcn/ui base |
| Real-time | Pusher WebSocket |
| Multi-tenancy | Single team (MVP - simplify for initial launch) |
| Customer Widget | Same app at `/widget` route (iframe-embeddable) |
| Build Order | Dashboard → Tickets → Ticket Detail → Customers → Widget |
| Dark Mode | Removed (user feedback: looked broken) |

---

### Phase 1: Foundation (Day 1) ✅ **Complete**

**Directory Structure**
```
app/
├── dashboard/              # Protected routes
│   ├── layout.tsx         # Dashboard layout with sidebar
│   ├── page.tsx           # Dashboard overview
│   ├── tickets/
│   │   ├── page.tsx       # Ticket list
│   │   ├── new/page.tsx   # New ticket form
│   │   └── [id]/page.tsx  # Ticket detail
│   ├── customers/
│   │   ├── page.tsx       # Customer list
│   │   ├── new/page.tsx   # New customer form
│   │   └── [id]/
│   │       ├── page.tsx   # Customer detail
│   │       └── edit/page.tsx  # Edit customer
│   ├── performance/
│   │   └── page.tsx       # Agent analytics
│   ├── settings/
│   │   └── page.tsx       # Settings page
│   └── widget-demo/
│       └── page.tsx       # Widget integration docs
├── widget/
│   ├── [teamId]/page.tsx  # Customer-facing widget
│   └── embed.js           # Widget embed script
├── api/
│   ├── auth/[...nextauth]/route.ts  # NextAuth handler
│   ├── tickets/           # Ticket API endpoints
│   ├── customers/         # Customer API endpoints
│   ├── agents/            # Agent API endpoints
│   └── widget/            # Widget API endpoints
├── login/
│   └── page.tsx           # Login page
├── layout.tsx             # Root layout
└── globals.css
components/
├── ui/                    # shadcn base components
├── layout/                # Sidebar, Header, DashboardLayout
├── dashboard/             # Dashboard-specific (StatsCard, Charts, etc.)
├── tickets/               # Ticket components (Table, Filters, Detail, etc.)
└── customers/             # Customer components (Table, QuickActions, etc.)
lib/
├── prisma.ts              # Prisma client singleton
├── auth.ts                # NextAuth config
├── utils.ts               # cn(), date formatters
├── ai.ts                  # AI client setup (OpenAI)
└── schemas.ts             # Zod validation schemas
actions/                   # Server Actions (no API layer)
├── tickets.ts
├── customers.ts
├── messages.ts
├── ai.ts
├── agents.ts
└── index.ts               # Re-exports
types/
├── index.ts               # Centralized types
└── next-auth.d.ts         # Session type extensions
prisma/
├── schema.prisma          # Database schema
├── seed.ts                # Seed script
└── migrations/            # Database migrations
```

**Tasks:**
- [x] Run `npx shadcn@latest init` for base UI components
- [x] Add shadcn components: Button, Input, Card, Badge, Select, Avatar, Textarea, Label
- [x] Create `lib/prisma.ts` with Prisma client singleton
- [x] Create `lib/utils.ts` with `cn()` helper
- [x] Create `lib/ai.ts` with AI client setup (OpenAI integration)
- [x] Create `lib/schemas.ts` with Zod schemas
- [x] Create `types/index.ts` with extended Prisma types
- [x] Dependencies installed (package.json complete)
- [x] Prisma schema defined with all models (Team, Agent, User, Customer, Ticket, Message, AiLog)
- [x] Migration created and applied
- [x] Generate Prisma client: `npx prisma generate`

---

### Phase 2: Authentication (Day 1-2) ✅ **Complete**

**Tasks:**
- [x] Set up NextAuth v5 with Credentials provider (bcrypt)
- [x] Add Google OAuth provider
- [x] Create auth middleware (proxy.ts) for route protection
- [x] Add session data: `userId`, `teamId`, `role`
- [x] Seed initial admin user for testing
- [x] Protected `dashboard` route with layout
- [x] Login page with Credentials + Google OAuth

**Auth Flow:**
```
Unauthenticated → Login Page (/login)
     │
     ├─ Sign in with Google (OAuth)
     └─ Sign in with Email/Password (Credentials)
          │
          ▼
     Authenticated → Dashboard (/dashboard)
```

**Demo Credentials:**
- Email: `admin@example.com`
- Password: `admin123`

---

### Phase 3: Server Actions - Core (Day 2) ✅ **Complete**

**`actions/tickets.ts`**
```typescript
// Queries
getTickets(filters: TicketFilters) → Ticket[]
getTicketById(id: string) → Ticket | null
getVolumeData(teamId?: string) → VolumeData[]
getSentimentData(teamId?: string) → SentimentData[]
getDashboardStats(teamId?: string) → DashboardStats

// Mutations
createTicket(data: CreateTicketInput) → Ticket
updateTicket(id: string, data: UpdateTicketInput) → Ticket
updateTicketStatus(id: string, status: TicketStatus) → Ticket
assignTicket(id: string, agentId: string | null) → Ticket
deleteTicket(id: string) → void
```

**`actions/customers.ts`**
```typescript
getCustomers(filters: CustomerFilters) → Customer[]
getCustomerById(id: string) → Customer | null
getCustomerByEmail(email: string) → Customer | null
getOrCreateCustomer(email: string, name?: string) → Customer
createCustomer(data: CreateCustomerInput) → Customer
updateCustomer(id: string, data: UpdateCustomerInput) → Customer
deleteCustomer(id: string) → void
```

**`actions/messages.ts`**
```typescript
getTicketMessages(ticketId: string) → Message[]
addMessage(data: CreateMessageInput) → Message
// Triggers AI: sentiment analysis, categorization
```

**`actions/ai.ts`**
```typescript
generateSummary(ticketId: string) → Promise<string>
generateTicketReply(ticketId: string) → Promise<string>
suggestTicketPriority(ticketId: string) → Promise<TicketPriority>
```

**`actions/agents.ts`**
```typescript
getAgents() → AgentWithTeam[]
getTeam(teamId?: string | null) → Team | null
```

---

### Phase 4: Layout Components (Day 2) ✅ **Complete**

**Tasks:**
- [x] `components/layout/Sidebar.tsx` - Navigation with active states
- [x] `components/layout/Header.tsx` - Page header with title/actions
- [x] `components/layout/DashboardLayout.tsx` - Layout wrapper (Client)
- [x] `app/dashboard/layout.tsx` - Dashboard layout wrapper (Server)
- [x] Sidebar active state logic (Dashboard only active on exact match)

**Sidebar Items:**
- [x] Dashboard (`/dashboard`)
- [x] Tickets (`/dashboard/tickets`)
- [x] Customers (`/dashboard/customers`)
- [x] Performance (`/dashboard/performance`)
- [x] Settings (`/dashboard/settings`)
- [x] Widget Demo (`/dashboard/widget-demo`)

---

### Phase 5: Dashboard Page (Day 2-3) ✅ **Complete**

**Tasks:**
- [x] `app/dashboard/page.tsx` - Dashboard overview
- [x] `components/dashboard/StatsCard.tsx` - Metric display (open tickets, response time, resolution rate)
- [x] `components/dashboard/SentimentChart.tsx` - Pie chart (Recharts)
- [x] `components/dashboard/VolumeChart.tsx`` - Line chart (Recharts)
- [x] `components/dashboard/RecentTickets.tsx` - Quick ticket list

**Server Actions Used:** `getDashboardStats()`, `getTickets()`, `getVolumeData()`, `getSentimentData()`

---

### Phase 6: Tickets List Page (Day 3) ✅ **Complete**

**Tasks:**
- [x] `app/dashboard/tickets/page.tsx` - Ticket list with filters
- [x] `components/tickets/TicketTable.tsx` - Data table with hover states
- [x] `components/tickets/TicketRow.tsx` - Single ticket row
- [x] `components/tickets/TicketFilters.tsx` - Filter bar (status, priority, search)
- [x] `components/tickets/StatusBadge.tsx` - Colored status badges
- [x] `components/tickets/PriorityBadge.tsx` - Colored priority badges

**Features:**
- [x] Filter by status, priority, assigned agent
- [x] Search by subject/customer
- [x] Sort by created date, priority
- [x] Click row to navigate to detail

---

### Phase 7: Ticket Detail Page (Day 3-4) ✅ **Complete**

**Tasks:**
- [x] `app/dashboard/tickets/[id]/page.tsx` - Ticket detail view
- [x] `components/tickets/TicketDetail.tsx` - Main detail container
- [x] `components/tickets/MessageList.tsx` - Conversation thread
- [x] `components/tickets/MessageInput.tsx` - Message input
- [x] `components/tickets/AISummaryCard.tsx` - AI summary display
- [x] Status/Assignee/Priority dropdowns
- [x] Quick actions (Close, Reopen)

**Server Actions Used:**
- [x] `getTicketById()`
- [x] `getTicketMessages()`
- [x] `addMessage()`
- [x] `updateTicketStatus()`
- [x] `assignTicket()`

---

### Phase 8: AI Actions (Day 4) ✅ **Complete**

**`lib/ai.ts`**
```typescript
// Immediate (runs on new message)
analyzeSentiment(text: string) → Promise<number>  // -1 to 1
categorizeTicket(content: string) → Promise<string>

// On-Demand (agent clicks button)
generateSummary(ticketId: string) → Promise<string>
suggestReply(ticketId: string) → Promise<string>
suggestPriority(ticketId: string) → Promise<TicketPriority>
```

**Tasks:**
- [x] Set up Vercel AI SDK with OpenAI (gpt-4o-mini)
- [x] Implement sentiment analysis
- [x] Implement categorization
- [x] Implement summary generation
- [x] Implement reply suggestions
- [x] Log all AI calls to `AiLog` table (token tracking)
- [x] API endpoint for suggest-reply
- [x] Trigger sentiment/category on new message

**AI Pipeline:**
```
New Message Created
    ↓
Sentiment Analysis → ticket.sentimentScore (immediate)
Category Detection → ticket.category (immediate)
    ↓
Agent clicks "Summarize" → ticket.aiSummary (on-demand)
Agent clicks "Suggest Reply" → returns draft (on-demand)
    ↓
All logged to AiLog (token tracking)
```

---

### Phase 9: Customers Pages (Day 4-5) ✅ **Complete**

**Tasks:**
- [x] `app/dashboard/customers/page.tsx` - Customer list
- [x] `components/customers/CustomerTable.tsx` - Customer list view
- [x] `app/dashboard/customers/[id]/page.tsx` - Customer detail
- [x] `components/customers/CustomerDetail.tsx` - Profile + ticket history
- [x] `components/customers/QuickActions.tsx` - Quick action buttons (Client component)
- [x] `app/dashboard/customers/new/page.tsx` - New customer form
- [x] `app/dashboard/customers/[id]/edit/page.tsx` - Edit customer form
- [x] Customer API endpoints (GET, POST, PATCH, DELETE)

**Server Actions Used:**
- [x] `getCustomers()`
- [x] `getCustomerById()`
- [x] `createCustomer()`
- [x] `updateCustomer()`
- [x] `deleteCustomer()`

---

### Phase 10: Customer Widget (Day 5) ✅ **Complete**

**Tasks:**
- [x] `app/widget/[teamId]/page.tsx` - Embeddable chat widget UI
- [x] `app/widget/embed.js` - Widget embed script endpoint
- [x] Widget styling (floating bubble not yet implemented, iframe works)
- [x] Auto-create ticket on first message
- [x] Identify customer by email
- [x] Widget API endpoint for ticket creation
- [x] Widget demo page (`/dashboard/widget-demo`) with integration docs

**Widget Features:**
- [x] Chat window UI
- [x] Email capture for new customers
- [x] Message history
- [x] Create ticket automatically
- [ ] Floating bubble button (planned)
- [ ] Typing indicators (planned)
- [ ] Pusher real-time updates (planned)

**Embed Code (generated):**
```html
<!-- JavaScript Widget -->
<script src="https://your-domain.com/widget/embed.js" data-team-id="xxx"></script>

<!-- Or iframe -->
<iframe src="https://your-domain.com/widget/xxx" width="380" height="600" frameborder="0"></iframe>
```

---

### Phase 11: Polish & Deploy (Day 5-6) ⏳ **In Progress**

**Tasks:**
- [x] Light mode only (dark mode removed per user feedback)
- [x] Responsive mobile design
- [ ] Error pages (404, 500)
- [x] Form validation feedback
- [x] Environment variables setup
- [ ] Vercel deployment

**Environment Variables:**
```env
DATABASE_URL=postgresql://...
AUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
OPENAI_API_KEY=...
PUSHER_APP_ID=...
PUSHER_KEY=...
PUSHER_SECRET=...
PUSHER_CLUSTER=...
NEXTAUTH_URL=...
```

---

### Verification Checklist

After implementation, verify:

- [x] Can create a ticket via widget
- [x] Ticket appears in dashboard with sentiment/category
- [x] Can view ticket detail and send messages
- [x] AI summary generates on-demand
- [x] AI reply suggestions work
- [ ] Real-time updates work (Pusher) - partially implemented
- [x] Can filter tickets by status/priority
- [x] Can assign tickets to agents
- [x] Customer view shows ticket history
- [x] Auth works with both Google and email/password
- [x] Mobile responsive
- [x] Can create/edit customers
- [x] Can update ticket status and priority
- [x] Widget demo page with integration docs

---

### Directory Summary (Final)

```
customer-support-dashboard/
├── app/
│   ├── dashboard/             # Protected routes
│   │   ├── layout.tsx         # Dashboard layout
│   │   ├── page.tsx           # Dashboard overview
│   │   ├── tickets/
│   │   │   ├── page.tsx       # Ticket list
│   │   │   ├── new/page.tsx   # New ticket
│   │   │   └── [id]/page.tsx  # Ticket detail
│   │   ├── customers/
│   │   │   ├── page.tsx       # Customer list
│   │   │   ├── new/page.tsx   # New customer
│   │   │   └── [id]/
│   │   │       ├── page.tsx   # Customer detail
│   │   │       └── edit/page.tsx  # Edit customer
│   │   ├── performance/
│   │   │   └── page.tsx       # Agent analytics
│   │   ├── settings/
│   │   │   └── page.tsx       # Settings page
│   │   └── widget-demo/
│   │       └── page.tsx       # Widget integration docs
│   ├── widget/
│   │   ├── [teamId]/page.tsx  # Customer widget
│   │   └── embed.js           # Embed script
│   ├── login/
│   │   └── page.tsx           # Login page
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── tickets/           # Ticket APIs
│   │   ├── customers/         # Customer APIs
│   │   ├── agents/            # Agent APIs
│   │   └── widget/            # Widget APIs
│   ├── layout.tsx             # Root layout
│   ├── globals.css            # Global styles
│   └── favicon.ico
├── components/
│   ├── ui/                    # shadcn components
│   ├── layout/                # Sidebar, Header, DashboardLayout
│   ├── dashboard/             # Dashboard components
│   ├── tickets/               # Ticket components
│   └── customers/             # Customer components
├── lib/
│   ├── prisma.ts              # DB client
│   ├── auth.ts                # NextAuth config
│   ├── utils.ts               # Utilities
│   ├── ai.ts                  # AI client
│   └── schemas.ts             # Zod schemas
├── actions/                   # Server Actions
│   ├── tickets.ts
│   ├── customers.ts
│   ├── messages.ts
│   ├── ai.ts
│   ├── agents.ts
│   └── index.ts               # Re-exports
├── types/
│   ├── index.ts               # Type definitions
│   └── next-auth.d.ts         # Session types
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Seed script
│   └── migrations/            # Database migrations
├── public/
│   └── widget/
│       └── embed.js           # Widget embed script
├── proxy.ts                   # Auth middleware
├── next.config.ts             # Next.js config
├── tailwind.config.ts         # Tailwind config
├── tsconfig.json              # TypeScript config
├── package.json               # Dependencies
└── pnpm-lock.yaml             # Lock file
```

---

## Known Issues / TODO

1. **Pusher Real-time**: Partially implemented, needs full integration for live message updates
2. **Floating Widget Button**: Not yet implemented, currently using iframe
3. **Performance Page**: Placeholder page, needs charts and metrics
4. **Settings Page**: Placeholder page, needs form fields
5. **404/500 Error Pages**: Not implemented
6. **Dark Mode**: Removed per user feedback ("looked broken")

---

## Upwork Positioning

**Pitch:**
> "I build AI-enhanced customer support tools — auto-summarization,
> sentiment analysis, smart routing, and suggested replies.
> From embeddable chat widgets to full admin dashboards."

**Target clients:** E-commerce, SaaS startups, support agencies
**Rate range:** $30-70/hr
