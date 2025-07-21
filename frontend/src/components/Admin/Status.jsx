import  { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 , Download, Info } from 'lucide-react';
import useTaskStore from '../../store/useTaskStore';
import Loading from '../Loading';  

const CompletedTasks = () => {
  const navigate = useNavigate()
  const {setTasks, tasks, loadingTasks , downloadTask } = useTaskStore();

  useEffect(() => {
    setTasks(); 
  }, [setTasks]);

  const handleDelete = async (taskId) => {
    await deleteTask(taskId);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Completed Tasks</h2>

      {loadingTasks ? (
        <Loading /> 
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
                {tasks.map((task) => (
                  <tr key={task._id} className="border-b">
                    <td className="py-2 px-4">{task.taskName}</td>
                    <td className="py-2 px-4">{task.assignedUsers.length}</td>
                    <td className="py-2 px-4">{task.completedUsers.length}</td>
                    <td className="py-2 px-4">{task.pendingUsers.length}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 mx-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => downloadTask(task)}
                        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 mx-2"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => navigate(`/${task._id}`)}
                        className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                      >
                        <Info className="w-5 h-5" />
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
