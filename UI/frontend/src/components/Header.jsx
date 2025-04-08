// src/components/Header.js
import React from 'react';
import '../styles/header.css';

const Header = ({ cartCount, toggleCart }) => (
  <header className="header">
    <h2 className="logo">Fashion Store</h2>
    <div className="cart-icon" onClick={toggleCart}>
      🛒
      {cartCount > 0 && <span className="badge">{cartCount}</span>}
    </div>
  </header>
);

export default Header;
