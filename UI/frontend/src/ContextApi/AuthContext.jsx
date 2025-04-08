import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create a context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  // Check if token exists and is valid on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Validate the token (this could be an API call or JWT validation)
      // For simplicity, we're assuming the token is valid if it's there
      setIsLoggedIn(true);
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decoding the JWT token
      setUsername(decodedToken.username); // Extract username from the token (if available)
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('authToken', token); // Store token in localStorage
    setIsLoggedIn(true);
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode token to extract username
    setUsername(decodedToken.username); // Set username from token
    navigate('/dashboard'); // Redirect to the dashboard after login
  };

  const logout = () => {
    localStorage.removeItem('authToken'); // Remove the token from localStorage
    setIsLoggedIn(false);
    setUsername('');
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
