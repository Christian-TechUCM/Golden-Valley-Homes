import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ component: Component, allowedRoles }) => {
  const { currentUser, currentUserRole } = useAuth();
  const location = useLocation();

  // Check if there's a currentUser
  if (!currentUser) {
    // If not, redirect to the login page and pass the current location in state
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // Check if the user's role is not among the allowedRoles
  if (allowedRoles && !allowedRoles.includes(currentUserRole)) {
    // If not, redirect to the home page
    return <Navigate to="/" />;
  }

  // If the user is logged in and has the right role, render the component
  return <Component />;
};

export default ProtectedRoute;
