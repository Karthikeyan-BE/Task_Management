import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import useTaskStore from '../../store/useTaskStore';

const TaskComponent = () => {
  const {
    tasks,
    setTasks,
    updateTask,
    deleteTask,
    isUpdatingTask,
  } = useTaskStore();

  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    setTasks();
  }, [setTasks]);

  const handleUpdate = async () => {
    if (!editingTaskId) {
      toast.error('No task selected for update.');
      return;
    }

    if (!taskName.trim() || !taskDescription.trim() || !dueDate) {
      toast.error('Please fill in all fields.');
      return;
    }

    const data = {
      taskName: taskName.trim(),
      taskDescription: taskDescription.trim(),
      dueDate: new Date(dueDate),
      assignedUsers: [],
    };

    try {
      await updateTask(editingTaskId, data);
      handleCancelEdit();
      setTasks();
    } catch (error) {
        console.log(error);
        
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task._id);
    setTaskName(task.taskName);
    setTaskDescription(task.taskDescription);
    setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
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
        if (editingTaskId === taskId) {
          handleCancelEdit();
        }
        setTasks();
      } catch (error) {
       console.log(error);
       
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setTaskName('');
    setTaskDescription('');
    setDueDate('');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = (dueDateStr) => {
    if (!dueDateStr) return false;
    const now = new Date();
    const due = new Date(dueDateStr);
    return due < now;
  };

  return (
    <div className="w-full p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Task Manager</h2>
      {editingTaskId && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-600">Edit Task</h3>
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            <div className="flex-1">
              <label htmlFor="taskName" className="block text-sm font-medium text-gray-700">
                Task Name
              </label>
              <input
                id="taskName"
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                disabled={isUpdatingTask}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
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
                disabled={isUpdatingTask}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                placeholder="Enter task description"
              />
            </div>

            <div className="flex-1">
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isUpdatingTask}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4 flex-wrap">
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
              disabled={isUpdatingTask}
            >
              {isUpdatingTask ? 'Updating...' : 'Update Task'}
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <h3 className="text-xl font-semibold mb-4">All Tasks</h3>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks available.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {tasks.map((task) => {
            const overdue = isOverdue(task.dueDate);
            return (
              <div
                key={task._id}
                className="bg-gray-50 p-4 rounded-md flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-800">{task.taskName}</h4>
                  <p className="text-gray-600">{task.taskDescription}</p>
                  <p className={`text-sm text-gray-500 mt-1 ${overdue ? 'text-red-600 ' : 'text-green-600 '}`}>
                    Due: {formatDate(task.dueDate)}{' '}
                    <span className={`ml-2 font-medium ${overdue ? 'text-red-600 ' : 'text-green-600'}`}>
                      {overdue ? '⚠️ Overdue' : '✅ On Track'}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2 mt-3 md:mt-0">
                  <button
                    onClick={() => handleEdit(task)}
                    className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TaskComponent;
