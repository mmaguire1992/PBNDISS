import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BackgroundVideo from './BackgroundVideo';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import '../css/MainPageBody.css';

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const response = await axios.post('http://localhost:4000/api/users/login', { email, password });
      onLoginSuccess(response.data.token);
      // Alert for successful login here
      alert('Login successful!');
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data.message : error.message);
      setErrorMessage(error.response ? error.response.data.message : 'An error occurred. Please try again.');
    }
  };

  return (
    <>
      <BackgroundVideo src="/Users/michaelmaguire/Library/Mobile Documents/com~apple~CloudDocs/new PbnDss/PBNDiss/frontend/public/robots.txt" />
      <Container fluid className="main-page-content">
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={8} lg={6} xl={5} className="text-center overlay">
            <h1 className="main-heading mb-4">Login</h1>
            <Form onSubmit={handleSubmit}>
              {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
              <Form.Group className="mb-3">
                <Form.Control
                  size="lg"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-input mb-3"
                />
                <Form.Control
                  size="lg"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-input mb-3"
                />
                <Button variant="warning" size="lg" type="submit" className="w-100">
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
};

export default LoginForm;
