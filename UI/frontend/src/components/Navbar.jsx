import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiUser, FiHeart, FiShoppingBag } from 'react-icons/fi';
import ItemsContext from '../ContextApi/ItemsContext';
import { useAuth } from '../ContextApi/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
    const { cart } = useContext(ItemsContext);
    const { logout, username, isLoggedIn } = useAuth();  // Extract username from AuthContext

    return (
        <nav className="navbar">
            <div className="navbar-logo">Amazon</div>

            <ul className="navbar-links">
                <li><a href="/addproduct">Product Management</a></li>
                <li><a href="/productdisplay">Product</a></li>
                <li><a href="/orders">Orders</a></li>
            </ul>

            <div className="navbar-icons">
                <FiSearch className="icon" />
                <Link to="/users"><FiUser className="icon" /></Link>
                <FiHeart className="icon" />
                <div className="cart-icon">
                    <Link to="/cart"><FiShoppingBag className="icon" /></Link>
                    <span className="cart-count">{cart.length}</span>
                </div>
            </div>

            {/* Show username and logout button if logged in */}
            {isLoggedIn ? (
                <div className="navbar-user-info">
                    <span className="username">Hello, {username}</span> {/* Display username */}
                    <button className="btn-logout" onClick={logout}>Logout</button>
                </div>
            ) : (
                <div className="navbar-auth-links">
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
