import React, { useState } from 'react';
import {
  LogOut,
  Users,
  FilePlus2,
  FileCheck2,
  History,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Users', icon: <Users className="w-5 h-5" />, href: '/users' },
    { label: 'Create Task', icon: <FilePlus2 className="w-5 h-5" />, href: '/createTask' },
    { label: 'Update Task', icon: <FileCheck2 className="w-5 h-5" />, href: '/updateTask' },
    { label: 'Status', icon: <History className="w-5 h-5" />, href: '/status' },
    // { label: 'Report', icon: <History className="w-5 h-5" />, href: '/report' },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-gray-900 text-white px-4 py-3 shadow-md fixed w-full z-40">
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <button onClick={() => setIsOpen(true)} aria-label="Open Menu">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-gray-900 text-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}
      >
        {/* Header / Close */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-bold hidden md:block">Task Manager</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
            aria-label="Close Menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-10 text-xl font-medium">
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition w-full"
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-gray-700">
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-500 hover:bg-red-700 hover:text-white transition text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </a>
        </div>
      </aside>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;