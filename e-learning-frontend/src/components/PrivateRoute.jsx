// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token'); // Assuming the JWT token is stored here
  const user = JSON.parse(localStorage.getItem('user')); // Assuming user details are stored here

  if (!token || !user || user.role !== requiredRole) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;