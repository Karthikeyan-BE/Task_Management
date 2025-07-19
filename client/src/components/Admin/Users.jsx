import React, { useEffect, useState } from 'react';
import useUserStore from '../../Store/useUserStore';
import { Edit, Trash2, Search, User, Mail, Hash, Calendar } from 'lucide-react';  
import Swal from 'sweetalert2'; 
// import Loading from '../../Components/Loading'; // Uncomment if needed

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

const Users = () => {
  const {
    users,
    getAllUsers,
    addUser,
    deleteUser,
    updateUser,
    loadingUsers,
    addingUser,
  } = useUserStore();

  const [formData, setFormData] = useState({
    staffId: '',
    name: '',
    email: '',
    department: '',
  });
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  useEffect(() => {
    const filtered = users.filter((user) => {
      const matchesDepartment = selectedDepartment ? user.department === selectedDepartment : true;
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.staffId.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesDepartment && matchesSearch;
    });

    setFilteredUsers(filtered);
  }, [searchTerm, selectedDepartment, users]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!formData.staffId || !formData.name || !formData.email || !formData.department) {
      Swal.fire('Error', 'Please fill all fields', 'error');
      return;
    }

    await addUser(formData);
    setFormData({ staffId: '', name: '', email: '', department: '' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.staffId || !formData.name || !formData.email || !formData.department) {
      Swal.fire('Error', 'Please fill all fields', 'error');
      return;
    }

    await updateUser(selectedUserId, formData);
    setFormData({ staffId: '', name: '', email: '', department: '' });
    setSelectedUserId(null);
  };

  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      await deleteUser(userId);
    }
  };

  const handleSelectUserForUpdate = (user) => {
    setFormData({
      staffId: user.staffId,
      name: user.name,
      email: user.email,
      department: user.department,
    });
    setSelectedUserId(user._id);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      {/* Add or Update User Form */}
      <form onSubmit={selectedUserId ? handleUpdate : handleAddUser} className="bg-white p-4 rounded shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">{selectedUserId ? 'Update User' : 'Add New User'}</h3>

        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Staff ID */}
          <InputField icon={<Hash />} name="staffId" placeholder="Staff ID" value={formData.staffId} onChange={handleChange} />

          {/* Name */}
          <InputField icon={<User />} name="name" placeholder="Name" value={formData.name} onChange={handleChange} />

          {/* Email */}
          <InputField icon={<Mail />} name="email" placeholder="Email" value={formData.email} onChange={handleChange} type="email" />

          {/* Department */}
          <div className="relative w-full md:w-1/4">
            <Calendar className="absolute left-3 top-2 w-5 h-5 text-gray-500" />
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="border p-2 rounded w-full pl-10"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 w-full md:w-auto"
            disabled={addingUser}
          >
            {addingUser ? 'Saving...' : selectedUserId ? 'Update' : 'Add'}
          </button>
        </div>
      </form>

      {/* Search & Filter */}
      <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-2 w-full md:w-2/3">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or staff ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        >
          <option value="">Filter by Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Users List */}
      {/* Uncomment this if you have a loading spinner */}
      {/* {loadingUsers ? <Loading /> : ( */}
      <div className="bg-white p-4 rounded shadow-md">
        <h3 className="text-lg font-semibold mb-4">User List</h3>
        {filteredUsers.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-2 px-4">Staff ID</th>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">Department</th>
                  <th className="py-2 px-4 text-center">Pending Tasks</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="py-2 px-4">{user.staffId}</td>
                    <td className="py-2 px-4">{user.name}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">{user.department}</td>
                    <td className="py-2 px-4 text-center">{user.assignedTask?.length || 0}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleSelectUserForUpdate(user)}
                        className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 mr-2"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* )} */}
    </div>
  );
};

// Reusable input with icon component
const InputField = ({ icon, name, value, onChange, placeholder, type = 'text' }) => (
  <div className="relative w-full md:w-1/4">
    {React.cloneElement(icon, { className: 'absolute left-3 top-2 w-5 h-5 text-gray-500' })}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border p-2 rounded w-full pl-10"
    />
  </div>
);

export default Users;
