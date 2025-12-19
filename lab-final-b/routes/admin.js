const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// List orders for admin
router.get('/orders', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).populate('items.productId');
  res.render('admin-orders', { orders });
});

// Update order status
router.post('/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findById(id);
  if (!order) return res.status(404).send('Order not found');

  const validStatuses = ['Placed', 'Processing', 'Delivered'];
  const currentIndex = validStatuses.indexOf(order.status);
  const newIndex = validStatuses.indexOf(status);

  if (newIndex <= currentIndex) {
    return res.status(400).send('Cannot skip or revert status');
  }

  order.status = status;
  await order.save();

  res.redirect('/admin/orders');
});

module.exports = router;