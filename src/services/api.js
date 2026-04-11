import axios from 'axios';
import useAuthStore from '../stores/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshed = await useAuthStore.getState().refreshAccessToken();
      if (refreshed) {
        const token = useAuthStore.getState().accessToken;
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default api;