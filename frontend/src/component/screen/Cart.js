import React, { useState } from "react";
import { useCart, useDispatchCart } from "../ContextReducer";
import { baseurl } from "../../Urls";
import { toast } from "react-toastify";
import PaymentModal from "../PaymentModal";
import "./Cart.css";

export default function Cart({ onClose }) {
  let data = useCart();
  let dispatch = useDispatchCart();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  if (data.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <button 
            className="cart-close-btn"
            onClick={onClose}
            title="Close cart"
          >
            <i className="bi bi-x-lg"></i>
          </button>
          <div className="empty-cart-icon">
            <i className="bi bi-cart-x"></i>
          </div>
          <h3 className="empty-cart-title">Your Cart is Empty!</h3>
          <p className="empty-cart-message">Add some delicious items to get started.</p>
        </div>
      </div>
    );
  }

  const handleRemove = (index) => {
    dispatch({ type: "REMOVE", index: index });
    toast.success('Item removed from cart', {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleCheckOut = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    let userEmail = localStorage.getItem("userEmail");
    try {
      let response = await fetch(`${baseurl}/api/orderDetail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_data: data,
          email: userEmail,
          order_date: new Date(),
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        dispatch({ type: "DROP" });
        toast.success('Order placed successfully! 🎉', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        if (onClose) onClose();
      } else {
        throw new Error(result.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error('Failed to place order. Please try again.', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  let totalPrice = data.reduce((total, food) => total + food.price, 0);

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <div className="cart-header-content">
            <h2 className="cart-title">
              <i className="bi bi-cart3 me-2"></i>
              Shopping Cart
            </h2>
            <p className="cart-subtitle">
              {data.length} item{data.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          <button 
            className="cart-close-btn"
            onClick={onClose}
            title="Close cart"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="cart-items">
          {data.map((food, index) => (
            <div key={index} className="cart-item animate-fade-in-up">
              <div className="cart-item-image">
                <img 
                  src={food.img || 'https://via.placeholder.com/100x100?text=Food'} 
                  alt={food.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100x100?text=Food';
                  }}
                />
              </div>
              <div className="cart-item-details">
                <h5 className="cart-item-name">{food.name}</h5>
                <div className="cart-item-info">
                  <span className="cart-item-qty">Qty: {food.qty}</span>
                  <span className="cart-item-size">Size: {food.size}</span>
                </div>
                <div className="cart-item-price">₹{food.price}</div>
              </div>
              <button
                className="cart-item-remove"
                onClick={() => handleRemove(index)}
                title="Remove item"
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="cart-total">
            <span className="total-label">Total Amount:</span>
            <span className="total-amount">₹{totalPrice}</span>
          </div>
          <button 
            className="btn btn-primary checkout-btn"
            onClick={handleCheckOut}
          >
            <i className="bi bi-credit-card me-2"></i>
            Proceed to Payment
          </button>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        totalAmount={totalPrice}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
