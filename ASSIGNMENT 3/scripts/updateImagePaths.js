require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// Use existing cake image filenames present in the project root.
// These will be exposed under the `/images` path (e.g. /images/vanilla.png)
const images = [
  '/images/chocolate.jpg',
  '/images/dubai%20chocolate.png',
  '/images/vanilla.png',
  '/images/redvelvet.png',
  '/images/redvelvetstrawberry.png'
];

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bakerydb';

async function run(){
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to', uri);

  const products = await Product.find().sort({ createdAt: 1 });
  if (!products.length) {
    console.log('No products found to update.');
    await mongoose.disconnect();
    return;
  }

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const img = images[i % images.length];
    p.image = img;
    await p.save();
    console.log(`Updated ${p.name} -> ${img}`);
  }

  await mongoose.disconnect();
  console.log('Done. Restart server or refresh products page.');
}

run().catch(err => { console.error(err); process.exit(1); });
