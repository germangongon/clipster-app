import React, { createContext, useState, useEffect, useContext } from 'react';

// Crea el contexto de autenticación
const AuthContext = createContext();

// Componente de proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token).then((userData) => {
        setUser(userData);
        setIsAuthenticated(true);
      }).catch((err) => {
        console.error("Error verificando token:", err);
        setIsAuthenticated(false);
        setUser(null);
      });
    }
  }, []);

  const login = async (token) => {
    localStorage.setItem('token', token);

    try {
      const userData = await verifyToken(token); // Verifica el token y obtiene los datos del usuario
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Error verificando token:", err);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acceder al contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Función para verificar el token (puedes hacer una llamada a tu backend aquí)
const verifyToken = async (token) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/verify-token/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Token inválido o expirado');
    }

    const data = await response.json();
    return data.user; // Devuelve la información del usuario
  } catch (error) {
    throw new Error('No se pudo verificar el token');
  }
};
