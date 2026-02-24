import { z } from 'zod';

// Enums from Prisma (matching for validation)
export const TicketStatusEnum = z.enum(['OPEN', 'IN_PROGRESS', 'WAITING', 'RESOLVED', 'CLOSED']);
export const TicketPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);
export const SenderTypeEnum = z.enum(['CUSTOMER', 'AGENT']);
export const AgentRoleEnum = z.enum(['ADMIN', 'AGENT']);

// Ticket schemas
export const createTicketSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long'),
  description: z.string().max(5000, 'Description too long').optional(),
  priority: TicketPriorityEnum.optional(),
  category: z.string().max(50, 'Category too long').optional(),
});

export const updateTicketSchema = z.object({
  status: TicketStatusEnum.optional(),
  priority: TicketPriorityEnum.optional(),
  assignedAgentId: z.string().optional(),
  category: z.string().max(50).optional(),
});

export const ticketFilterSchema = z.object({
  status: z.array(TicketStatusEnum).optional(),
  priority: z.array(TicketPriorityEnum).optional(),
  assignee: z.string().optional(),
  search: z.string().max(100).optional(),
});

// Message schemas
export const createMessageSchema = z.object({
  ticketId: z.string().min(1, 'Ticket ID is required'),
  senderType: SenderTypeEnum,
  senderId: z.string().min(1, 'Sender ID is required'),
  body: z.string().min(1, 'Message is required').max(10000, 'Message too long'),
});

// Customer schemas
export const createCustomerSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().max(100, 'Name too long').optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const updateCustomerSchema = z.object({
  name: z.string().max(100).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const customerFilterSchema = z.object({
  search: z.string().max(100).optional(),
});

// Agent schemas
export const createAgentSchema = z.object({
  teamId: z.string().min(1, 'Team ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  role: AgentRoleEnum.optional(),
});

export const updateAgentSchema = z.object({
  role: AgentRoleEnum.optional(),
});

// Team schemas
export const createTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required').max(100, 'Team name too long'),
  settings: z.record(z.string(), z.any()).optional(),
});

// Type exports
export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
export type TicketFilterInput = z.infer<typeof ticketFilterSchema>;
export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type CreateAgentInput = z.infer<typeof createAgentSchema>;
export type UpdateAgentInput = z.infer<typeof updateAgentSchema>;
export type CreateTeamInput = z.infer<typeof createTeamSchema>;
