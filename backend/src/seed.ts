import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@esahayak.com' },
    update: {},
    create: {
      email: 'demo@esahayak.com',
      name: 'Demo User',
      isAdmin: false,
    },
  });

  console.log('✅ Demo user created:', demoUser.email);

  // Create sample buyers with proper schema validation
  const sampleBuyers = [
    {
      fullName: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '9876543210',
      city: 'Chandigarh' as const,
      propertyType: 'Apartment' as const,
      bhk: '2' as const, // Required for Apartment
      purpose: 'Buy' as const,
      budgetMin: 5000000,
      budgetMax: 7000000,
      timeline: '3-6m' as const,
      source: 'Website' as const,
      status: 'New' as const,
      notes: 'Looking for 2BHK in Sector 34',
      tags: ['urgent', 'first-time-buyer'],
      ownerId: demoUser.id,
    },
    {
      fullName: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '9876543211',
      city: 'Mohali' as const,
      propertyType: 'Villa' as const,
      bhk: '3' as const, // Required for Villa
      purpose: 'Buy' as const,
      budgetMin: 8000000,
      budgetMax: 12000000,
      timeline: '0-3m' as const,
      source: 'Referral' as const,
      status: 'Qualified' as const,
      notes: 'Prefers independent villa with parking',
      tags: ['premium', 'ready-to-buy'],
      ownerId: demoUser.id,
    },
    {
      fullName: 'Amit Singh',
      email: undefined, // Plot doesn't require email but schema allows optional
      phone: '9876543212',
      city: 'Zirakpur' as const,
      propertyType: 'Plot' as const,
      bhk: undefined, // Plot doesn't have BHK
      purpose: 'Buy' as const,
      budgetMin: 3000000,
      budgetMax: 5000000,
      timeline: '>6m' as const,
      source: 'Walk-in' as const,
      status: 'Contacted' as const,
      notes: 'Looking for residential plot for future construction',
      tags: ['investment'],
      ownerId: demoUser.id,
    },
    {
      fullName: 'Neha Gupta',
      email: 'neha@example.com',
      phone: '9876543213',
      city: 'Panchkula' as const,
      propertyType: 'Office' as const,
      bhk: undefined, // Office doesn't have BHK
      purpose: 'Rent' as const,
      budgetMin: 50000,
      budgetMax: 80000,
      timeline: '0-3m' as const,
      source: 'Call' as const,
      status: 'Visited' as const,
      notes: 'Small office space for startup',
      tags: ['commercial', 'startup'],
      ownerId: demoUser.id,
    },
    {
      fullName: 'Vikram Mehta',
      email: 'vikram@example.com',
      phone: '9876543214',
      city: 'Other' as const,
      propertyType: 'Retail' as const,
      bhk: undefined, // Retail doesn't have BHK
      purpose: 'Rent' as const,
      budgetMin: 100000,
      budgetMax: 150000,
      timeline: 'Exploring' as const,
      source: 'Other' as const,
      status: 'Negotiation' as const,
      notes: 'Retail space for electronics store',
      tags: ['retail', 'electronics'],
      ownerId: demoUser.id,
    },
  ];

  for (const buyerData of sampleBuyers) {
    const buyer = await prisma.buyer.create({
      data: buyerData,
    });

    // Create initial history entry
    await prisma.buyerHistory.create({
      data: {
        buyerId: buyer.id,
        changedBy: demoUser.id,
        diff: { action: 'created', data: buyerData },
      },
    });

    console.log(`✅ Created buyer: ${buyer.fullName}`);
  }

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
