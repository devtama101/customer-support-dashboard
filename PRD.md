# Project 2: Customer Support Dashboard (AI)

> AI-powered support ticket system with chatbot, auto-summarization, and sentiment analysis.

**Difficulty:** ⭐⭐⭐ | **Timeline:** 2-3 weeks | **AI:** Medium

---

## Tech Stack

| Layer | Tech | Why |
|-------|------|-----|
| Frontend | Next.js App Router + Tailwind | SSR for fast dashboard loads |
| Real-time | Pusher / Ably (or SSE) | Live ticket updates + chat |
| AI | Vercel AI SDK + OpenAI | Summarize, sentiment, suggest replies |
| Charts | Recharts | Lightweight, React-native |
| Rich Text | Tiptap (minimal) | Agent reply editor |
| DB | PostgreSQL + Prisma | Relational data fits perfectly |
| Deploy | Vercel + Supabase | Keep it cheap |

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

**AI Features**
- Auto-summarize long ticket threads (1-click)
- Sentiment analysis badge on each ticket (positive/neutral/negative)
- AI-suggested reply drafts (agent can edit before sending)
- Auto-categorization of incoming tickets
- Smart priority suggestion based on content + sentiment

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
Customer Chat Widget ──→ Webhook/API ──→ Create Ticket
                                              │
                                    ┌─────────▼──────────┐
                                    │  AI Pipeline (async) │
                                    │  1. Categorize       │
                                    │  2. Sentiment score   │
                                    │  3. Priority suggest  │
                                    │  4. Auto-summarize    │
                                    └─────────┬──────────┘
                                              │
Agent Dashboard ◄── Real-time update ─────────┘
  │
  ├─ View ticket + AI summary
  ├─ Click "AI Suggest Reply" → editable draft
  └─ Send reply → customer gets notified
```

---

## Database

```
teams (id, name, settings)
agents (id, team_id, user_id, role)
customers (id, email, name, metadata)
tickets (
  id, team_id, customer_id, assigned_agent_id,
  subject, status, priority, category,
  sentiment_score, ai_summary,
  created_at, resolved_at
)
messages (id, ticket_id, sender_type, sender_id, body, created_at)
ai_logs (id, ticket_id, action_type, input, output, tokens_used)
```

---

## Implementation Phases

### Phase 1: Core Ticket System (Week 1)
- [ ] Auth + team setup
- [ ] Ticket CRUD + message thread
- [ ] Ticket list with filters & search
- [ ] Status workflow
- [ ] Agent assignment
- **Deliverable:** Working ticket system, no AI yet

### Phase 2: AI Layer (Week 1-2)
- [ ] AI summarization (per ticket thread)
- [ ] Sentiment analysis on new messages
- [ ] Auto-categorization
- [ ] AI reply suggestions
- [ ] AI processing via background job (BullMQ or server action)
- **Deliverable:** Every ticket gets AI enrichment automatically

### Phase 3: Dashboard & Widget (Week 2-3)
- [ ] Analytics dashboard (Recharts)
- [ ] Agent performance view
- [ ] Simple customer chat widget (embeddable)
- [ ] Email notifications
- [ ] Polish + dark mode + responsive
- [ ] Deploy + record demo
- **Deliverable:** Complete, portfolio-ready

---

## Upwork Positioning

**Pitch:**
> "I build AI-enhanced customer support tools — auto-summarization,
> sentiment analysis, smart routing, and suggested replies.
> From embeddable chat widgets to full admin dashboards."

**Target clients:** E-commerce, SaaS startups, support agencies
**Rate range:** $30-70/hr
