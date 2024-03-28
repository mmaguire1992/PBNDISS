import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import BackgroundVideo from './BackgroundVideo';
import '../css/MainPageBody.css';

const RegisterForm = ({ onRegisterSuccess }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4000/api/users/signup', { name, email, password });
            onRegisterSuccess();
            // alert for successful registration 
            alert('Registration successful!');
        } catch (error) {
            console.error('Signup failed:', error.response ? error.response.data.message : 'An error occurred. Please try again.');
        }
    };

    return (
        <>
            <BackgroundVideo src="/Users/michaelmaguire/Library/Mobile Documents/com~apple~CloudDocs/new PbnDss/PBNDiss/frontend/public/production_id_4825102 (2160p).mp4" />
            <Container fluid className="main-page-content">
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col md={8} lg={6} xl={5} className="text-center overlay">
                        <Form onSubmit={handleSubmit}>
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
                                />
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
