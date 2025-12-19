const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  items: [{ productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: { type: Number, default: 1 }, price: { type: Number } }],
  total: { type: Number, required: true },
  discountedTotal: { type: Number },
  customerName: { type: String },
  email: { type: String },
  address: { type: String },
  status: { type: String, enum: ['Placed', 'Processing', 'Delivered'], default: 'Placed' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);