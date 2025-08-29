const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true
    },
    order_data: {
        type: Array,
        required: true
    },
    order_date: {
        type: Date,
        default: Date.now,
        index: true
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
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Index for automatic cleanup of old orders
OrderSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); // 30 days

module.exports = mongoose.model('order', OrderSchema);