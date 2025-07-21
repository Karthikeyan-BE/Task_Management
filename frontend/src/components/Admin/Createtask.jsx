import { useState, useEffect } from 'react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import useTaskStore from '../../store/useTaskStore'

const departments = [
  'Aeronautical Engineering',
  'Agricultural Engineering',
  'Artificial Intelligence & Data Science',
  'Biomedical Engineering',
  'Civil Engineering',
  'Computer Science and Business System',
  'Computer Science & Engineering',
  'Electrical and Electronics Engineering',
  'Electronics & Communication Engineering',  
  'Food Technology',
  'Information Technology',
  'Mechanical Engineering',
  'Petrochemical Technology',
  'Safety & Fire Engineering',
  'Science & Humanities',
];

const TaskComponent = () => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [dueDate, setDueDate] = useState('');  

  const { users, selectedDepartment, setUsers, addTask, setSelectedDepartment } = useTaskStore();

  useEffect(() => {
    setUsers(); 
  }, [setUsers]);

  const userOptions = users.map(user => ({
    value: user._id,
    label: `${user.name} (${user.staffId})`,
  }));

  const handleAddTask = async () => {

    if (!taskName || !taskDescription || assignedUsers.length === 0 || !dueDate) {
      toast.error('Please fill all fields including due date.');
      return;
    }

    const data = {
      taskName,
      taskDescription,
      assignedUsers: assignedUsers.map(user => user.value),
      dueDate,  
    };

      await addTask(data);
      setTaskName('');
      setTaskDescription('');
      setAssignedUsers([]);
      setDueDate('');  
      setSelectedDepartment('');
  };

  const handleSelectAllUsers = () => {
    setAssignedUsers(userOptions);
  };

  return (
    <div className="max-w-lg mx-auto p-6 m-15 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Create a Task</h2>

      <div className="mb-4">
        <label htmlFor="taskName" className="block text-sm font-medium text-gray-700">Task Name</label>
        <input
          id="taskName"
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter task name"
        />
      </div>

 
      <div className="mb-4">
        <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700">Task Description</label>
        <textarea
          id="taskDescription"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter task description"
        />
      </div>

  
      <div className="mb-4">
        <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
        <Select
          id="department"
          value={selectedDepartment}
          onChange={(option) => setSelectedDepartment(option)}
          options={departments.map(dep => ({ value: dep, label: dep }))}
          placeholder="Select department"
          className="mt-1"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="users" className="block text-sm font-medium text-gray-700">Users</label>
        <Select
          id="users"
          isMulti
          value={assignedUsers}
          onChange={setAssignedUsers}
          options={userOptions}
          placeholder="Select users"
          className="mt-1"
        />
        <button
          type="button"
          onClick={handleSelectAllUsers}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          Select All Users
        </button>
      </div>


      <div className="mb-4">
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          min={new Date().toISOString().split('T')[0]} 
        />
      </div>


      <button
        onClick={() => handleAddTask()}
        className="w-full py-2 mt-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
      >
        Add Task
      </button>
    </div>
  );
};

export default TaskComponent;
