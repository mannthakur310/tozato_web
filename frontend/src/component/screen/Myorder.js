import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useState, useEffect, useMemo } from "react";
import "./Myorder.css";

function Myorder() {
    const [orderData, setOrderData] = useState({});
    const [orderStats, setOrderStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMyOrder = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch("/api/myOrderDetail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: localStorage.getItem("userEmail"),
                }),
            });
            
            const data = await response.json();
            if (data.success) {
                setOrderData(data);
            } else {
                setError(data.message || 'Failed to load orders');
            }
        } catch (err) {
            setError('Failed to load orders. Please try again.');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderStats = async () => {
        try {
            const response = await fetch("/api/orderStats", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: localStorage.getItem("userEmail"),
                }),
            });
            
            const data = await response.json();
            if (data.success) {
                setOrderStats(data.stats);
            }
        } catch (err) {
            console.error('Error fetching order stats:', err);
        }
    };

    useEffect(() => {
        fetchMyOrder();
        fetchOrderStats();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getOrderStatus = (orderStatus, orderDate) => {
        // If order has a specific status, use it
        if (orderStatus && orderStatus !== 'pending') {
            const statusMap = {
                'preparing': { status: 'Preparing', color: 'warning' },
                'on_way': { status: 'On the Way', color: 'info' },
                'delivered': { status: 'Delivered', color: 'success' },
                'cancelled': { status: 'Cancelled', color: 'danger' }
            };
            return statusMap[orderStatus] || { status: 'Pending', color: 'secondary' };
        }

        // Otherwise, calculate status based on time
        const orderTime = new Date(orderDate);
        const now = new Date();
        const diffHours = (now - orderTime) / (1000 * 60 * 60);
        
        if (diffHours < 1) return { status: 'Preparing', color: 'warning' };
        if (diffHours < 2) return { status: 'On the Way', color: 'info' };
        return { status: 'Delivered', color: 'success' };
    };

    const { groupedOrders, sortedDates } = useMemo(() => {
        if (!orderData?.orders || orderData.orders.length === 0) {
            return { groupedOrders: {}, sortedDates: [] };
        }

        const groups = {};
        
        orderData.orders.forEach(order => {
            const orderDate = new Date(order.order_date || order.createdAt);
            const dateKey = orderDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            
            groups[dateKey].push({
                orderId: order._id,
                orderDate: orderDate,
                orderStatus: order.order_status,
                totalAmount: order.total_amount,
                items: order.order_data || []
            });
        });

        // Sort dates from most recent to oldest
        const dates = Object.keys(groups).sort((a, b) => {
            const dateA = new Date(groups[a][0].orderDate);
            const dateB = new Date(groups[b][0].orderDate);
            return dateB - dateA;
        });

        // Sort orders within each day from most recent to oldest
        dates.forEach(dateKey => {
            groups[dateKey].sort((a, b) => b.orderDate - a.orderDate);
        });

        return { groupedOrders: groups, sortedDates: dates };
    }, [orderData]);

    return (
        <>
            <Navbar />
            
            <div className="orders-container">
                <div className="orders-header">
                    <div className="orders-title-section">
                        <h1 className="orders-title animate-fade-in-up">
                            <i className="bi bi-bag-check me-3"></i>
                            My Orders
                        </h1>
                        <p className="orders-subtitle animate-fade-in-up">
                            Your order history for the last 30 days
                        </p>
                    </div>
                </div>

                {/* Order Statistics */}
                {orderStats.totalOrders > 0 && (
                    <div className="order-stats-section">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="bi bi-bag"></i>
                                </div>
                                <div className="stat-content">
                                    <h3 className="stat-number">{orderStats.totalOrders}</h3>
                                    <p className="stat-label">Total Orders</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="bi bi-currency-rupee"></i>
                                </div>
                                <div className="stat-content">
                                    <h3 className="stat-number">₹{orderStats.totalSpent?.toFixed(2) || '0'}</h3>
                                    <p className="stat-label">Total Spent</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="bi bi-graph-up"></i>
                                </div>
                                <div className="stat-content">
                                    <h3 className="stat-number">₹{orderStats.averageOrderValue?.toFixed(2) || '0'}</h3>
                                    <p className="stat-label">Average Order</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="orders-content">
                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p className="loading-text">Loading your orders...</p>
                        </div>
                    ) : error ? (
                        <div className="error-container">
                            <div className="error-icon">
                                <i className="bi bi-exclamation-triangle"></i>
                            </div>
                            <h3 className="error-title">Oops! Something went wrong</h3>
                            <p className="error-message">{error}</p>
                            <button 
                                className="btn btn-primary retry-btn"
                                onClick={fetchMyOrder}
                            >
                                <i className="bi bi-arrow-clockwise me-2"></i>
                                Try Again
                            </button>
                        </div>
                    ) : sortedDates.length === 0 ? (
                        <div className="empty-orders">
                            <div className="empty-icon animate-bounce">
                                <i className="bi bi-bag-x"></i>
                            </div>
                            <h3 className="empty-title">No Orders Yet</h3>
                            <p className="empty-message">
                                You haven't placed any orders in the last 30 days. Start exploring our delicious menu!
                            </p>
                            <a href="/" className="btn btn-primary explore-btn">
                                <i className="bi bi-arrow-right me-2"></i>
                                Explore Menu
                            </a>
                        </div>
                    ) : (
                        <div className="orders-section">
                            {sortedDates.map((dateKey) => {
                                const dayOrders = groupedOrders[dateKey];
                                
                                return (
                                    <div key={dateKey} className="order-group">
                                        <div className="order-date-section animate-fade-in-up">
                                            <div className="order-date-badge">
                                                <i className="bi bi-calendar-event me-2"></i>
                                                {dateKey}
                                            </div>
                                            <div className="order-count-badge">
                                                <i className="bi bi-collection me-1"></i>
                                                {dayOrders.length} order{dayOrders.length > 1 ? 's' : ''}
                                            </div>
                                        </div>

                                        <div className="order-cards-column">
                                            {dayOrders.map((order, orderIndex) => {
                                                const status = getOrderStatus(order.orderStatus, order.orderDate);
                                                
                                                return (
                                                    <div key={order.orderId} className="order-card animate-fade-in-up hover-lift">
                                                        <div className="order-header">
                                                            <div className="order-info">
                                                                <div className="order-time">
                                                                    <i className="bi bi-clock me-1"></i>
                                                                    {formatDate(order.orderDate)}
                                                                </div>
                                                                <div className="order-total">
                                                                    <i className="bi bi-currency-rupee me-1"></i>
                                                                    Total: ₹{order.totalAmount?.toFixed(2) || '0'}
                                                                </div>
                                                            </div>
                                                            <div className="order-status-badge">
                                                                <span className={`status-${status.color}`}>
                                                                    <i className="bi bi-circle-fill me-1"></i>
                                                                    {status.status}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="order-items">
                                                            {order.items.map((item, itemIndex) => (
                                                                <div key={itemIndex} className="order-item">
                                                                    <div className="item-info">
                                                                        <h6 className="item-name">{item.name}</h6>
                                                                        <div className="item-details">
                                                                            <span className="item-quantity">
                                                                                <i className="bi bi-hash me-1"></i>
                                                                                Qty: {item.qty}
                                                                            </span>
                                                                            <span className="item-size">
                                                                                <i className="bi bi-arrows-angle-expand me-1"></i>
                                                                                Size: {item.size}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="item-price">
                                                                        ₹{item.price?.toFixed(2) || '0'}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}

export default Myorder;