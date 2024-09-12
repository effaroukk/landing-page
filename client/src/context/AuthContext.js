import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap your application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if the user is authenticated when the component mounts
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token with the backend
          const response = await axios.get('/api/auth/check', {
            headers: { 'x-auth-token': token },
          });

          if (response.data.success) {
            setUser(response.data.user);
          } else {
            logout();
          }
        } catch (error) {
          console.error('Error during authentication check', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Function to log in the user
  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        navigate('/dashboard'); // Redirect to dashboard on successful login
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error during login', error);
      return false;
    }
  };

  // Function to log out the user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the AuthContext to be used in other components
export default AuthContext;
