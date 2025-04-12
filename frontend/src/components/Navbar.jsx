import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ darkMode, toggleDarkMode, isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-500 to-indigo-500'} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
              darkMode 
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                : 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg'
            }`}>
              <span className={`text-2xl ${darkMode ? 'text-white' : 'text-white drop-shadow-md'}`}>🔗</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${
              darkMode 
                ? 'text-white' 
                : 'text-white drop-shadow-lg'
            }`}>
              Clipster
            </h1>
          </Link>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-lg ${darkMode ? 'text-white hover:bg-gray-700' : 'text-white hover:bg-indigo-600'}`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${darkMode ? 'text-white hover:bg-gray-700' : 'text-white hover:bg-indigo-600'}`}
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? '🌞' : '🌙'}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-lg text-white font-semibold transition duration-300 ease-in-out transform hover:scale-105 ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-600'
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-lg text-white font-semibold transition duration-300 ease-in-out transform hover:scale-105 ${
                    darkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-800 hover:bg-blue-900'
                  }`}
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg text-white font-semibold transition duration-300 ease-in-out transform hover:scale-105 ${
                    darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={toggleDarkMode}
              className={`w-full text-left px-3 py-2 rounded-lg ${darkMode ? 'text-white hover:bg-gray-700' : 'text-white hover:bg-indigo-600'}`}
            >
              {darkMode ? '🌞 Light mode' : '🌙 Dark mode'}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`block px-3 py-2 rounded-lg text-white font-semibold ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-600'
                  }`}
                >
                  📊 Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className={`block px-3 py-2 rounded-lg text-white font-semibold ${
                    darkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-800 hover:bg-blue-900'
                  }`}
                >
                  📝 Register
                </Link>
                <Link
                  to="/login"
                  className={`block px-3 py-2 rounded-lg text-white font-semibold ${
                    darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  🔑 Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
