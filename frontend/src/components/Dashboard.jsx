import React, { useEffect, useState } from 'react';

const Dashboard = ({ darkMode }) => {
  const [links, setLinks] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLinks = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/links/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await response.json();
      setLinks(data);
    };
    fetchLinks();
  }, [token]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Your Shortened Links</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {links.map((link) => (
            <div
              key={link.id}
              className={`${
                darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
              } shadow-lg rounded-lg overflow-hidden border border-gray-200 p-6 flex flex-col justify-between`}
            >
              <div>
                <h3 className="text-lg font-semibold mb-4">Original URL</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4`}>
                  {link.original_url}
                </p>
                <h3 className="text-lg font-semibold mb-2">Shortened URL</h3>
                <a
                  href={link.short_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} truncate block mb-4`}
                >
                  {link.short_url}
                </a>
              </div>

              {/* Diseño creativo para los clicks */}
              <div className="flex justify-center mt-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex justify-center items-center shadow-2xl transform hover:scale-105 transition duration-300">
                    <span className="text-white font-extrabold text-2xl">{link.clicks}</span>
                  </div>
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-700 px-3 py-1 rounded-full shadow">
                    <span className="text-blue-600 dark:text-blue-300 font-semibold text-sm">Clicks</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
