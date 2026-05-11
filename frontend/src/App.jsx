import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AuthSuccess from './pages/AuthSuccess';
import HeroesList from './pages/HeroesList';
import HeroDetail from './pages/HeroDetail';
import Events from './pages/Events';
import Matches from './pages/Matches';
import Members from './pages/Members';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import NotFound from './pages/NotFound';
import './styles/index.css';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/heroes" element={<HeroesList />} />
          <Route path="/heroes/:id" element={<HeroDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/members" element={<Members />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
