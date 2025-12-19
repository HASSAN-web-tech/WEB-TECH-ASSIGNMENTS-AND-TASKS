require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bakerydb';

async function run() {
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to', uri);
  try {
    await mongoose.connection.db.collection('products').drop();
    console.log('Dropped products collection');
  } catch (e) {
    console.log('Drop skipped (collection may not exist):', e.message);
  }
  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
