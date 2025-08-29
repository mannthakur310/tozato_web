const mongoose = require('mongoose');
const order = require('./model/Order');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/foodapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function migrateOrders() {
    try {
        console.log('Starting order migration...');
        
        // Find all existing orders with old structure
        const oldOrders = await order.find({});
        
        console.log(`Found ${oldOrders.length} orders to migrate`);
        
        for (const oldOrder of oldOrders) {
            // Check if this order already has the new structure
            if (oldOrder.order_data && Array.isArray(oldOrder.order_data) && oldOrder.order_data.length > 0) {
                const firstOrder = oldOrder.order_data[0];
                
                // If the first element has order_date, it's already in new format
                if (firstOrder && firstOrder.order_date) {
                    console.log(`Order ${oldOrder._id} already migrated, skipping...`);
                    continue;
                }
                
                // Convert old format to new format
                const newOrders = oldOrder.order_data.map(orderGroup => {
                    const orderDate = orderGroup[0]?.order_date ? new Date(orderGroup[0].order_date) : new Date();
                    const orderItems = orderGroup.slice(1);
                    
                    // Calculate total amount
                    const totalAmount = orderItems.reduce((total, item) => total + (item.price || 0), 0);
                    
                    return {
                        email: oldOrder.email,
                        order_data: orderItems,
                        order_date: orderDate,
                        total_amount: totalAmount,
                        order_status: 'delivered', // Assume old orders are delivered
                        createdAt: orderDate,
                        updatedAt: orderDate
                    };
                });
                
                // Delete old order
                await order.findByIdAndDelete(oldOrder._id);
                
                // Create new orders
                for (const newOrderData of newOrders) {
                    await order.create(newOrderData);
                }
                
                console.log(`Migrated order ${oldOrder._id} to ${newOrders.length} new orders`);
            }
        }
        
        console.log('Migration completed successfully!');
        
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        mongoose.connection.close();
    }
}

// Run migration if this file is executed directly
if (require.main === module) {
    migrateOrders();
}

module.exports = migrateOrders;
