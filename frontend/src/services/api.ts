import axios from 'axios';
import toast from 'react-hot-toast';

const baseURL = '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginAttempt = error.config.url.includes('/token');
    
    if (isLoginAttempt) {
      return Promise.reject(error);
    } else if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    const message = error.response?.data?.detail || 'Что-то пошло не так';
    toast.error(message);
    
    return Promise.reject(error);
  }
);

export default api;
