import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Home = ({ darkMode, isAuthenticated }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortenedLink, setShortenedLink] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCopied(false);

    // Validación de URL
    if (!originalUrl) {
      setError('Please enter a URL to shorten');
      return;
    }

    if (originalUrl.length > 2048) {
      setError('URL is too long. Maximum length is 2048 characters.');
      return;
    }

    if (!isValidUrl(originalUrl)) {
      setError('Please enter a valid URL. Make sure it starts with http:// or https://');
      return;
    }

    // Validación de custom alias
    if (customAlias) {
      if (customAlias.length < 3) {
        setError('Custom alias must be at least 3 characters long');
        return;
      }
      if (customAlias.length > 50) {
        setError('Custom alias is too long. Maximum length is 50 characters.');
        return;
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(customAlias)) {
        setError('Custom alias can only contain letters, numbers, underscores (_) and hyphens (-)');
        return;
      }
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
          throw new Error(`Custom alias "${customAlias}" is already taken. Please choose a different one.`);
        }
        if (data.original_url) {
          throw new Error('Invalid URL format. Please check and try again.');
        }
        throw new Error(data.detail || 'Failed to shorten URL. Please try again.');
      }

      setShortenedLink(data.short_url.replace('/api/', '/'));
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortenedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
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
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
      <div className="max-w-4xl mx-auto px-4 py-16 relative">
        {/* Glowing background behind the heading */}
        <div
          className={`absolute top-8 left-1/2 -translate-x-1/2 w-80 h-32 rounded-full blur-3xl opacity-30 pointer-events-none z-0 
          ${darkMode ? 'bg-indigo-500' : 'bg-purple-300'}`}
        ></div>

        <h1 className="relative z-10 text-center text-5xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
          Shorten. Share. Track.
        </h1>

        <p className="relative z-20 text-center text-lg md:text-xl mb-10 text-black dark:text-gray-500 max-w-2xl mx-auto">
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

          {error && (
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-red-900/50 text-red-200' : 'bg-red-50 text-red-600'
            }`}>
              <p className="text-center">{error}</p>
            </div>
          )}

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
            <div className="flex items-center justify-center gap-2">
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
              <button
                onClick={copyToClipboard}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Copy to clipboard"
              >
                {copied ? '✅' : '📋'}
              </button>
            </div>
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
