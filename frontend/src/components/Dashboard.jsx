import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ darkMode }) => {
    const [links, setLinks] = useState([]);
    const [copiedLinks, setCopiedLinks] = useState({});
    const [deletingLink, setDeletingLink] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [linkToDelete, setLinkToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchLinks = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/links/`, {
                    headers: { Authorization: `Token ${token}` }
                });
                setLinks(response.data);
            } catch (error) {
                console.error('Error fetching links:', error);
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };

        fetchLinks();
    }, [navigate]);

    const copyToClipboard = async (link) => {
        try {
            const url = `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${link.custom_alias || link.short_code}`;
            await navigator.clipboard.writeText(url);
            setCopiedLinks(prev => ({ ...prev, [link.id]: true }));
            setTimeout(() => {
                setCopiedLinks(prev => ({ ...prev, [link.id]: false }));
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleDeleteClick = (link) => {
        setLinkToDelete(link);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!linkToDelete) return;

        try {
            setDeletingLink(linkToDelete.id);
            const token = localStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/links/${linkToDelete.id}/`, {
                headers: { Authorization: `Token ${token}` }
            });
            setLinks(links.filter(link => link.id !== linkToDelete.id));
        } catch (error) {
            console.error('Error deleting link:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            } else if (error.response?.status === 404) {
                console.error('Link not found or you do not have permission to delete it');
            }
        } finally {
            setDeletingLink(null);
            setShowDeleteModal(false);
            setLinkToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setLinkToDelete(null);
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Modal de confirmación */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`rounded-lg p-6 max-w-md w-full mx-4 ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                        <h3 className={`text-xl font-semibold mb-4 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                            Confirm Delete
                        </h3>
                        <p className={`mb-6 ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            Are you sure you want to delete this link? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleDeleteCancel}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    darkMode 
                                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={deletingLink === linkToDelete?.id}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    darkMode 
                                        ? 'bg-red-600 hover:bg-red-700 text-white disabled:opacity-50' 
                                        : 'bg-red-500 hover:bg-red-600 text-white disabled:opacity-50'
                                }`}
                            >
                                {deletingLink === linkToDelete?.id ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                        Your Links
                    </h1>
                    <button
                        onClick={() => navigate('/')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            darkMode 
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-gradient-to-r hover:from-blue-700 hover:to-indigo-700 text-white' 
                                : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 text-white'
                        }`}
                    >
                        Shorten New Link
                    </button>
                </div>

                {links.length === 0 ? (
                    <div className={`text-center py-12 rounded-lg ${
                        darkMode ? 'bg-gray-800' : 'bg-white shadow'
                    }`}>
                        <p className="text-lg mb-4">You haven't shortened any links yet</p>
                        <button
                            onClick={() => navigate('/')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                darkMode 
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-gradient-to-r hover:from-blue-700 hover:to-indigo-700 text-white' 
                                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 text-white'
                            }`}
                        >
                            Create Your First Link
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {links.map(link => (
                            <div 
                                key={link.id}
                                className={`rounded-lg p-6 transition-all duration-300 ${
                                    darkMode 
                                        ? 'bg-gray-800 hover:bg-gray-700' 
                                        : 'bg-white shadow hover:shadow-lg'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium ${
                                            darkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            Original URL
                                        </p>
                                        <p className="truncate break-words">
                                            {link.original_url}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteClick(link)}
                                        disabled={deletingLink === link.id}
                                        className={`ml-4 p-2 rounded-lg transition-colors ${
                                            darkMode 
                                                ? 'text-red-400 hover:bg-red-900/50 disabled:opacity-50' 
                                                : 'text-red-500 hover:bg-red-50 disabled:opacity-50'
                                        }`}
                                        title="Delete link"
                                    >
                                        🗑️
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium ${
                                            darkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            Shortened URL
                                        </p>
                                        <a
                                            href={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${link.custom_alias || link.short_code}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`truncate hover:underline ${
                                                darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                                            }`}
                                        >
                                            {import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/{link.custom_alias || link.short_code}
                                        </a>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(link)}
                                        className={`ml-4 p-2 rounded-lg transition-colors ${
                                            darkMode 
                                                ? 'text-blue-400 hover:bg-blue-900/50' 
                                                : 'text-blue-500 hover:bg-blue-50'
                                        }`}
                                        title="Copy to clipboard"
                                    >
                                        {copiedLinks[link.id] ? '✅' : '📋'}
                                    </button>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className={`text-sm font-semibold ${
                                            darkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            Clicks:
                                        </span>
                                        <span className={`text-lg font-bold ${
                                            darkMode ? 'text-blue-400' : 'text-blue-600'
                                        }`}>
                                            {link.clicks}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className={`text-sm ${
                                            darkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            Created: {new Date(link.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
