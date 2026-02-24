'use server';

import { prisma } from '@/lib/prisma';
import type { CustomerWithTickets, CreateCustomerInput, UpdateCustomerInput } from '@/types';
import type { Prisma } from '@prisma/client';

/**
 * Get all customers with optional filters
 */
export async function getCustomers(filters: { search?: string } = {}): Promise<CustomerWithTickets[]> {
  const where: any = {};

  if (filters.search) {
    where.OR = [
      { email: { contains: filters.search, mode: 'insensitive' } },
      { name: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const customers = await prisma.customer.findMany({
    where,
    include: {
      _count: {
        select: { tickets: true },
      },
      tickets: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return customers as CustomerWithTickets[];
}

/**
 * Get a single customer by ID
 */
export async function getCustomerById(id: string): Promise<CustomerWithTickets | null> {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      tickets: {
        include: {
          agent: true,
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: { tickets: true },
      },
    },
  });

  return customer as CustomerWithTickets | null;
}

/**
 * Get customer by email
 */
export async function getCustomerByEmail(email: string) {
  return await prisma.customer.findUnique({
    where: { email: email.toLowerCase() },
  });
}

/**
 * Get all tickets for a customer
 */
export async function getCustomerTickets(customerId: string) {
  return await prisma.ticket.findMany({
    where: { customerId },
    include: {
      agent: true,
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Create a new customer
 */
export async function createCustomer(data: CreateCustomerInput): Promise<CustomerWithTickets> {
  const customer = await prisma.customer.create({
    data: {
      email: data.email.toLowerCase(),
      name: data.name,
      metadata: (data.metadata || {}) as Prisma.JsonObject,
    },
    include: {
      _count: {
        select: { tickets: true },
      },
      tickets: true,
    },
  });

  return customer as CustomerWithTickets;
}

/**
 * Update customer
 */
export async function updateCustomer(id: string, data: UpdateCustomerInput): Promise<CustomerWithTickets> {
  const customer = await prisma.customer.update({
    where: { id },
    data: {
      ...data,
      metadata: data.metadata as Prisma.JsonObject | undefined,
    },
    include: {
      _count: {
        select: { tickets: true },
      },
      tickets: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });

  return customer as CustomerWithTickets;
}

/**
 * Delete customer
 */
export async function deleteCustomer(id: string): Promise<void> {
  await prisma.customer.delete({
    where: { id },
  });
}

/**
 * Get or create customer by email (for widget usage)
 */
export async function getOrCreateCustomer(email: string, name?: string): Promise<CustomerWithTickets> {
  let customer = await getCustomerByEmail(email);

  if (!customer) {
    customer = await createCustomer({
      email,
      name: name || email.split('@')[0],
    });
  }

  return customer as CustomerWithTickets;
}
