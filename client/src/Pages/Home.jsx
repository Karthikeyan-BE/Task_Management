import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import Users from '../Components/Admin/Users';

const Home = () => {
  const location = useLocation();

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 w-full">
        {location.pathname === '/users' && <Users />}
        {/* Add more conditions if needed */}
      </div>
    </div>
  );
};

export default Home;
