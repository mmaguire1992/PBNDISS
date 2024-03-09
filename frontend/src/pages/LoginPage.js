import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  const handleLoginSuccess = (token) => {
    localStorage.setItem('token', token);

    window.location = '/';
  };

  return (
    <div>
      <h1>Login</h1>
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </div>
  );
};

export default LoginPage;
