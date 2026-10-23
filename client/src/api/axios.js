import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT token to all requests
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('farmkart_user');
  if (userInfo) {
    try {
      const parsed = JSON.parse(userInfo);
      if (parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch (e) {
      console.error('Failed to parse user info token:', e);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
