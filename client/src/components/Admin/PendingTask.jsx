import React, { useEffect } from 'react';
import useTaskStore from '../../Store/useTaskStore';

const PendingTaskComponent = () => {
  const { tasks, setTasks } = useTaskStore();

  useEffect(() => {
    setTasks();
  }, [setTasks]);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Tasks Overview</h2>

      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center">No tasks available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Task Name
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Total Assigned
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Total Completed
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Pending Users
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => {
                const assignedCount = task.assignedUsers.length;
                const completedCount = task.completedUsers.length;
                const pendingCount = assignedCount; // Because in your backend once a user completes, you pull them out of assignedUsers array

                return (
                  <tr key={task._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{task.taskName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{assignedCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-green-600 font-semibold">{completedCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-red-500 font-semibold">{pendingCount}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingTaskComponent;
