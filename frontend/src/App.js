import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ArtProfile from './pages/ArtProfile';
import NavbarComponent from './components/NavbarComponent';
import ResultsPage from './pages/ResultsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './utils/PrivateRoute';

function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="App">
      <Router>
        <NavbarComponent />
        <div className="pages">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/results" element={
              <PrivateRoute>
                <ResultsPage />
              </PrivateRoute>
            } />
            <Route path="/login" element={isLoggedIn ? <Navigate replace to="/" /> : <LoginPage />} />
            <Route path="/register" element={isLoggedIn ? <Navigate replace to="/" /> : <RegisterPage />} />
            <Route path="/art-profile" element={
              <PrivateRoute>
                <ArtProfile />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
