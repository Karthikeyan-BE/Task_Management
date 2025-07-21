import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const useTaskStore = create((set) => ({
  users: [],
  tasks: [],
  task:[],
  selectedDepartment: null,
  isAddingTask: false,
  isUpdatingTask: false,

  setUsers: async () => {
    try {
      const res = await axiosInstance.get("/user/all");
      set({ users: res.data.data || res.data });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to fetch users";
      toast.error(errorMessage);
    }
  },

  setTasks: async () => {
    try {
      const res = await axiosInstance.get("/task/");
      set({ tasks: res.data.data || res.data });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to fetch tasks.";
      toast.error(errorMessage);
    }
  },

  addTask: async (data) => {
    try {
      set({ isAddingTask: true });
      await axiosInstance.post("/task/", data);
      toast.success("Task Added Successfully");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to add task.";
      toast.error(errorMessage);
    } finally {
      set({ isAddingTask: false });
    }
  },

  updateTask: async (taskId, data) => {
    try {
      set({ isUpdatingTask: true });
      await axiosInstance.put(`/task/${taskId}`, data);
      toast.success("Task Updated Successfully");
      await useTaskStore.getState().setTasks();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to update task.";
      toast.error(errorMessage);
    } finally {
      set({ isUpdatingTask: false });
    }
  },

  deleteTask: async (taskId) => {
    try {
      await axiosInstance.delete(`/task/${taskId}`);
      toast.success("Task Deleted Successfully");
      await useTaskStore.getState().setTasks();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to delete task.";
      toast.error(errorMessage);
    }
  },

  setSelectedDepartment: async (dep) => {
    if (!dep || !dep.value) return;
    try {
      set({ selectedDepartment: dep });
      const res = await axiosInstance.get(`/user/department/${dep.value}`);
      set({ users: res.data.data || res.data });
      toast.success("Department users fetched!");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to fetch department users.";
      toast.error(errorMessage);
    }
  },

  downloadTask: async (task) => {
    try {
      const response = await axiosInstance.get(`/task/report/${task._id}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${task.taskName}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      toast.error("Failed to download task report");
    }
  },

  setTask: async (id) => {
    try {
      const res = await axiosInstance.get(`/task/${id}`);
      set({ task:  res.data.users });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to fetch task.";
      toast.error(errorMessage);
    }
  },

  completeTask: async (taskId, userId) => {
    try {
      await axiosInstance.patch(`/task/complete/${taskId}`, { userId });
      toast.success("Task Status Updated");
      await useTaskStore.getState().setTask(taskId);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to update task.";
      toast.error(errorMessage);
    }
  },
}));

export default useTaskStore;
