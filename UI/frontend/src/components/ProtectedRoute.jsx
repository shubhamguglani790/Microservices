import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../ContextApi/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  // If the user is not logged in, redirect to login page
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children; // If logged in, render the protected route
};

export default ProtectedRoute;
