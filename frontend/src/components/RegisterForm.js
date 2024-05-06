import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Form, Alert } from 'react-bootstrap';
import BackgroundVideo from './BackgroundVideo';
import '../css/MainPageBody.css';

// Component for user registration form
const RegisterForm = ({ onRegisterSuccess }) => {
    // State variables for user input and error handling
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Preventing default form submission behavior
        try {
            await axios.post('http://localhost:4000/api/users/signup', { name, email, password }); // Making POST request to signup endpoint
            onRegisterSuccess(); // Calling callback function on successful registration
            alert('Registration successful!'); // Showing alert for successful registration
        } catch (error) {
            console.error('Signup failed:', error.response ? error.response.data.message : 'An error occurred. Please try again.'); 
        }
    };

    // Function to handle password change and validation
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value; // Getting new password value
        setPassword(newPassword); // Updating password state
        if (!validatePassword(newPassword)) { // Validating password
            setPasswordError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'); // Setting password error message
        } else {
            setPasswordError(''); // Clearing password error message if password is valid
        }
    };

    // Function to validate password
    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Password regex for validation
        return passwordRegex.test(password); // Checking if password matches regex pattern
    };

    // Render register form component
    return (
        <>
            <BackgroundVideo src="/path/to/your/video.mp4" /> 
            <Container fluid className="main-page-content" id="register-form-container"> 
                <Row className="justify-content-center align-items-center min-vh-100"> 
                    <Col md={8} lg={6} xl={5} className="text-center overlay"> 
                        <Form onSubmit={handleSubmit} id="register-form"> 
                            <h2 className="main-heading mb-4">Signup</h2> 
                            <Form.Group className="mb-3"> 
                                <Form.Control
                                    size="lg"
                                    type="text"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="text-input mb-3"
                                    id="name-input"
                                /> {/* Input for name */}
                                <Form.Control
                                    size="lg"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="text-input mb-3"
                                    id="email-input"
                                /> {/* Input for email */}
                                <Form.Control
                                    size="lg"
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    required
                                    className="text-input mb-3"
                                    id="password-input"
                                /> 
                                {passwordError && ( // Display password error message if present
                                    <Alert variant="danger" id="password-error-alert">
                                        {passwordError}
                                    </Alert>
                                )}
                                <Button variant="warning" size="lg" type="submit" className="w-100" id="signup-button">
                                    Signup
                                </Button> 
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default RegisterForm; 