import type { Team, Agent, Customer, Ticket, Message, AiLog, AgentRole, TicketStatus, TicketPriority, SenderType, AiActionType } from '@prisma/client';

// Re-export Prisma types
export type { Team, Agent, Customer, Ticket, Message, AiLog };
export type { AgentRole, TicketStatus, TicketPriority, SenderType, AiActionType };

// Extended types with relations
export type TicketWithRelations = Ticket & {
  customer: Customer;
  agent?: (Agent & { user?: { id: string; name?: string | null; email?: string | null } }) | null;
  team: Team;
  messages: Message[];
  _count?: {
    messages: number;
  };
};

export type CustomerWithTickets = Customer & {
  _count?: {
    tickets: number;
  };
  tickets?: Ticket[];
};

export type AgentWithTeam = Agent & {
  team: Team;
};

// Input types for forms
export interface TicketFilters {
  status?: TicketStatus[];
  priority?: TicketPriority[];
  assignee?: string;
  search?: string;
  limit?: number;
}

export interface CustomerFilters {
  search?: string;
}

export interface CreateTicketInput {
  customerId: string;
  subject: string;
  description?: string;
  priority?: TicketPriority;
  category?: string;
}

export interface UpdateTicketInput {
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedAgentId?: string | null;
  category?: string;
}

export interface CreateMessageInput {
  ticketId: string;
  senderType: SenderType;
  senderId: string;
  body: string;
}

export interface CreateCustomerInput {
  email: string;
  name?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateCustomerInput {
  name?: string;
  metadata?: Record<string, unknown>;
}

// Dashboard stats types
export interface DashboardStats {
  openTickets: number;
  inProgressTickets: number;
  waitingTickets: number;
  resolvedTickets: number;
  avgResponseTime: number; // in minutes
  resolutionRate: number; // percentage
  totalTickets: number;
}

export interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
}

export interface VolumeDataPoint {
  date: string;
  count: number;
}

export interface AgentPerformanceStats {
  agentId: string;
  agentName: string;
  ticketsAssigned: number;
  ticketsResolved: number;
  avgResponseTime: number;
  resolutionRate: number;
}
