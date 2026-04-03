import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await api.post('/login', { email, password });
      localStorage.setItem('token', res.data.data.token);
      set({ user: res.data.data.user, token: res.data.data.token, loading: false });
      return true;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  register: async (name, email, password, password_confirmation) => {
    set({ loading: true });
    try {
      await api.post('/register', { name, email, password, password_confirmation });
      set({ loading: false });
      return true;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/logout');
    } catch (error) {}
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  fetchUser: async () => {
    const token = get().token;
    if (!token) return;
    try {
      const res = await api.get('/me');
      set({ user: res.data.data });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null });
    }
  },

  updateProfile: async (data) => {
    set({ loading: true });
    try {
      const res = await api.put('/me', data);
      set({ user: res.data.data, loading: false });
      return true;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  changePassword: async (current_password, password, password_confirmation) => {
    set({ loading: true });
    try {
      await api.put('/me/password', { current_password, password, password_confirmation });
      set({ loading: false });
      return true;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  deleteAccount: async () => {
    set({ loading: true });
    try {
      await api.delete('/me');
      localStorage.removeItem('token');
      set({ user: null, token: null, loading: false });
      return true;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  oauthLogin: (provider) => {
    window.location.href = `http://localhost:8000/api/auth/${provider}/redirect`;
  },

  handleOAuth: async (provider, code) => {
    set({ loading: true });
    try {
      const res = await api.get(`/auth/${provider}/callback`, { params: { code } });
      localStorage.setItem('token', res.data.data.token);
      set({ user: res.data.data.user, token: res.data.data.token, loading: false });
      return true;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  }
}));

export default useAuthStore;