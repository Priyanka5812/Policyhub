require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Policy = require('./models/Policy');

const DEMO_PASSWORD = 'Demo@1234';

const users = [
  { name: 'Arjun Mehta',    email: 'customer@policyhub.dev', role: 'customer' },
  { name: 'Sneha Iyer',     email: 'agent@policyhub.dev',    role: 'agent'    },
  { name: 'Rahul Sharma',   email: 'admin@policyhub.dev',    role: 'admin'    },
];

const policies = [
  {
    title: 'Family Health Shield',
    type: 'health',
    description: 'Comprehensive health coverage for your entire family including hospitalisation, day-care procedures, and annual health check-ups.',
    coverageAmount: 1000000,
    premium: 2500,
    durationMonths: 12,
  },
  {
    title: 'Senior Citizen Health Plan',
    type: 'health',
    description: 'Specialised health cover for individuals above 60 years, including pre-existing disease coverage after a 12-month waiting period.',
    coverageAmount: 500000,
    premium: 4200,
    durationMonths: 12,
  },
  {
    title: 'Individual Health Essentials',
    type: 'health',
    description: 'Affordable health insurance for working adults covering in-patient hospitalisation, ambulance charges, and post-hospitalisation expenses.',
    coverageAmount: 300000,
    premium: 1100,
    durationMonths: 12,
  },
  {
    title: 'Critical Illness Cover',
    type: 'health',
    description: 'Lump-sum payout on diagnosis of 36 critical illnesses including cancer, cardiac arrest, kidney failure, and stroke.',
    coverageAmount: 2000000,
    premium: 3800,
    durationMonths: 12,
  },
  {
    title: 'Two-Wheeler Comprehensive Cover',
    type: 'vehicle',
    description: 'All-risk cover for motorcycles and scooters including accidental damage, theft, third-party liability, and natural calamities.',
    coverageAmount: 80000,
    premium: 600,
    durationMonths: 12,
  },
  {
    title: 'Private Car Comprehensive Plan',
    type: 'vehicle',
    description: 'Full comprehensive motor insurance for private cars with zero-depreciation add-on, engine protect, and roadside assistance.',
    coverageAmount: 500000,
    premium: 1800,
    durationMonths: 12,
  },
  {
    title: 'Commercial Vehicle Shield',
    type: 'vehicle',
    description: 'Robust coverage for commercial vehicles (trucks, vans, taxis) including goods in transit and passenger liability.',
    coverageAmount: 300000,
    premium: 2200,
    durationMonths: 12,
  },
  {
    title: 'Electric Vehicle Cover',
    type: 'vehicle',
    description: 'Purpose-built insurance for electric vehicles covering battery damage, charging equipment, and accidental loss.',
    coverageAmount: 600000,
    premium: 1500,
    durationMonths: 12,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');

    // Clean existing demo data
    await User.deleteMany({ email: { $in: users.map((u) => u.email) } });
    await Policy.deleteMany({});
    console.log('Cleared existing seed data.\n');

    // Hash password once, reuse for all demo users
    const hashed = await bcrypt.hash(DEMO_PASSWORD, 10);

    const createdUsers = await User.insertMany(
      users.map((u) => ({ ...u, password: hashed }))
    );
    console.log('Demo users created:');
    console.log('----------------------------------------------------');
    createdUsers.forEach((u) => {
      console.log(`  Role     : ${u.role}`);
      console.log(`  Name     : ${u.name}`);
      console.log(`  Email    : ${u.email}`);
      console.log(`  Password : ${DEMO_PASSWORD}`);
      console.log('----------------------------------------------------');
    });

    const createdPolicies = await Policy.insertMany(policies);
    console.log(`\n${createdPolicies.length} policies inserted.`);
    console.log('\nSeeding complete.');
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
