import React from 'react';
import RegisterForm from '../components/RegisterForm';
import { useNavigate } from 'react-router-dom'; 

const RegisterPage = () => {
  const navigate = useNavigate(); 

  const handleRegisterSuccess = () => {
    navigate('/login'); 
  };

  return (
    <div>
      <h1>Register</h1>
      <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
    </div>
  );
};

export default RegisterPage;
