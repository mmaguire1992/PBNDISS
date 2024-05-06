import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import BackgroundVideo from '../components/BackgroundVideo'; 

// ChangePassword component definition
const ChangePassword = () => {
  // State variables
  const [currentPassword, setCurrentPassword] = useState(''); 
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState(''); 
  const [error, setError] = useState(null); 
  const navigate = useNavigate(); 

  // Function to handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault(); // Prevent default form submission behaviour
    const token = localStorage.getItem('token'); // Get token from local storage
    console.log('Token:', token); // Log token to console

    if (!token) {
      setError('You are not logged in.'); // Set error message if user is not logged in
      return;
    }

    try {
      // Validate new password format before making the request
      if (!validatePassword(newPassword)) {
        setError('New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.');
        return;
      }

      // Validate that the new password matches the confirmed new password
      if (newPassword !== confirmNewPassword) {
        setError('New password and confirmed password do not match.');
        return;
      }

      // Make patch request to change password
      const response = await axios.patch('http://localhost:4000/api/users/changePassword', {
        currentPassword,
        newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Password change response:', response.data); // Log password change response to console
      alert('Password successfully changed!'); // Alert user about successful password change
      navigate('/'); // Redirect user to home page
    } catch (error) {
      setError('Failed to change password. Please try again.'); // Set error message if password change fails
      console.error('Password change error:', error.response.data); // Log password change error to console
    }
  };

  // Function to validate password format
  const validatePassword = (password) => {
    // Define regex for password validation (at least 8 characters, one uppercase letter, one lowercase letter, one digit, one special character)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password); // Return true if password matches regex, false otherwise
  };

  // Render the ChangePassword component
  return (
    <>
      <BackgroundVideo /> {/* Background video component */}
      <Container id="change-password-container" fluid className="main-page-content">
        <Row id="change-password-row" className="justify-content-center align-items-center min-vh-100">
          <Col id="change-password-col" md={8} lg={6} xl={5} className="text-center overlay">
            <div id="change-password-content" className="change-password-container">
                 <h1 id="change-password-heading" className="main-heading mb-4">Login</h1>
              {error && <Alert id="change-password-alert" variant="danger">{error}</Alert>} 
              <Form id="change-password-form" className="change-password-form" onSubmit={handleChangePassword}>
              
                <div className="password-input">
                  <Form.Label htmlFor="currentPassword">Current Password</Form.Label>
                  <Form.Control
                    id="currentPassword"
                    className="password-field"
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)} // Update current password state on change
                  />
                </div>
                {/* Input field for new password */}
                <div className="password-input">
                  <Form.Label htmlFor="newPassword">New Password</Form.Label>
                  <Form.Control
                    id="newPassword"
                    className="password-field"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)} // Update new password state on change
                  />
                </div>
                {/* Input field for confirming new password */}
                <div className="password-input">
                  <Form.Label htmlFor="confirmNewPassword">Confirm New Password</Form.Label>
                  <Form.Control
                    id="confirmNewPassword"
                    className="password-field"
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)} // Update confirm new password state on change
                  />
                </div>
               
                <Button id="change-password-button" variant="warning" type="submit" className="change-password-button">Change Password</Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ChangePassword;
