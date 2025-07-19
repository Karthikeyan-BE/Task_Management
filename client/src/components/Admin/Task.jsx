import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import useTaskStore from '../../Store/useTaskStore';

const TaskComponent = () => {
  const {
    tasks,
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    isAddingTask,
    isUpdatingTask,
  } = useTaskStore();

  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    setTasks();
  }, [setTasks]);

  const handleSubmit = async () => {
    if (!taskName || !taskDescription) {
      toast.error('Please fill all fields!');
      return;
    }

    const data = {
      taskName,
      taskDescription,
      assignedUsers: [],
    };

    try {
      if (editingTaskId) {
        await updateTask(editingTaskId, data);
        toast.success('Task updated successfully!');
        setEditingTaskId(null);
      } else {
        await addTask(data);
        toast.success('Task created successfully!');
      }

      setTaskName('');
      setTaskDescription('');
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task._id);
    setTaskName(task.taskName);
    setTaskDescription(task.taskDescription);
  };

  const handleDelete = async (taskId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deleteTask(taskId);
        toast.success('Task deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete task.');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <Toaster position="top-right" />

      <h2 className="text-2xl font-bold mb-6 text-center">
        {editingTaskId ? 'Edit Task' : 'Create a Task'}
      </h2>

      {/* Inputs and Button in One Row */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-end">
        {/* Task Name */}
        <div className="flex-1">
          <label htmlFor="taskName" className="block text-sm font-medium text-gray-700">
            Task Name
          </label>
          <input
            id="taskName"
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task name"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700">
            Task Description
          </label>
          <input
            id="taskDescription"
            type="text"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task description"
          />
        </div>
        <div className="w-full md:w-auto">
          <button
            onClick={handleSubmit}
            className="mt-1 md:mt-6 w-full md:w-auto px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-all"
            disabled={isAddingTask || isUpdatingTask}
          >
            {editingTaskId
              ? isUpdatingTask ? 'Updating...' : 'Update Task'
              : isAddingTask ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </div>

      <hr className="my-6" />
      <h3 className="text-xl font-semibold mb-4">All Tasks</h3>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks created yet.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="p-4 border rounded-md shadow-sm flex justify-between items-center"
            >
              <div>
                <h4 className="text-lg font-bold">{task.taskName}</h4>
                <p className="text-gray-600">{task.taskDescription}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(task)}
                  className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskComponent;
