# Coding Conventions

This document defines the consistent patterns used throughout the codebase. Follow these when writing new code.

---

## 1. File Organization

```
actions/        → Server Actions (data mutations/queries)
components/     → React components (ui/, layout/, tickets/, customers/, dashboard/)
lib/            → Utilities, auth, prisma client, schemas
types/          → TypeScript type definitions
app/            → Next.js App Router pages
prisma/         → Database schema and migrations
```

---

## 2. Server Actions (`actions/*.ts`)

```typescript
'use server';  // ← Always at top

import { prisma } from '@/lib/prisma';
import type { TicketWithRelations, CreateTicketInput } from '@/types';

/**
 * JSDoc comment describing the function
 */
export async function getTickets(filters: TicketFilters = {}): Promise<TicketWithRelations[]> {
  const where: any = {};

  // Build filters...

  const tickets = await prisma.ticket.findMany({
    where,
    include: { /* relations */ },
    orderBy: { createdAt: 'desc' },
  });

  return tickets as TicketWithRelations[];  // ← Type cast Prisma results
}
```

**Rules:**
- `'use server'` directive at top
- Named exports only (no default exports)
- Async functions with explicit return types
- Type cast Prisma returns (`as Type`)
- JSDoc comments for documentation

---

## 3. Import Order

```typescript
// 1. React/Next.js
import { useState } from 'react';
import { redirect, notFound } from 'next/navigation';
import type { Metadata } from 'next';

// 2. Third-party
import { z } from 'zod';
import { Send, Lightbulb } from 'lucide-react';

// 3. Internal - lib
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// 4. Internal - actions
import { getTickets, createTicket } from '@/actions';

// 5. Internal - components
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
```

---

## 4. Type Definitions (`types/index.ts`)

```typescript
// Re-export Prisma types first
import type { Ticket, Customer } from '@prisma/client';
export type { Ticket, Customer };

// Extended types with relations: EntityWithRelations
export type TicketWithRelations = Ticket & {
  customer: Customer;
  agent?: Agent | null;
  messages: Message[];
  _count?: { messages: number };
};

// Input types: CreateEntityInput, UpdateEntityInput
export interface CreateTicketInput {
  customerId: string;
  subject: string;
  description?: string;
}

// Filter types: EntityFilters
export interface TicketFilters {
  status?: TicketStatus[];
  search?: string;
}
```

**Naming conventions:**
| Pattern | Example |
|---------|---------|
| Extended with relations | `TicketWithRelations` |
| Create input | `CreateTicketInput` |
| Update input | `UpdateTicketInput` |
| Filter params | `TicketFilters` |

---

## 5. Zod Schemas (`lib/schemas.ts`)

```typescript
// Enum naming: EntityEnum
export const TicketStatusEnum = z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED']);

// Schema naming: createEntitySchema, updateEntitySchema
export const createTicketSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  subject: z.string().min(1, 'Subject is required').max(200),
});

// Export inferred types
export type CreateTicketInput = z.infer<typeof createTicketSchema>;
```

---

## 6. Page Components (Server Components by default)

```typescript
// app/dashboard/tickets/[id]/page.tsx
import { auth } from '@/lib/auth';
import { Header } from '@/components/layout/Header';
import { getTicketById } from '@/actions';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Next.js 16: params is a Promise
interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;  // ← Must await
  const ticket = await getTicketById(id);

  return { title: ticket ? `${ticket.subject} - SupportHub` : 'Ticket' };
}

export default async function TicketDetailPage({ params }: PageProps) {
  const session = await auth();  // ← Get session first
  const { id } = await params;   // ← Await params

  const ticket = await getTicketById(id);

  if (!ticket) {
    notFound();  // ← Handle missing data
  }

  return (
    <>
      <Header title="Title" subtitle="Description" />
      {/* content */}
    </>
  );
}
```

---

## 7. Client Components (only when needed)

```typescript
'use client';  // ← Only for interactivity/browser APIs

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MessageInputProps {
  ticketId: string;
  onReplyGenerated?: (reply: string) => void;  // ← Optional callbacks
}

export function MessageInput({ ticketId, onReplyGenerated }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Handler naming: handle<Action>
  const handleSend = async () => {
    setIsSending(true);
    try {
      // fetch or server action call
    } catch (error) {
      console.error('Failed to send:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    // JSX
  );
}
```

**Use `'use client'` only for:**
- Event handlers (onClick, onChange, etc.)
- useState, useEffect, useRef hooks
- Browser APIs (localStorage, window, etc.)
- Third-party libs requiring React context

---

## 8. Component Props Interface

```typescript
// Always define props interface above component
interface TicketTableProps {
  tickets: TicketWithRelations[];
  className?: string;  // ← Allow className override
}

// Destructure props directly in function signature
export function TicketTable({ tickets, className }: TicketTableProps) {
  if (tickets.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className={cn("base-classes", className)}>
      {/* content */}
    </div>
  );
}
```

---

## 9. Styling Conventions (Tailwind)

```typescript
import { cn } from '@/lib/utils';

// Use cn() for conditional/merged classes
<div className={cn(
  "bg-white rounded-xl shadow-sm border",
  isActive && "ring-2 ring-blue-500",
  className
)} />
```

**Common class patterns:**

| Element | Classes |
|---------|---------|
| Card | `bg-white rounded-xl shadow-sm border p-6` |
| Flex center | `flex items-center justify-center` |
| Flex row | `flex items-center gap-4` |
| Grid 12-col | `grid grid-cols-12 gap-4` |
| Input | `border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500` |
| Button hover | `hover:bg-gray-100 transition-colors` |
| Text muted | `text-gray-500 text-sm` |
| Text heading | `text-xl font-bold text-gray-800` |

---

## 10. Color Mappings (status/priority/tags)

```typescript
// Use Record<string, string> with default
const statusColors: Record<string, string> = {
  OPEN: 'bg-blue-500',
  IN_PROGRESS: 'bg-purple-500',
  RESOLVED: 'bg-green-500',
  CLOSED: 'bg-gray-500',
};

// Badge pattern (background + text)
const priorityColors: Record<string, string> = {
  URGENT: 'bg-red-100 text-red-700',
  HIGH: 'bg-orange-100 text-orange-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW: 'bg-gray-100 text-gray-700',
};

// Helper function with fallback
function getStatusColor(status: string): string {
  return statusColors[status] || 'bg-gray-500';
}
```

---

## 11. Authentication Pattern

```typescript
// In Server Components
const session = await auth();

// Access custom fields from session
const userId = session?.user?.id;
const teamId = session?.user?.teamId;
const agentId = session?.user?.agentId;
const role = session?.user?.role;

// Redirect if not authenticated
if (!session) {
  redirect('/login');
}
```

---

## 12. Error Handling

```typescript
// Use notFound() for missing resources
if (!ticket) {
  notFound();
}

// Use try/catch with console.error for async operations
try {
  await someAsyncOperation();
} catch (error) {
  console.error('Failed to <action>:', error);
}

// Return null for optional data
if (!optionalData) {
  return null;
}
```

---

## 13. Action Index Pattern

```typescript
// actions/index.ts - Re-export all for cleaner imports
export * from './tickets';
export * from './customers';
export * from './messages';
export * from './ai';
export * from './agents';

// Usage elsewhere (single import line):
import { getTickets, createTicket, getCustomers } from '@/actions';
```

---

## 14. Helper Functions

```typescript
// Define at top of file, before component
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  return `${Math.floor(diff / (1000 * 60))}m`;
}

// For reusable helpers, put in lib/utils.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 15. Prisma Query Patterns

```typescript
// Include relations consistently
const ticket = await prisma.ticket.findUnique({
  where: { id },
  include: {
    customer: true,
    agent: {
      include: { user: true },  // Nested include
    },
    messages: {
      orderBy: { createdAt: 'asc' },
    },
    _count: {
      select: { messages: true },
    },
  },
});

// Default ordering: newest first
orderBy: { createdAt: 'desc' }

// Type cast result to extended type
return ticket as TicketWithRelations;

// For JSON fields, cast appropriately
const metadata = customer.metadata as Record<string, unknown> | null;
```

---

## 16. Async State Management (Client Components)

```typescript
const [isLoading, setIsLoading] = useState(false);

const handleAction = async () => {
  setIsLoading(true);
  try {
    const result = await someAsyncAction();
    // Handle success
  } catch (error) {
    console.error('Action failed:', error);
  } finally {
    setIsLoading(false);
  }
};
```

---

## Summary Checklist

When writing new code, verify:

- [ ] `'use server'` at top of Server Actions
- [ ] Imports ordered: React → Third-party → Internal
- [ ] Props interface defined above component
- [ ] Async functions have explicit return types
- [ ] Prisma results type-cast to extended types
- [ ] `params` and `searchParams` awaited (Next.js 16)
- [ ] `await auth()` at start of protected pages
- [ ] `notFound()` for missing resources
- [ ] `cn()` for conditional Tailwind classes
- [ ] Loading states with `is<Action>` pattern
- [ ] Error handling with `console.error()`
