const express = require("express");
const router = express.Router();
const order = require("../model/Order");

// Create a new order
router.post("/orderDetail", async (req, res) => {
    try {
        const { email, order_data, order_date } = req.body;
        
        // Calculate total amount
        const totalAmount = order_data.reduce((total, item) => {
            return total + (item.price || 0);
        }, 0);

        // Create new order document
        const newOrder = new order({
            email: email,
            order_data: order_data,
            order_date: order_date || new Date(),
            total_amount: totalAmount,
            order_status: 'pending'
        });

        await newOrder.save();
        
        res.json({
            success: true,
            message: "Order placed successfully",
            orderId: newOrder._id
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            message: "Failed to place order",
            error: error.message
        });
    }
});

// Get user's order history (last 1 month)
router.post("/myorderDetail", async (req, res) => {
    try {
        const { email } = req.body;
        
        // Calculate date 1 month ago
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        // Find all orders for the user from the last month
        const userOrders = await order.find({
            email: email,
            createdAt: { $gte: oneMonthAgo }
        }).sort({ createdAt: -1 }); // Sort by newest first

        res.json({
            success: true,
            orders: userOrders,
            totalOrders: userOrders.length
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
});

// Get order statistics for the last month
router.post("/orderStats", async (req, res) => {
    try {
        const { email } = req.body;
        
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const stats = await order.aggregate([
            {
                $match: {
                    email: email,
                    createdAt: { $gte: oneMonthAgo }
                }
            },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalSpent: { $sum: "$total_amount" },
                    averageOrderValue: { $avg: "$total_amount" }
                }
            }
        ]);

        res.json({
            success: true,
            stats: stats[0] || { totalOrders: 0, totalSpent: 0, averageOrderValue: 0 }
        });
    } catch (error) {
        console.error("Error fetching order stats:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch order statistics",
            error: error.message
        });
    }
});

// Clean up old orders (older than 1 month) - can be called manually or via cron job
router.delete("/cleanupOldOrders", async (req, res) => {
    try {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const result = await order.deleteMany({
            createdAt: { $lt: oneMonthAgo }
        });

        res.json({
            success: true,
            message: `Cleaned up ${result.deletedCount} old orders`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error("Error cleaning up old orders:", error);
        res.status(500).json({
            success: false,
            message: "Failed to cleanup old orders",
            error: error.message
        });
    }
});

module.exports = router;
