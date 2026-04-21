import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import Cookies from 'js-cookie';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      // Get CSRF token from cookies (set by Django)
      getCsrfToken: () => Cookies.get('csrftoken'),

      // Register
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/users/register/', userData);
          // After registration, automatically log in
          await get().login({
            username: userData.username,
            password: userData.password,
          });
          return response.data;
        } catch (error) {
          const errorMsg = error.response?.data || { error: 'Registration failed' };
          set({ error: errorMsg, isLoading: false });
          throw errorMsg;
        }
      },

      // Login
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          // Ensure CSRF token is sent (Django requires it)
          const csrfToken = get().getCsrfToken();
          const response = await api.post('/users/login/', credentials, {
            headers: { 'X-CSRFToken': csrfToken },
          });
          set({ user: response.data, isLoading: false, error: null });
          return response.data;
        } catch (error) {
          const errorMsg = error.response?.data || { error: 'Login failed' };
          set({ error: errorMsg, isLoading: false });
          throw errorMsg;
        }
      },

      // Logout
      logout: async () => {
        set({ isLoading: true });
        try {
          await api.post('/users/logout/');
          set({ user: null, isLoading: false, error: null });
        } catch (error) {
          console.error('Logout error', error);
          set({ user: null, isLoading: false }); // force clear
        }
      },

      // Check if user is gym owner
      isGymOwner: () => get().user?.is_gym_owner === true,
    }),
    {
      name: 'auth-storage', // localStorage key
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;