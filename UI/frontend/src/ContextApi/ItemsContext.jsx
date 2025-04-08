import React, { createContext, useState, useEffect } from 'react';

const ItemsContext = createContext();
const CART_KEY = 'cart';
const CART_EXPIRY_KEY = 'cart_expiry';
const EXPIRY_DURATION = 60 * 60 * 100; // 1 hour

export const ItemsProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Load cart from localStorage with expiry
    useEffect(() => {
        const storedCart = localStorage.getItem(CART_KEY);
        const storedExpiry = localStorage.getItem(CART_EXPIRY_KEY);

        if (storedCart && storedExpiry) {
            const now = new Date().getTime();
            if (now < parseInt(storedExpiry, 10)) {
                setCart(JSON.parse(storedCart));
            } else {
                localStorage.removeItem(CART_KEY);
                localStorage.removeItem(CART_EXPIRY_KEY);
            }
        }
    }, []);

    // Save cart to localStorage and update expiry
    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
            localStorage.setItem(CART_EXPIRY_KEY, (new Date().getTime() + EXPIRY_DURATION).toString());
        } else {
            localStorage.removeItem(CART_KEY);
            localStorage.removeItem(CART_EXPIRY_KEY);
        }
    }, [cart]);

    return (
        <ItemsContext.Provider value={{ cart, setCart }}>
            {children}
        </ItemsContext.Provider>
    );
};

export default ItemsContext;
