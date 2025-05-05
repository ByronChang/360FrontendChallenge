
import axios from 'axios';
import { toast } from 'sonner';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:2999';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Always get the most current token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    
    if (error.response?.status === 401) {
      toast.error('Session expired. Please login again.');
      localStorage.removeItem('token');
      // Use window location instead of router to ensure a full page reload
      window.location.href = '/login';
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
