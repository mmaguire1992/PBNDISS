import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Logout component to handle user logout
const Logout = () => {
  // Get navigate function from react-router-dom
  const navigate = useNavigate();
  const [error, setError] = useState(null); // New state for error handling

  // Effect hook to handle logout process
  useEffect(() => {
    // Function to send logout request to the server
    const handleLogout = async () => {
      try {
        // Send logout request to server
        const response = await fetch('http://localhost:4000/api/users/logout', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for authentication
        });

        // If logout successful
        if (response.ok) {
          // Remove token from local storage
          localStorage.removeItem('token');
          // Navigate to login page
          navigate('/login');
          // Show success message
          window.alert('Logout successful');
        } else {
          // If logout failed, set error state with the error message
          setError(`Logout failed: ${response.statusText}`);
        }
      } catch (error) {
        // If logout failed due to network or other errors, set error state with the error message
        setError(`Logout failed: ${error.message}`);
      }
    };

    // Call handleLogout function when component mounts
    handleLogout();
  }, [navigate]); // Re-run effect when navigate function changes

  //  message while logging out
  return (
    <div id="logout-component">
      {error ? (
        <div>Error: {error}</div>
      ) : (
        <div>Logging out...</div>
      )}
    </div>
  );
};

export default Logout;
