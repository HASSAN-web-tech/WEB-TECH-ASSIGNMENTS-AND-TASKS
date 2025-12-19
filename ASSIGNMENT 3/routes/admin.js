const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Testimonial = require('../models/Testimonial');
const Order = require('../models/Order');

// Admin dashboard -> redirect to admin products
router.get('/', (req, res) => {
  res.redirect('/admin/products');
});

// List products (admin)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.render('admin/products', { products });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Testimonials admin
router.get('/testimonials', async (req, res) => {
  try {
    const items = await Testimonial.find().sort({ createdAt: -1 });
    res.render('admin/testimonials', { testimonials: items });
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

router.get('/testimonials/add', (req, res) => res.render('admin/add-testimonial'));
router.post('/testimonials/add', async (req, res) => {
  try {
    const { author, text, rating } = req.body;
    const t = new Testimonial({ author, text, rating });
    await t.save();
    res.redirect('/admin/testimonials');
  } catch (err) { console.error(err); res.status(500).send('Failed'); }
});

router.get('/testimonials/:id/edit', async (req, res) => {
  try { const t = await Testimonial.findById(req.params.id); if(!t) return res.status(404).send('Not found'); res.render('admin/edit-testimonial', { testimonial: t }); }
  catch (err) { console.error(err); res.status(500).send('Server error'); }
});

router.post('/testimonials/:id/edit', async (req, res) => {
  try { const { author, text, rating } = req.body; await Testimonial.findByIdAndUpdate(req.params.id, { author, text, rating }); res.redirect('/admin/testimonials'); }
  catch (err) { console.error(err); res.status(500).send('Failed'); }
});

router.post('/testimonials/:id/delete', async (req, res) => { try { await Testimonial.findByIdAndDelete(req.params.id); res.redirect('/admin/testimonials'); } catch (err) { console.error(err); res.status(500).send('Failed'); } });

// Orders admin
router.get('/orders', async (req, res) => {
  try {
    const list = await Order.find().sort({ createdAt: -1 }).populate('items.productId');
    res.render('admin/orders', { orders: list });
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

router.get('/orders/:id', async (req, res) => {
  try { const o = await Order.findById(req.params.id).populate('items.productId'); if(!o) return res.status(404).send('Not found'); res.render('admin/edit-order', { order: o }); }
  catch (err) { console.error(err); res.status(500).send('Server error'); }
});

router.post('/orders/:id/delete', async (req, res) => { try { await Order.findByIdAndDelete(req.params.id); res.redirect('/admin/orders'); } catch (err) { console.error(err); res.status(500).send('Failed'); } });

// Add product form
router.get('/products/add', (req, res) => {
  res.render('admin/add');
});

// Create product
router.post('/products/add', async (req, res) => {
  try {
    const { name, price, category, image, description } = req.body;
    const p = new Product({ name, price, category, image, description });
    await p.save();
    res.redirect('/admin/products');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to add product');
  }
});

// Edit form
router.get('/products/:id/edit', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).send('Not found');
    res.render('admin/edit', { product: p });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update
router.post('/products/:id/edit', async (req, res) => {
  try {
    const { name, price, category, image, description } = req.body;
    await Product.findByIdAndUpdate(req.params.id, { name, price, category, image, description });
    res.redirect('/admin/products');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update');
  }
});

// Delete
router.post('/products/:id/delete', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin/products');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete');
  }
});

module.exports = router;
