require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const sampleProducts = [
  { name: 'Dubai Chocolate', price: 15.0, category: 'Cakes', image: '/images/dubai%20chocolate.png', description: 'Rich Dubai chocolate cake' },
  { name: 'Classic Chocolate', price: 12.5, category: 'Cakes', image: '/images/chocolate.jpg', description: 'Delicious chocolate cake' },
  { name: 'Vanilla Delight', price: 10.0, category: 'Cakes', image: '/images/vanilla.png', description: 'Light vanilla sponge' },
  { name: 'Red Velvet Strawberry', price: 14.0, category: 'Cakes', image: '/images/redvelvetstrawberry.png', description: 'Red velvet with strawberry' }
];

const sampleTestimonials = [
  { author: 'Aisha', text: 'Best cake in town!', rating: 5 },
  { author: 'Bilal', text: 'Lovely service.', rating: 4 }
];

const sampleOrders = [
  { items: [], total: 25.0, customerName: 'Customer One', address: '123 Street' }
];

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bakerydb';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to DB for seeding');

  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(sampleProducts);
    console.log('Seeded sample products');
  } else {
    console.log('Products exist; skipping seed');
  }

  // Seed testimonials
  const Testimonial = require('../models/Testimonial');
  const tcount = await Testimonial.countDocuments();
  if (tcount === 0) { await Testimonial.insertMany(sampleTestimonials); console.log('Seeded testimonials'); } else { console.log('Testimonials exist; skipping'); }

  // Seed orders
  const Order = require('../models/Order');
  const ocount = await Order.countDocuments();
  if (ocount === 0) { await Order.insertMany(sampleOrders); console.log('Seeded orders'); } else { console.log('Orders exist; skipping'); }

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
