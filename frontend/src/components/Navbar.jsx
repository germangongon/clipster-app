import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ darkMode, toggleDarkMode, isAuthenticated, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    navigate('/login');
  };

  return (
    <nav className={`${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-500 to-indigo-500'} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight bg-clip-text drop-shadow-md">
              Clipster
            </h1>
          </Link>

          <div className="flex items-center space-x-6">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-100'}`}
            >
              {darkMode ? '🌞' : '🌙'}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-lg text-white font-semibold transition duration-300 ease-in-out transform hover:scale-105 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-600'}`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className={`px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition duration-300 ease-in-out transform hover:scale-105`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-lg text-white font-semibold transition duration-300 ease-in-out transform hover:scale-105 ${darkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg text-white font-semibold transition duration-300 ease-in-out transform hover:scale-105 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                  Login
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
