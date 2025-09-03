import React, { useEffect, useRef, useState } from "react";
import './card.css'
import { useCart, useDispatchCart } from "./ContextReducer";
import { toast } from "react-toastify";

export default function Card(props) {
  const { _id, img, name } = props.foodItem
  let data = useCart();
  const priceRef = useRef();
  let optionprice = Object.keys(props.option);
  let dispatch = useDispatchCart();
  const [qty, setqty] = useState(1);
  const [size, setsize] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  let finalprice = qty * parseInt(props.option[size]);
  
  useEffect(() => {
    setsize(priceRef.current.value)
  }, [])

  const handleAddToCart = async () => {
    if (!size) {
      toast.error('Please select a size', {
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

    setIsAdding(true);
    
    try {
      let food = [];
      for (const item of data) {
        if (item.id === _id) {
          food = item;
          break;
        }
      }
      
      if (Object.keys(food).length !== 0) {
        if (food.size === size) {
          await dispatch({ type: "UPDATE", id: _id, price: finalprice, qty: qty })
        } else {
          await dispatch({ type: "ADD", id: _id, size: size, price: finalprice, qty: qty, name: name })
        }
      } else {
        await dispatch({ type: "ADD", id: _id, size: size, price: finalprice, qty: qty, name: name })
      }
      
      toast.success('Item Added to Cart! 🛒', {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      toast.error('Failed to add item to cart', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="food-item-card">
      <div className="food-image-container">
        <img 
          src={img}
          className="food-item-image"
          alt={name}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Food+Image';
          }}
        />
        <div className="food-overlay">
          <div className="food-price-badge">
            ₹{finalprice}
          </div>
        </div>
      </div>
      
      <div className="food-item-content">
        <h5 className="food-item-title">{name}</h5>
        
        <div className="food-options">
          <div className="option-group">
            <label className="option-label">Quantity:</label>
            <select
              className="option-select"
              value={qty}
              onChange={(e) => setqty(parseInt(e.target.value))}
            >
              {Array.from(Array(6), (e, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
          
          <div className="option-group">
            <label className="option-label">Size:</label>
            <select
              className="option-select"
              ref={priceRef}
              value={size}
              onChange={(e) => setsize(e.target.value)}
            >
              {optionprice.map((data) => (
                <option key={data} value={data}>
                  {data}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="food-total">
          <span className="total-label">Total:</span>
          <span className="total-price">₹{finalprice}</span>
        </div>
        
        <button 
          className={`add-to-cart-btn ${isAdding ? 'loading' : ''}`}
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? (
            <>
              <div className="loading-spinner"></div>
              Adding...
            </>
          ) : (
            <>
              <i className="bi bi-cart-plus me-2"></i>
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
