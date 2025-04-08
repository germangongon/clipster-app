import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = ({ darkMode, onLogin, isLogin = true }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        const endpoint = isLogin ? '/api/auth/login/' : '/api/auth/register/';
    
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.detail || data.error || 'Authentication failed');
            }
    
            if (isLogin) {
                const token = data.token || data.key;
                if (!token) {
                    throw new Error('No token received from the server');
                }
                localStorage.setItem('token', token); // ✅ now it's defined
                onLogin(token); // ✅ calls AuthContext
                navigate('/dashboard');
            } else {
                // After successful registration
                navigate('/login');
            }
        } catch (err) {
            setError(err.message || 'Authentication error');
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="max-w-md mx-auto px-4 py-12">
                <h2 className="text-3xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
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
