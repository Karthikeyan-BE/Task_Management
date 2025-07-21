import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {X , Check, Trash2 } from 'lucide-react';
import useTaskStore from '../../store/useTaskStore';

const Taskdetail = () => {
  const { taskId } = useParams();
  const { task, setTask ,completeTask} = useTaskStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setTask(taskId); 
  }, [setTask]);

  useEffect(() => {
    const regex = new RegExp(searchTerm, 'i');
    const filtered = task.filter(item =>
      regex.test(item.name) || regex.test(item.email) || regex.test(item.staffId)
    );
    setFilteredData(filtered);
  }, [searchTerm, task]);

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Task Detail</h2>

      <div className="w-full max-w-2xl mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or staff ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-700 placeholder-gray-400"
        />
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full bg-white rounded-xl shadow-md">
          <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-gray-100 text-sm font-semibold text-gray-700">
            <div>Staff ID</div>
            <div>Name</div>
            <div>Email</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-5 gap-4 px-6 py-4 items-center text-gray-700 border-t hover:bg-gray-50 transition"
              >
                <div>{item.staffId}</div>
                <div>{item.name}</div>
                <div className="truncate">{item.email}</div>
                <div className={`${
                  item.status === 'completed'
                    ? 'text-green-600 font-medium'
                    : 'text-yellow-600 font-medium'} capitalize`
                }>
                  {item.status}
                </div>
                <div className='flex gap-4 items-center'>
                 {item.status === 'pending' && <button
                    className=" bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition"
                    title="Complete Task"
                    onClick={() => completeTask(taskId ,item._id)}
                  >
                    <Check size={17} />
                  </button> }
                  <button
                    className=" bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                    title="Remove user"
                    onClick={() => console.log(`Remove ${item.staffId}`)}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center px-6 py-6 text-gray-500">
              No matching results found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Taskdetail;
