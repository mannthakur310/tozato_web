# Order History System - 1 Month Storage

## Overview
This system now stores order history for 1 month with automatic cleanup of older orders. Each order is stored as a separate document with timestamps and detailed information.

## Features

### ✅ Order Storage
- **Individual Order Documents**: Each order is stored as a separate document
- **Timestamps**: Automatic `createdAt` and `updatedAt` fields
- **Order Status**: Track order status (pending, preparing, on_way, delivered, cancelled)
- **Total Amount**: Automatically calculated for each order
- **1 Month Retention**: Orders older than 30 days are automatically deleted

### ✅ Order History Display
- **Last 30 Days**: Shows only orders from the last month
- **Order Statistics**: Total orders, total spent, average order value
- **Grouped by Date**: Orders are grouped by date for better organization
- **Order Status**: Visual status indicators for each order
- **Detailed Items**: Shows all items in each order with quantities and prices

### ✅ Automatic Cleanup
- **TTL Index**: MongoDB automatically deletes documents older than 30 days
- **Manual Cleanup**: API endpoint to manually clean up old orders
- **Database Efficiency**: Keeps database size manageable

## Database Schema

### Order Model
```javascript
{
  email: String (required, indexed),
  order_data: Array (required),
  order_date: Date (default: now, indexed),
  total_amount: Number (default: 0),
  order_status: String (enum: ['pending', 'preparing', 'on_way', 'delivered', 'cancelled']),
  createdAt: Date (automatic),
  updatedAt: Date (automatic)
}
```

## API Endpoints

### 1. Create Order
```
POST /api/orderDetail
Body: {
  email: string,
  order_data: array,
  order_date: date (optional)
}
```

### 2. Get Order History
```
POST /api/myOrderDetail
Body: {
  email: string
}
Response: {
  success: boolean,
  orders: array,
  totalOrders: number
}
```

### 3. Get Order Statistics
```
POST /api/orderStats
Body: {
  email: string
}
Response: {
  success: boolean,
  stats: {
    totalOrders: number,
    totalSpent: number,
    averageOrderValue: number
  }
}
```

### 4. Cleanup Old Orders
```
DELETE /api/cleanupOldOrders
Response: {
  success: boolean,
  message: string,
  deletedCount: number
}
```

## Frontend Components

### Myorder.js
- Displays order history for the last 30 days
- Shows order statistics (total orders, spending, average)
- Groups orders by date
- Shows order status and details

### Cart.js
- Updated to work with new order structure
- Sends proper order data format
- Handles order placement success/error

## Migration

### For Existing Data
If you have existing orders in the old format, run the migration script:

```bash
cd backend
node migrateOrders.js
```

This will:
1. Find all existing orders
2. Convert them to the new format
3. Create individual order documents
4. Delete old order documents

## Configuration

### TTL Index
The system uses MongoDB's TTL (Time To Live) index to automatically delete old orders:

```javascript
OrderSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); // 30 days
```

### Manual Cleanup
You can also manually clean up old orders using the API endpoint or by running:

```javascript
// In your application
fetch('/api/cleanupOldOrders', { method: 'DELETE' });
```

## Benefits

1. **Better Performance**: Individual order documents are faster to query
2. **Automatic Cleanup**: No manual maintenance required
3. **Detailed Analytics**: Order statistics and insights
4. **Scalable**: Handles large numbers of orders efficiently
5. **User-Friendly**: Clear order history display with status tracking

## Usage

1. **Place Orders**: Orders are automatically stored with timestamps
2. **View History**: Users can see their last 30 days of orders
3. **Track Status**: Order status is automatically calculated or manually set
4. **Analytics**: View spending patterns and order statistics
5. **Automatic Cleanup**: Old orders are automatically removed

## Notes

- Orders older than 30 days are automatically deleted by MongoDB
- The system maintains backward compatibility during migration
- Order statistics are calculated in real-time
- All timestamps are in UTC format
