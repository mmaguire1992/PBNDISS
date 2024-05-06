import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// DeleteAccount component definition
const DeleteAccount = () => {
  // Initialising useNavigate hook
  const navigate = useNavigate();

  // Function to handle account deletion
  const handleDeleteAccount = async () => {
    // Display confirmation dialog before deleting account
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // Send delete request to delete account
        await axios.delete('http://localhost:4000/api/users/deleteAccount', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include authorisation token in request headers
          },
        });

        // Remove token from local storage
        localStorage.removeItem('token');
        // Set logout time in local storage
        localStorage.setItem('logout', Date.now());
        // Redirect user to home page
        navigate('/');
        // Alert user about successful account deletion
        alert('Account successfully deleted.');

        // Reload the page to reflect changes
        window.location.reload();
      } catch (error) {
        console.error('Failed to delete account:', error);
        // Alert user about failed account deletion
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  // Render the DeleteAccount component
  return (
    <div className="container mt-4">
      <div className="overlay"> 
        <h2>Delete Account</h2>
        <p>Once your account is deleted, it will be permanently removed.</p>
        <button className="btn btn-danger" onClick={handleDeleteAccount}>Delete My Account</button>
      </div>
    </div>
  );
};

export default DeleteAccount;