import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BackgroundVideo from './BackgroundVideo';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import '../css/MainPageBody.css';


const LoginForm = ({ onLoginSuccess }) => {
  // State variables for form inputs and error message
  const [email, setEmail] = useState(''); // Stores the email input
  const [password, setPassword] = useState(''); // Stores the password input
  const [errorMessage, setErrorMessage] = useState(''); // Stores the error message to display

  
  //handleSubmit function handles the form submission event
  
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setErrorMessage(''); // Clear any previous error messages

    try {
      // Attempt to log in user via POST request
      const response = await axios.post('http://localhost:4000/api/users/login', {
        email,
        password
      });
      onLoginSuccess(response.data.token); // Execute callback with token on success
      // Remove alert('Login successful!'); // Remove success alert
    } catch (error) {
      // Log error and handle different types of errors based on the HTTP status code
      console.error('Login failed:', error.response ? error.response.data.message : error.message);
      if (error.response) {
        switch (error.response.status) {
          case 404:
            setErrorMessage('User not found. Please check your email.'); // Handle non existing user
            break;
          case 401:
            setErrorMessage('Invalid password. Please try again.'); // Handle wrong password
            break;
          default:
            setErrorMessage('An error occurred. Please try again.'); // Handle other errors
            break;
        }
      }
    }
  };

  // Render the LoginForm component
  return (
    <>
      {/* Include a background video component */}
      <BackgroundVideo src="" />
      <Container fluid className="main-page-content">
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={8} lg={6} xl={5} className="text-center overlay">
            <h1 className="main-heading mb-4">Login</h1>
            <Form onSubmit={handleSubmit}>
              {errorMessage && <div id="error-message" style={{ color: 'red' }}>{errorMessage}</div>}
              <Form.Group className="mb-3">
                <Form.Control
                  size="lg"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-input mb-3"
                  id="email-input"
                />
                <Form.Control
                  size="lg"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-input mb-3"
                  id="password-input"
                />
                <Button variant="warning" size="lg" type="submit" className="w-100" id="login-button">
                  Login
                </Button>
              </Form.Group>
              <p>If you're not registered, please <Link to="/register">register</Link>.</p>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default LoginForm;
