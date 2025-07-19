import { create } from 'zustand';
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast';

const useUserStore = create((set) => ({
  users: [],
  addingUser: false,
  loadingUsers: false,

  getAllUsers: async () => {
    set({ loadingUsers: true });
    try {
      const res = await axiosInstance.get('/user/all');
      console.log(res);
      console.log(res.data.data);
      
      set({ users: res.data.data}); 
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      set({ loadingUsers: false });
    }
  },

  addUser: async (data) => {
    set({ addingUser: true });
    try {
      await axiosInstance.post('/user/create', data);
      toast.success('User Created Successfully');
      await useUserStore.getState().getAllUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to create user');
    } finally {
      set({ addingUser: false });
    }
  },


  updateUser: async (userId, data) => {
    set({ addingUser: true });
    try {
      await axiosInstance.patch(`/user/update/${userId}`, data);
      toast.success('User Updated Successfully');
      await useUserStore.getState().getAllUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      set({ addingUser: false });
    }
  },


  deleteUser: async (userId) => {
    try {
      await axiosInstance.delete(`/user/delete/${userId}`);
      toast.success('User Deleted Successfully');
      await useUserStore.getState().getAllUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  },
}));

export default useUserStore;
