import React from 'react';
import RegisterForm from '../components/RegisterForm';
import { useNavigate } from 'react-router-dom'; 

const RegisterPage = () => {
  // Access navigate function from useNavigate hook
  const navigate = useNavigate(); 

  // Function to handle registration success
  const handleRegisterSuccess = () => {
    // Navigate to login page
    navigate('/login'); 
  };

  return (
    <div>
      {/* Render RegisterForm component and pass handleRegisterSuccess as prop */}
      <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
    </div>
  );
};

export default RegisterPage;

