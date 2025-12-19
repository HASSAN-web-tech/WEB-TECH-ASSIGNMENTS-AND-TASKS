const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// List orders (API)
router.get('/', async (req, res) => {
  try {
    const list = await Order.find().sort({ createdAt: -1 }).populate('items.productId');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create order
router.post('/', async (req, res) => {
  try {
    const { items, total, customerName, address } = req.body;
    const o = new Order({ items, total, customerName, address });
    await o.save();
    res.status(201).json(o);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create' });
  }
});

module.exports = router;
