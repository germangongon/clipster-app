export const verifyToken = async (token) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/user/`, {
      headers: { 'Authorization': `Token ${token}` }
    });
  
    if (!response.ok) throw new Error('Token inválido');
  
    const user = await response.json();
    return user; // Devolver datos del usuario
  };