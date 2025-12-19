require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve existing static front-end files (do not modify them)
app.use(express.static(path.join(__dirname)));

// Expose an `/images` virtual folder that serves files from project root
// This lets image URLs be `/images/p1.jpeg` while files remain in the repo root.
app.use('/images', express.static(path.join(__dirname)));

// Routes
const productsRouter = require('./routes/products');
const adminRouter = require('./routes/admin');
const testimonialsRouter = require('./routes/testimonials');
const ordersRouter = require('./routes/orders');

app.use('/api/products', productsRouter);
app.use('/products', productsRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/orders', ordersRouter);

// Basic admin auth middleware
const adminAuth = (req, res, next) => {
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASS || 'password';
  const auth = req.headers.authorization;
  if (!auth) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Authentication required');
  }
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Basic') return res.status(400).send('Bad auth');
  const creds = Buffer.from(parts[1], 'base64').toString();
  const [user, pass] = creds.split(':');
  if (user === adminUser && pass === adminPass) return next();
  res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
  return res.status(401).send('Invalid credentials');
};

// protect admin routes
app.use('/admin', adminAuth, adminRouter);

app.get('/', (req, res) => {
  // If you prefer the static index.html, this will still be served by static middleware.
  res.render('index');
});

const PORT = process.env.PORT || 3000;

async function start() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bakerydb';
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

start();
