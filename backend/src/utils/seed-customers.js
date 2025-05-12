import { faker } from '@faker-js/faker';
import Customer from '../models/customer.model.js';
import mongoose from 'mongoose';

// Set the number of customers to generate
const NUM_CUSTOMERS = 100;

// Cities for location diversity
const CITIES = [
  { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
  { city: 'Delhi', state: 'Delhi', country: 'India' },
  { city: 'Bangalore', state: 'Karnataka', country: 'India' },
  { city: 'Hyderabad', state: 'Telangana', country: 'India' },
  { city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
  { city: 'Kolkata', state: 'West Bengal', country: 'India' },
  { city: 'Pune', state: 'Maharashtra', country: 'India' },
  { city: 'Ahmedabad', state: 'Gujarat', country: 'India' },
  { city: 'Jaipur', state: 'Rajasthan', country: 'India' },
  { city: 'Lucknow', state: 'Uttar Pradesh', country: 'India' }
];

// Generate a random customer
const generateCustomer = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName }).toLowerCase();
  
  // Random location from our predefined list
  const location = CITIES[Math.floor(Math.random() * CITIES.length)];
  
  // Generate customer stats
  const totalSpend = parseFloat((Math.random() * 30000).toFixed(2));
  const visits = Math.floor(Math.random() * 50);
  const purchases = Math.floor(Math.random() * 20);
  
  // Generate a random lastActive date in the past 120 days
  const lastActive = new Date();
  lastActive.setDate(lastActive.getDate() - Math.floor(Math.random() * 120));
  
  // Marketing preferences
  const marketingConsent = Math.random() > 0.1; // 90% consent
  const emailConsent = marketingConsent && Math.random() > 0.05; // 95% of consented
  const smsConsent = marketingConsent && Math.random() > 0.3; // 70% of consented
  const pushConsent = marketingConsent && Math.random() > 0.5; // 50% of consented
  
  return {
    firstName,
    lastName,
    email,
    phone: faker.phone.number('+91##########'),
    location,
    stats: {
      totalSpend,
      visits,
      purchases,
      lastActive
    },
    preferences: {
      marketingConsent,
      channels: {
        email: emailConsent,
        sms: smsConsent,
        push: pushConsent
      }
    },
    isActive: Math.random() > 0.05 // 95% active
  };
};

// Seed the database with customers
export const seedCustomers = async () => {
  try {
    // Check if customers already exist
    const count = await Customer.countDocuments();
    if (count > 0) {
      console.log(`Database already contains ${count} customers. Skipping seed.`);
      return;
    }
    
    console.log(`Seeding database with ${NUM_CUSTOMERS} test customers...`);
    
    const customers = [];
    for (let i = 0; i < NUM_CUSTOMERS; i++) {
      customers.push(generateCustomer());
    }
    
    await Customer.insertMany(customers);
    console.log(`Successfully seeded ${NUM_CUSTOMERS} test customers.`);
  } catch (error) {
    console.error('Error seeding customers:', error);
  }
};

// The direct execution check for ES modules
// In ES modules, import.meta.url will be the file URL when the module is run directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  // Connect to database
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bolt-crm')
    .then(() => {
      console.log('Connected to MongoDB');
      return seedCustomers();
    })
    .then(() => {
      console.log('Seeding complete');
      mongoose.disconnect();
    })
    .catch(err => {
      console.error('Error:', err);
      mongoose.disconnect();
    });
}

export default seedCustomers; 