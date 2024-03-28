import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { logout } from '../utils/authUtils';
import '../css/NavbarComponent.css';

// NavbarComponent to render the navigation bar
function NavbarComponent() {
    const isLoggedIn = !!localStorage.getItem('token'); // Check if user is logged in

    // Function to handle logout
    const handleLogout = () => {
        logout(); // Call logout function from authUtils
    };

    const logoPath = "/logo.png"; // Path to the logo image

    // Render the navigation bar
    return (
        <Navbar expand="lg" className="custom-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">
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
                        <Nav.Link as={Link} to="/" className="nav-link-custom">Home</Nav.Link>
                        <Nav.Link as={Link} to="/how-to-use" className="nav-link-custom">How To Use</Nav.Link>
                        {isLoggedIn && <Nav.Link as={Link} to="/image-picker" className="nav-link-custom">Image Picker</Nav.Link>}
                        {isLoggedIn && <Nav.Link as={Link} to="/results" className="nav-link-custom">Results</Nav.Link>}
                        {isLoggedIn && <Nav.Link as={Link} to="/art-profile" className="nav-link-custom">My Art Profile</Nav.Link>}
                        {!isLoggedIn ? (
                            <>
                                <Nav.Link as={Link} to="/login" className="nav-link-custom">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register" className="nav-link-custom">Register</Nav.Link>
                            </>
                        ) : (
                            <Nav.Link onClick={handleLogout} className="nav-link-custom">Logout</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;
