import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar autenticación al cargar
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <div className={darkMode ? 'dark' : ''}>
        <Navbar 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
        />
        
        <Routes>
          <Route path="/" element={<Home darkMode={darkMode} isAuthenticated={isAuthenticated} />} />
          
          <Route 
            path="/login" 
            element={
              <Auth 
                darkMode={darkMode} 
                onLogin={handleLogin} 
                isLogin={true} 
              />
            } 
          />
          
          <Route 
            path="/register" 
            element={
              <Auth 
                darkMode={darkMode} 
                onLogin={handleLogin} 
                isLogin={false} 
              />
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard darkMode={darkMode} />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;