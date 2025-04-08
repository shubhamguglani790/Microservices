// src/components/ProductCard.js
import React from 'react';

const ProductCard = ({ product, onAddToCart }) => (
  <div className="product-card">
    <img
      src={`http://localhost:5002/uploads/${product.image}`}
      alt={product.name}
      className="product-img"
    />
    <h5>{product.name}</h5>
    <p className="category">{product.category}</p>
    <p className="price">₹{product.price}</p>
    <button onClick={() => onAddToCart(product)}>Add to Cart</button>
  </div>
);

export default ProductCard;
