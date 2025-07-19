import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const useTaskStore = create((set) => ({
  users: [],
  tasks: [],
  selectedDepartment: null,
  isAddingTask: false,
  isUpdatingTask: false,

  setUsers: async () => {
    try {
      const res = await axiosInstance.get("/user/all");
      set({ users: res.data.data });
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to Fetch Users";
      toast.error(errorMessage);
    }
  },

  setTasks: async () => {
    try {
      const res = await axiosInstance.get("/task/getAll");
      set({ tasks: res.data.data });
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.message || "Failed to fetch tasks.";
      toast.error(errorMessage);
    }
  },

  addTask: async (data) => {
    console.log(data);
    
    try {
      set({ isAddingTask: true });
      await axiosInstance.post("/task/create", data);
      toast.success("Task Added Successfully");
      await useTaskStore.getState().setTasks(); // Refresh tasks
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.message || "Failed to add task.";
      toast.error(errorMessage);
    } finally {
      set({ isAddingTask: false });
    }
  },

  updateTask: async (taskId, data) => {
    try {
      set({ isUpdatingTask: true });
      await axiosInstance.put(`/task/update/${taskId}`, data);
      toast.success("Task Updated Successfully");
      await useTaskStore.getState().setTasks(); // Refresh tasks
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.message || "Failed to update task.";
      toast.error(errorMessage);
    } finally {
      set({ isUpdatingTask: false });
    }
  },

  deleteTask: async (taskId) => {
    try {
      await axiosInstance.delete(`/task/delete/${taskId}`);
      toast.success("Task Deleted Successfully");
      await useTaskStore.getState().setTasks(); // Refresh tasks
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.message || "Failed to delete task.";
      toast.error(errorMessage);
    }
  },

  setSelectedDepartment: async (dep) => {
    try {
      set({ selectedDepartment: dep });
      const res = await axiosInstance.get(`/user/department/${dep.value}`);
      set({ users: res.data.data });
      toast.success("Department users fetched!");
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.message || "Failed to fetch department users.";
      toast.error(errorMessage);
    }
  },
}));

export default useTaskStore;
