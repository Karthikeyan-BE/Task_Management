import React, { useEffect } from 'react';
import { CheckCircle, Trash2 } from 'lucide-react';
import useTaskStore from '../../Store/useTaskStore';
import Loading from '../Loading';  

const CompletedTasks = () => {
  const { tasks, setTasks, loadingTasks, deleteTask } = useTaskStore();

  useEffect(() => {
    setTasks(); 
  }, [setTasks]);

  const completedTasks = tasks.filter(task => task.status === 'completed');

  const handleDelete = async (taskId) => {
    await deleteTask(taskId);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Completed Tasks</h2>

      {loadingTasks ? (
        <Loading /> 
      ) : completedTasks.length === 0 ? (
        <p>No completed tasks found.</p>
      ) : (
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-4">Task List</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-2 px-4">Task Name</th>
                  <th className="py-2 px-4">Assigned Users</th>
                  <th className="py-2 px-4">Completed Users</th>
                  <th className="py-2 px-4">Pending Users</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {completedTasks.map((task) => (
                  <tr key={task._id} className="border-b">
                    <td className="py-2 px-4">{task.name}</td>
                    <td className="py-2 px-4">{task.assignedUsers.length}</td>
                    <td className="py-2 px-4">{task.completedUsers.length}</td>
                    <td className="py-2 px-4">{task.assignedUsers.length - task.completedUsers.length}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedTasks;
