import React, { useState } from 'react'
import {
  LogOut,
  Users,
  PlusSquare,
  Pencil,
  BarChart,
  Menu
} from 'lucide-react'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-gray-900 text-white p-4 shadow-md">
        <span className="text-xl font-semibold">Task Manager</span>
        <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <nav
        className={`
          fixed z-40 top-0 left-0 h-full bg-gray-900 text-white w-64 transform 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:relative md:flex 
          flex-col justify-between transition-transform duration-300 ease-in-out shadow-lg
        `}
      >
        {/* Navigation Links */}
        <div className="flex flex-col mt-10 space-y-2 px-6">
          <SidebarLink icon={<Users className="w-5 h-5" />} text="Users" href="#" />
          <SidebarLink icon={<PlusSquare className="w-5 h-5" />} text="Create Task" href="#" />
          <SidebarLink icon={<Pencil className="w-5 h-5" />} text="Update Task" href="#" />
          <SidebarLink icon={<BarChart className="w-5 h-5" />} text="Status" href="#" />
        </div>

        {/* Logout */}
        <div className="flex items-center gap-3 px-6 py-6 border-t border-gray-700 hover:bg-gray-800 cursor-pointer transition-all duration-200">
          <LogOut className="w-5 h-5 text-red-400" />
          <a href="#" className="text-lg font-medium text-red-400">Logout</a>
        </div>
      </nav>
    </>
  )
}

// Reusable SidebarLink component
const SidebarLink = ({ icon, text, href }) => (
  <a
    href={href}
    className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-base font-medium"
  >
    {icon}
    {text}
  </a>
)

export default Sidebar
