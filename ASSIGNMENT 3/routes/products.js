const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Helper to determine if mounted under /api
function isApiRequest(req) {
  return req.baseUrl && req.baseUrl.startsWith('/api');
}

// GET / -> list products (renders EJS when mounted at /products, returns JSON when mounted at /api/products)
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const category = req.query.category;
  const minPrice = parseFloat(req.query.minPrice);
  const maxPrice = parseFloat(req.query.maxPrice);

  const filter = {};
  if (category) filter.category = category;
  if (!isNaN(minPrice)) filter.price = { ...(filter.price || {}), $gte: minPrice };
  if (!isNaN(maxPrice)) filter.price = { ...(filter.price || {}), $lte: maxPrice };

  try {
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (isApiRequest(req)) {
      return res.json({ page, limit, total, products });
    }

    // Render EJS view with products
    return res.render('products', { products, page, limit, total, query: req.query });
  } catch (err) {
    console.error(err);
    if (isApiRequest(req)) return res.status(500).json({ error: 'Server error' });
    return res.status(500).send('Server error');
  }
});

// POST / -> create product (API only)
router.post('/', async (req, res) => {
  if (!isApiRequest(req)) return res.status(400).send('Use API to create products');

  try {
    const { name, price, category, image, description } = req.body;
    const p = new Product({ name, price, category, image, description });
    await p.save();
    res.status(201).json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// GET /:id -> product detail (API or render)
router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return isApiRequest(req) ? res.status(404).json({ error: 'Not found' }) : res.status(404).send('Not found');
    if (isApiRequest(req)) return res.json(p);
    return res.render('product-detail', { product: p });
  } catch (err) {
    console.error(err);
    return isApiRequest(req) ? res.status(500).json({ error: 'Server error' }) : res.status(500).send('Server error');
  }
});

module.exports = router;
