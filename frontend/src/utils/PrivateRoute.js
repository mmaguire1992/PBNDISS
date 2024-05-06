import React from 'react'; 
import { Navigate } from 'react-router-dom'; 

// Defining PrivateRoute component
const PrivateRoute = ({ children }) => { 
  // Checking if user is authenticated
  const isAuthenticated = !!localStorage.getItem('token'); 
  // Returning authenticated, otherwise navigating to login page
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute; 