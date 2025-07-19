import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home';
import useAuthStore from './Store/useAuthStore';
import Login from './Pages/Login';
import Sidebar from './Components/Sidebar';

const Event = () => {
  const { authUser, checkAuth, isCheckingAuth, isLogin } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Optional loading state
  // if (isCheckingAuth || isLogin) {
  //   return <Loading />;
  // }

  return (
    <>
      <Routes>
        <Route path="/*" element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
      </Routes>
    </>
  );
};

export default Event;
