import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { logout } from '../utils/authUtils';

function NavbarComponent() {
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = (event) => {
    event.preventDefault();
    logout();
    window.location.href = "/";
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
      <Container>
        <Navbar.Brand as={Link} to="/">Paint By Numbers</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {isLoggedIn && <Nav.Link as={Link} to="/upload">Upload a Photo</Nav.Link>}
            {isLoggedIn && <Nav.Link as={Link} to="/results">Results</Nav.Link>}
            {isLoggedIn && <Nav.Link as={Link} to="/art-profile">My Art Profile</Nav.Link>}
            {!isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/" onClick={handleLogout}>Logout</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
