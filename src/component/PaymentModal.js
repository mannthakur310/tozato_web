import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { toast } from 'react-toastify';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, totalAmount, onPaymentSuccess }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: 'bi bi-credit-card',
      description: 'Pay with Visa, MasterCard, or other cards'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: 'bi bi-phone',
      description: 'Pay using UPI apps like Google Pay, PhonePe'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: 'bi bi-bank',
      description: 'Pay using your bank account'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: 'bi bi-cash-coin',
      description: 'Pay when you receive your order'
    }
  ];

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedPaymentMethod(methodId);
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    if (selectedPaymentMethod === 'card') {
      if (!cardDetails.cardNumber || !cardDetails.cardHolder || !cardDetails.expiryDate || !cardDetails.cvv) {
        toast.error('Please fill in all card details', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // Simulate successful payment
      const successMessage = selectedPaymentMethod === 'cod' 
        ? 'Order placed successfully! Pay ₹' + totalAmount + ' on delivery.' 
        : 'Payment successful! Order placed successfully.';
      
      toast.success(successMessage, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      onPaymentSuccess();
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="payment-modal-header">
          <h3 className="payment-modal-title">
            <i className="bi bi-credit-card me-2"></i>
            Payment Details
          </h3>
          <button 
            className="payment-modal-close"
            onClick={onClose}
            disabled={isProcessing}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="payment-modal-content">
          <div className="payment-summary">
            <div className="total-amount">
              <span className="amount-label">Total Amount:</span>
              <span className="amount-value">₹{totalAmount}</span>
            </div>
          </div>

          <div className="payment-methods">
            <h4 className="payment-methods-title">Select Payment Method</h4>
            <div className="payment-methods-grid">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`payment-method-card ${selectedPaymentMethod === method.id ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodSelect(method.id)}
                >
                  <div className="payment-method-icon">
                    <i className={method.icon}></i>
                  </div>
                  <div className="payment-method-info">
                    <h5 className="payment-method-name">{method.name}</h5>
                    <p className="payment-method-description">{method.description}</p>
                  </div>
                  <div className="payment-method-radio">
                    <div className={`radio-button ${selectedPaymentMethod === method.id ? 'checked' : ''}`}>
                      {selectedPaymentMethod === method.id && <i className="bi bi-check"></i>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedPaymentMethod === 'card' && (
            <div className="card-details-section">
              <h4 className="card-details-title">Card Information</h4>
              <div className="card-form">
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={(e) => setCardDetails(prev => ({
                      ...prev,
                      cardNumber: formatCardNumber(e.target.value)
                    }))}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Card Holder Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="cardHolder"
                    value={cardDetails.cardHolder}
                    onChange={handleCardInputChange}
                    placeholder="John Doe"
                  />
                </div>
                <div className="card-form-row">
                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input
                      type="text"
                      className="form-control"
                      name="expiryDate"
                      value={cardDetails.expiryDate}
                      onChange={(e) => setCardDetails(prev => ({
                        ...prev,
                        expiryDate: e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substring(0, 5)
                      }))}
                      placeholder="MM/YY"
                      maxLength="5"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input
                      type="text"
                      className="form-control"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails(prev => ({
                        ...prev,
                        cvv: e.target.value.replace(/\D/g, '').substring(0, 4)
                      }))}
                      placeholder="123"
                      maxLength="4"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedPaymentMethod === 'upi' && (
            <div className="upi-section">
              <h4 className="upi-title">UPI Payment</h4>
              <div className="upi-info">
                <p>Pay using any UPI app like Google Pay, PhonePe, Paytm, etc.</p>
                <div className="upi-qr-placeholder">
                  <i className="bi bi-qr-code"></i>
                  <p>QR Code will be generated here</p>
                </div>
              </div>
            </div>
          )}

          {selectedPaymentMethod === 'netbanking' && (
            <div className="netbanking-section">
              <h4 className="netbanking-title">Net Banking</h4>
              <div className="netbanking-info">
                <p>You will be redirected to your bank's secure payment gateway.</p>
                <div className="bank-list">
                  <span className="bank-item">HDFC Bank</span>
                  <span className="bank-item">ICICI Bank</span>
                  <span className="bank-item">SBI</span>
                  <span className="bank-item">Axis Bank</span>
                </div>
              </div>
            </div>
          )}

          {selectedPaymentMethod === 'cod' && (
            <div className="cod-section">
              <h4 className="cod-title">Cash on Delivery</h4>
              <div className="cod-info">
                <p>Pay ₹{totalAmount} when you receive your order.</p>
                <div className="cod-notice">
                  <i className="bi bi-info-circle"></i>
                  <p>Please keep exact change ready for delivery.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="payment-modal-footer">
          <button 
            className="btn btn-secondary cancel-btn"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button 
            className={`btn btn-primary pay-btn ${isProcessing ? 'processing' : ''}`}
            onClick={handlePayment}
            disabled={isProcessing || !selectedPaymentMethod}
          >
            {isProcessing ? (
              <>
                <div className="loading-spinner"></div>
                Processing...
              </>
            ) : (
              <>
                <i className="bi bi-lock me-2"></i>
                {selectedPaymentMethod === 'cod' ? 'Place Order' : 'Pay ₹' + totalAmount}
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('cart-root')
  );
};

export default PaymentModal;
