import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  // Function to handle login success
  const handleLoginSuccess = (token) => {
    // Store token in local storage
    localStorage.setItem('token', token);

    // Redirect to home page
    window.location = '/';
  };

  return (
    <div>
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </div>
  );
};

export default LoginPage;
