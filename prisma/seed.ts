import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcryptjs';

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Prisma client with PostgreSQL adapter
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Create default team
  const team = await prisma.team.upsert({
    where: { id: 'default-team' },
    update: {},
    create: {
      id: 'default-team',
      name: 'Default Team',
      settings: {
        widgetEnabled: true,
        autoAssignment: false,
      },
    },
  });

  console.log(`✅ Team: ${team.name}`);

  // Create admin user
  const hashedPassword = await hash('admin123', 12);

  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  });

  console.log(`✅ User: ${user.email} (password: admin123)`);

  // Create admin agent
  const agent = await prisma.agent.upsert({
    where: {
      teamId_userId: {
        teamId: team.id,
        userId: user.id,
      },
    },
    update: {},
    create: {
      teamId: team.id,
      userId: user.id,
      role: 'ADMIN',
    },
  });

  console.log(`✅ Agent: ${agent.role}`);

  // Create a sample customer
  const customer = await prisma.customer.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: 'John Doe',
      metadata: {
        company: 'Acme Inc',
        plan: 'premium',
      },
    },
  });

  console.log(`✅ Customer: ${customer.email}`);

  // Create a sample ticket
  const ticket = await prisma.ticket.upsert({
    where: { id: 'sample-ticket' },
    update: {},
    create: {
      id: 'sample-ticket',
      teamId: team.id,
      customerId: customer.id,
      assignedAgentId: agent.id,
      subject: 'Unable to access my account',
      description: 'I have been trying to log in to my account but I keep getting an error message saying "Invalid credentials". I am sure my password is correct.',
      status: 'OPEN',
      priority: 'HIGH',
      category: 'technical',
      sentimentScore: -0.3,
    },
  });

  console.log(`✅ Ticket: ${ticket.subject}`);

  // Check if messages already exist
  const existingMessages = await prisma.message.count({
    where: { ticketId: ticket.id },
  });

  if (existingMessages === 0) {
    await prisma.message.createMany({
      data: [
        {
          ticketId: ticket.id,
          senderType: 'CUSTOMER',
          senderId: customer.id,
          body: 'I have been trying to log in to my account but I keep getting an error message saying "Invalid credentials". I am sure my password is correct.',
        },
        {
          ticketId: ticket.id,
          senderType: 'AGENT',
          senderId: agent.id,
          body: 'Hi John, I apologize for the inconvenience. Can you please confirm that you are using the correct email address? Also, have you tried resetting your password using the "Forgot Password" link?',
        },
        {
          ticketId: ticket.id,
          senderType: 'CUSTOMER',
          senderId: customer.id,
          body: 'Yes, I confirmed the email is correct. I just tried the password reset link and it worked! Thank you for your help.',
        },
      ],
    });
    console.log('✅ Messages: 3 sample messages created');
  } else {
    console.log('✅ Messages: already exist, skipping');
  }

  console.log('\n✨ Seed complete!\n');
  console.log('Login credentials:');
  console.log('  Email: admin@example.com');
  console.log('  Password: admin123\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
