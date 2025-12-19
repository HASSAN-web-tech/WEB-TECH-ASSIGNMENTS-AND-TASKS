const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  items: [{ productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: { type: Number, default: 1 } }],
  total: { type: Number, required: true },
  customerName: { type: String },
  address: { type: String },
  status: { type: String, enum: ['pending','paid','shipped','cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
