const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const applyDiscount = require('../middleware/discount');

// Assume Product model is available, perhaps import from parent
const Product = require('../../models/Product');

// Add to cart route (for demo)
router.get('/add-to-cart/:id/:price', (req, res) => {
  const { id, price } = req.params;
  const quantity = 1; // simple
  if (!req.session.cart) req.session.cart = [];
  const existing = req.session.cart.find(item => item.productId === id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    req.session.cart.push({ productId: id, quantity, price: parseFloat(price) });
  }
  res.redirect('/order/cart');
});

// Cart page
router.get('/cart', async (req, res) => {
  const cart = req.session.cart || [];
  let total = 0;
  const cartWithNames = [];

  for (let item of cart) {
    const product = await Product.findById(item.productId);
    if (product) {
      cartWithNames.push({
        ...item,
        name: product.name
      });
      total += item.price * item.quantity;
    }
  }

  res.render('cart', { cart: cartWithNames, total });
});

// /order/preview - Display cart preview
router.get('/preview', async (req, res) => {
  const cart = req.session.cart || [];
  let total = 0;
  const cartWithNames = [];

  for (let item of cart) {
    const product = await Product.findById(item.productId);
    if (product) {
      cartWithNames.push({
        ...item,
        name: product.name
      });
      total += item.price * item.quantity;
    }
  }

  // Apply discount if coupon in query
  const coupon = req.query.coupon;
  let discountedTotal = total;
  if (coupon === 'SAVE10') {
    discountedTotal = total * 0.9;
  }

  res.render('order-preview', { cart: cartWithNames, total, discountedTotal, coupon });
});

// /order/confirm - Finalize order
router.post('/confirm', applyDiscount, async (req, res) => {
  const cart = req.session.cart || [];
  if (cart.length === 0) return res.redirect('/cart'); // Assume cart page exists

  const { customerName, email, address, coupon } = req.body;
  let total = 0;
  cart.forEach(item => total += item.price * item.quantity);

  const discountedTotal = req.discountedTotal;

  const order = new Order({
    items: cart.map(item => ({ productId: item.productId, quantity: item.quantity, price: item.price })),
    total,
    discountedTotal,
    customerName,
    email,
    address,
    status: 'Placed'
  });

  await order.save();

  // Clear cart
  req.session.cart = [];

  res.render('order-success', { order });
});

// /my-orders - Customer order history
router.get('/my-orders', (req, res) => {
  res.render('my-orders-form');
});

router.post('/my-orders', async (req, res) => {
  const { email } = req.body;
  const orders = await Order.find({ email }).sort({ createdAt: -1 });
  res.render('my-orders', { orders, email });
});

module.exports = router;