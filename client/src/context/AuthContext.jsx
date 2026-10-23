import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('farmkart_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If no user is logged in, default to the demo farmer account for seamless initial experience
    if (!user) {
      autoLoginDefaultFarmer();
    }
  }, []);

  const autoLoginDefaultFarmer = async () => {
    try {
      const { data } = await API.post('/auth/login', {
        email: 'farmer@farmkart.com',
        password: 'farmer123',
      });
      setUser(data);
      localStorage.setItem('farmkart_user', JSON.stringify(data));
    } catch (err) {
      console.warn('Auto demo login skipped:', err.message);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('farmkart_user', JSON.stringify(data));
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your credentials.',
      };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', userData);
      setUser(data);
      localStorage.setItem('farmkart_user', JSON.stringify(data));
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.',
      };
    }
  };

  const updateProfile = async (updatedFields) => {
    try {
      const { data } = await API.put('/auth/profile', updatedFields);
      setUser(data);
      localStorage.setItem('farmkart_user', JSON.stringify(data));
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile',
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('farmkart_user');
  };

  // Quick switch role between Farmer and Admin for presentation/evaluations
  const quickSwitchRole = async (targetRole) => {
    try {
      if (targetRole === 'admin') {
        const { data } = await API.post('/auth/login', {
          email: 'admin@farmkart.com',
          password: 'admin123',
        });
        setUser(data);
        localStorage.setItem('farmkart_user', JSON.stringify(data));
        return data;
      } else {
        const { data } = await API.post('/auth/login', {
          email: 'farmer@farmkart.com',
          password: 'farmer123',
        });
        setUser(data);
        localStorage.setItem('farmkart_user', JSON.stringify(data));
        return data;
      }
    } catch (error) {
      console.error('Failed to switch role:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        updateProfile,
        logout,
        quickSwitchRole,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
