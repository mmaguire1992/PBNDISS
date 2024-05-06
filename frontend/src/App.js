import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ArtProfile from './pages/ArtProfile';
import MainPageBody from './components/Homepage/MainPageBody';
import ImageDetail from './pages/ImageDetail';
import NavbarComponent from './components/NavbarComponent';
import ResultsPage from './pages/ResultsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './utils/PrivateRoute';
import ImagePicker from './pages/ImagePicker';
import PaintAlongPage from './pages/PaintAlongPage';
import PaintAlongGuide from "./components/PaintAlong/PaintAlongGuide";
import ChangePassword from './pages/ChangePassword';
import DeleteAccount from './pages/DeleteAccount';
import HowTo from './components/Homepage/HowTo';
import ArtFeed from './pages/ArtFeed';
import Footer from './components/Footer';
import AboutUs from './pages/AboutUs'; 

function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="App">
      <Router>
        <NavbarComponent />
        <div className="pages">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/results" element={<PrivateRoute><ResultsPage /></PrivateRoute>} />
            <Route path="/login" element={isLoggedIn ? <Navigate replace to="/" /> : <LoginPage />} />
            <Route path="/register" element={isLoggedIn ? <Navigate replace to="/" /> : <RegisterPage />} />
            <Route path="/art-profile" element={<PrivateRoute><ArtProfile /></PrivateRoute>} />
            <Route path="/image-detail" element={<PrivateRoute><ImageDetail /></PrivateRoute>} />
            <Route path="/image-picker" element={<PrivateRoute><ImagePicker /></PrivateRoute>} />
            <Route path="/main" element={<PrivateRoute><MainPageBody /></PrivateRoute>} />
            <Route path="/paint-along" element={<PrivateRoute><PaintAlongPage /></PrivateRoute>} />
            <Route path="/how-to-use" element={<HowTo />} />
            <Route path="/guide" element={<PaintAlongGuide />} />
            <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
            <Route path="/delete-account" element={<PrivateRoute><DeleteAccount /></PrivateRoute>} />
            <Route path="/art-feed" element={<PrivateRoute><ArtFeed /></PrivateRoute>} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
