import { create } from 'zustand';
import api from '@/lib/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      set({ token, user, isLoading: false });
      
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  register: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/auth/register', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      set({ token, user, isLoading: false });
      
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed';
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },

  checkAuth: () => {
    const token = localStorage.getItem('token');
    if (token) {
      set({ token });
    }
  },
}));