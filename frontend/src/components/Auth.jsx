import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = ({ darkMode, onLogin, isLogin = true }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Validaciones del formulario
        if (!formData.username.trim()) {
            setError('Username is required');
            return;
        }

        if (!formData.password) {
            setError('Password is required');
            return;
        }

        if (formData.username.length < 3) {
            setError('Username must be at least 3 characters long');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        if (!isLogin && !/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            setError('Username can only contain letters, numbers, and underscores');
            return;
        }
        
        const endpoint = isLogin ? '/api/auth/login/' : '/api/auth/register/';
    
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                if (data.username) {
                    throw new Error(`Username: ${data.username.join(', ')}`);
                }
                if (data.password) {
                    throw new Error(`Password: ${data.password.join(', ')}`);
                }
                if (data.non_field_errors) {
                    throw new Error(data.non_field_errors.join(', '));
                }
                throw new Error(data.detail || 'Authentication failed. Please try again.');
            }
    
            if (isLogin) {
                const token = data.token || data.key;
                if (!token) {
                    throw new Error('No token received from the server');
                }
                localStorage.setItem('token', token);
                onLogin(token);
                navigate('/dashboard');
            } else {
                navigate('/login');
            }
        } catch (err) {
            setError(err.message || 'An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="max-w-md mx-auto px-4 py-12">
                <h2 className="text-3xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>

                {error && (
                    <div className={`p-4 rounded-lg mb-6 ${
                        darkMode ? 'bg-red-900/50 text-red-200' : 'bg-red-50 text-red-600'
                    }`}>
                        <p className="text-center">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            className={`w-full p-4 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
                                darkMode 
                                    ? 'bg-gray-800 border-gray-700 focus:ring-blue-500 text-white' 
                                    : 'bg-white border-gray-300 focus:ring-blue-400'
                            }`}
                            required
                        />
                        {!isLogin && (
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Username must be at least 3 characters long and can only contain letters, numbers, and underscores
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className={`w-full p-4 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
                                darkMode 
                                    ? 'bg-gray-800 border-gray-700 focus:ring-blue-500 text-white' 
                                    : 'bg-white border-gray-300 focus:ring-blue-400'
                            }`}
                            required
                        />
                        {!isLogin && (
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Password must be at least 8 characters long
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                            darkMode 
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-gradient-to-r hover:from-blue-700 hover:to-indigo-700 text-white' 
                                : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 text-white'
                        }`}
                    >
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Auth;
