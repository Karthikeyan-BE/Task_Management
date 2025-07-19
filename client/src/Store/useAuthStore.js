import { create } from 'zustand';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios';

const useAuthStore = create((set) => ({
  authUser: null,
  isAdmin: false,           
  isCheckingAuth: true,
  isLogin: false,


  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get('/auth/check');
      const user = res.data?.data;

      if (user) {
        set({
          authUser: user,
          isAdmin: user.role === 'admin',
        });
      } else {
        set({ authUser: null, isAdmin: false });
      }
    } catch (error) {
      console.error('CheckAuth Error:', error);
      set({ authUser: null, isAdmin: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },


  login: async (data) => {
    set({ isLogin: true });
    try {
      const res = await axiosInstance.post('/auth/login', data);
        await useAuthStore.getState().checkAuth();
        toast.success(res.data?.message);
    } catch (error) {
      console.error('Login Error:', error);
      const message = error?.response?.data?.message || 'Login failed';
      toast.error(message);
    } finally {
      set({ isLogin: false });
    }
  },

  logOut: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      toast.success('Logout Successfully');
    } catch (error) {
      console.error('Logout Error:', error);
      toast.error('Try Again!');
    } finally {
      set({ authUser: null, isAdmin: false });
    }
  },
}));

export default useAuthStore;
