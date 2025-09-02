const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  name: String,
  qty: Number,
  size: String,
  price: Number,
  img: String
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  order_data: {
    type: [OrderItemSchema],
    default: []
  },
  order_date: {
    type: Date,
    default: Date.now
  },
  total_amount: {
    type: Number,
    default: 0
  },
  order_status: {
    type: String,
    enum: ['pending', 'preparing', 'on_way', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('order', OrderSchema);


