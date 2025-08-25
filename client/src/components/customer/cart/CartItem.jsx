import React from 'react';
import { FaTrash } from 'react-icons/fa';

const CartItem = ({ item, onQuantityChange, onRemove, isUpdating, isRemoving }) => {
  const handleDecrement = () => {
    onQuantityChange(item.productId, item.quantity - 1);
  };

  const handleIncrement = () => {
    onQuantityChange(item.productId, item.quantity + 1);
  };

  const handleRemove = () => {
    onRemove(item.productId);
  };

  const disabled = isUpdating || isRemoving;

  return (
    <div className={`cart-item ${disabled ? 'disabled' : ''}`}>
      <div className="item-image">
        <img 
          src={item.image || item.product?.image || "https://via.placeholder.com/100"} 
          alt={item.name || item.product?.name} 
        />
      </div>
      
      <div className="item-details">
        <h3>{item.name || item.product?.name}</h3>
        <p className="item-sku">SKU: {item.sku || item.product?.sku}</p>
        <p className="item-price">${(item.price || item.product?.price || 0).toFixed(2)}</p>
      </div>

      <div className="item-quantity">
        <label>Quantity:</label>
        <div className="quantity-controls">
          <button onClick={handleDecrement} disabled={item.quantity <= 1 || disabled}>-</button>
          <span>{isUpdating ? <div className="mini-spinner"></div> : item.quantity}</span>
          <button onClick={handleIncrement} disabled={disabled}>+</button>
        </div>
      </div>

      <div className="item-total">
        <p>${((item.price || item.product?.price || 0) * (item.quantity || 0)).toFixed(2)}</p>
      </div>

      <div className="item-actions">
        <button onClick={handleRemove} className="remove-btn" title="Remove item" disabled={disabled}>
          {isRemoving ? <div className="mini-spinner"></div> : <FaTrash />}
        </button>
      </div>
    </div>
  );
};

export default CartItem;
