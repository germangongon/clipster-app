import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Home = ({ darkMode, isAuthenticated }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortenedLink, setShortenedLink] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidUrl(originalUrl)) {
      setError('Please enter a valid URL');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Token ${token}`;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/links/`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          original_url: originalUrl,
          custom_alias: customAlias || ''
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.custom_alias) {
          throw new Error(data.custom_alias[0]);
        }
        throw new Error(data.detail || 'Failed to shorten URL');
      }

      setShortenedLink(data.short_url.replace('/api/', '/'));
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto px-4 py-16 relative">
        {/* Glowing background behind the heading */}
        <div
          className={`absolute top-8 left-1/2 -translate-x-1/2 w-80 h-32 rounded-full blur-3xl opacity-30 pointer-events-none z-0 
          ${darkMode ? 'bg-indigo-500' : 'bg-purple-300'}`}
        ></div>

        <h1 className="relative z-10 text-center text-5xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
          Shorten. Share. Track.
        </h1>

        <p className="relative z-10 text-center text-lg md:text-xl mb-10 text-gray-900 dark:text-gray-300 max-w-2xl mx-auto">
          Convert long URLs into short, memorable, and trackable links. Totally free, with or without an account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 z-10 relative">
          <div className="space-y-3">
            <input
              type="url"
              placeholder="Paste your URL here"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              className={`w-full p-4 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 focus:ring-blue-500 text-white' 
                  : 'bg-white border-gray-300 focus:ring-blue-400'
              }`}
              required
            />
            <input
              type="text"
              placeholder="Custom alias (optional)"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              className={`w-full p-4 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 focus:ring-blue-500 text-white' 
                  : 'bg-white border-gray-300 focus:ring-blue-400'
              }`}
            />
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg transition"
          >
            🔗 Shorten Link
          </button>
        </form>

        {shortenedLink && (
          <div className={`mt-10 p-6 rounded-xl text-center border ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow'
          }`}>
            <p className="text-lg font-medium mb-2">Your shortened link:</p>
            <a
              href={shortenedLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xl font-semibold break-words ${
                darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
              }`}
            >
              {shortenedLink}
            </a>
            {!isAuthenticated && (
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Want to save your links and view statistics?{' '}
                <Link to="/register" className="text-blue-400 hover:underline">Sign up for free</Link>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
