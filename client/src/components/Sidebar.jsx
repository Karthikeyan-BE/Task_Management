import { Link } from 'react-router-dom';
import useAuthStore from '../Store/useAuthStore.js';
import { useState } from 'react';

import {
  LogOut,
  Users,
  PlusSquare,
  Pencil,
  BarChart,
  Menu
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {logOut} = useAuthStore();
  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-gray-900 text-white p-4 shadow-md">
        <span className="text-xl font-semibold">Task Manager</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <nav
        className={`
          fixed z-40 top-0 left-0 h-screen bg-gray-900 text-white w-64 transform 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:relative md:flex 
          flex-col justify-between transition-transform duration-300 ease-in-out shadow-lg
        `}
      >
        {/* Navigation Links */}
        <div className="flex flex-col mt-10 space-y-2 px-6">
          <SidebarLink icon={<Users className="w-5 h-5" />} text="Users" to="/users" />
          <SidebarLink icon={<PlusSquare className="w-5 h-5" />} text="Create Task" to="/create-task" />
          <SidebarLink icon={<Pencil className="w-5 h-5" />} text="Update Task" to="/update-task" />
          <SidebarLink icon={<BarChart className="w-5 h-5" />} text="Status" to="/status" />
        </div>

        {/* Logout Button */}
        <button
          onClick={logOut}
          className="flex items-center gap-3 px-6 py-6 border-t border-gray-700 hover:bg-gray-800 transition-all duration-200 text-red-400 text-lg font-medium w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </nav>
    </>
  );
};

// Reusable SidebarLink component
const SidebarLink = ({ icon, text, to }) => (
  <Link
    to={to}
    className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-base font-medium"
  >
    {icon}
    {text}
  </Link>
);

export default Sidebar;
