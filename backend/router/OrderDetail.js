const express = require('express');
const router = express.Router();
const Order = require('../model/Order');

// Create a new order
router.post('/orderDetail', async (req, res) => {
  try {
    const { order_data, email, order_date, total_amount } = req.body;
    const order = await Order.create({
      email,
      order_data,
      order_date: order_date ? new Date(order_date) : new Date(),
      total_amount: total_amount || order_data.reduce((t, i) => t + (i.price || 0), 0),
      order_status: 'pending'
    });
    res.json({ success: true, order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Fetch orders for a user
router.post('/myOrderDetail', async (req, res) => {
  try {
    const { email } = req.body;
    const orders = await Order.find({ email }).sort({ order_date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Simple order stats for a user
router.post('/orderStats', async (req, res) => {
  try {
    const { email } = req.body;
    const orders = await Order.find({ email });
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const averageOrderValue = totalOrders ? totalSpent / totalOrders : 0;
    res.json({ success: true, stats: { totalOrders, totalSpent, averageOrderValue } });
  } catch (error) {
    console.error("Error fetching order stats:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Cleanup helper (optional)
router.post('/cleanupOldOrders', async (req, res) => {
  try {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 6);
    const result = await Order.deleteMany({ order_date: { $lt: cutoff } });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    console.error("Error cleaning up old orders:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;



