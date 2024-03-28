export const logout = () => { // Define logout function
  localStorage.removeItem('token'); // Remove token from localStorage
  window.location.href = '/login'; // Redirect to login page
};
