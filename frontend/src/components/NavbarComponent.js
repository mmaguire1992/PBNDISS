import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { logout } from '../utils/authUtils';
import '../css/NavbarComponent.css';

// NavbarComponent to render the navigation bar
function NavbarComponent() {
    const isLoggedIn = !!localStorage.getItem('token'); // Check if user is logged in

    // Function to handle logout
    const handleLogout = () => {
        logout(); // Call logout function from authUtils
        window.location = '/login'; // Redirect to login page after logout
    };

    const logoPath = "/logo.png"; 

    // Render the navigation bar
    return (
        <Navbar expand="lg" className="custom-navbar" id="main-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/" className="navbar-brand-custom" id="navbar-brand">
                    <img
                        src={logoPath}
                        width="120"
                        height="auto"
                        className="d-inline-block align-top"
                        alt="Logo"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/" className="nav-link-custom" id="home-link">Home</Nav.Link>
                        <Nav.Link as={Link} to="/about-us" className="nav-link-custom" id="about-us-link">About Us</Nav.Link>
                        
                        {isLoggedIn && <Nav.Link as={Link} to="/image-picker" className="nav-link-custom" id="image-picker-link">Image Picker</Nav.Link>}
                        {isLoggedIn && <Nav.Link as={Link} to="/art-profile" className="nav-link-custom" id="art-profile-link">My Art Profile</Nav.Link>}
                        {isLoggedIn && <Nav.Link as={Link} to="/art-feed" className="nav-link-custom" id="art-feed-link">Art Feed</Nav.Link>}
                        
                        {!isLoggedIn ? (
                            <>
                                <Nav.Link as={Link} to="/login" className="nav-link-custom" id="login-link">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register" className="nav-link-custom" id="register-link">Register</Nav.Link>
                            </>
                        ) : (
                            <NavDropdown title="Account" id="basic-nav-dropdown" className="nav-link-custom">
                                <NavDropdown.Item as={Link} to="/delete-account" id="delete-account-link">Delete Account</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/change-password" id="change-password-link">Change Password</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout} id="logout-link">Logout</NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;
