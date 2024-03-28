import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
import ArtProfile from './pages/ArtProfile'; 
import MainPageBody from './components/MainPageBody'; 
import ImageDetail from './components/ImageDetail'; 
import NavbarComponent from './components/NavbarComponent'; 
import ResultsPage from './pages/ResultsPage'; 
import LoginPage from './pages/LoginPage'; 
import RegisterPage from './pages/RegisterPage'; 
import PrivateRoute from './utils/PrivateRoute'; 
import ImagePicker from './components/ImagePicker'; 
import PaintAlongPage from './pages/PaintAlongPage'; 
import HowTo from './components/HowTo'; 

function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="App">
      <Router>
        <NavbarComponent />
        <div className="pages">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/results" element={<PrivateRoute><ResultsPage /></PrivateRoute>} />
            <Route path="/login" element={isLoggedIn ? <Navigate replace to="/" /> : <LoginPage />} />
            <Route path="/register" element={isLoggedIn ? <Navigate replace to="/" /> : <RegisterPage />} />
            <Route path="/art-profile" element={<PrivateRoute><ArtProfile /></PrivateRoute>} />
            <Route path="/image-detail" element={<PrivateRoute><ImageDetail /></PrivateRoute>} />
            <Route path="/image-picker" element={<PrivateRoute><ImagePicker /></PrivateRoute>} />
            <Route path="/main" element={<PrivateRoute><MainPageBody /></PrivateRoute>} />
            <Route path="/paint-along" element={<PrivateRoute><PaintAlongPage /></PrivateRoute>} />
            <Route path="/how-to-use" element={<PrivateRoute><HowTo /></PrivateRoute>} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
