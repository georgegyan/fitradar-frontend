import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: async (username, password) => {
        try {
          const response = await api.post('/auth/login/', { username, password });
          const { access, refresh, user } = response.data;
          set({
            user,
            accessToken: access,
            isAuthenticated: true,
          });
          localStorage.setItem('refreshToken', refresh);
          return { success: true };
        } catch (error) {
          return { success: false, error: error.response?.data?.detail || 'Login failed' };
        }
      },

      register: async (userData) => {
        try {
          await api.post('/auth/register/', userData);
          return { success: true };
        } catch (error) {
          return { success: false, error: error.response?.data || 'Registration failed' };
        }
      },

      logout: () => {
        set({ user: null, accessToken: null, isAuthenticated: false });
        localStorage.removeItem('refreshToken');
      },

      refreshAccessToken: async () => {
        const refresh = localStorage.getItem('refreshToken');
        if (!refresh) return false;
        try {
          const response = await api.post('/auth/token/refresh/', { refresh });
          set({ accessToken: response.data.access });
          return true;
        } catch {
          get().logout();
          return false;
        }
      },

      isGymOwner: () => {
        const state = get();
        return state.user?.is_gym_owner == true;
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;