import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        _count: {
          select: { tickets: true },
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Failed to get customer:', error);
    return NextResponse.json(
      { error: 'Failed to get customer' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { name, email, phone, company, location, timezone, plan, notes } = body;

    // Get existing customer to preserve current metadata
    const existing = await prisma.customer.findUnique({
      where: { id },
      select: { metadata: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Build updated metadata
    const currentMetadata = (existing.metadata as Record<string, unknown>) || {};
    const updatedMetadata = {
      ...currentMetadata,
      ...(phone !== undefined && { phone }),
      ...(company !== undefined && { company }),
      ...(location !== undefined && { location }),
      ...(timezone !== undefined && { timezone }),
      ...(plan !== undefined && { plan }),
      ...(notes !== undefined && { notes }),
    };

    // Update customer
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        metadata: updatedMetadata,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Failed to update customer:', error);
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}
