import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home';
import useAuthStore from './Store/useAuthStore';
import Login from './Pages/Login';
import { Sidebar } from 'lucide-react';
// import Loading from './Components/Loading';

const Event = () => {
  const { authUser, checkAuth, isCheckingAuth ,isLogin } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // if (isCheckingAuth || isLogin) {
  //   return <Loading />;
  // }
  return (
    <Routes>
        {/* <Route path='/*' element={ authUser ? <Home /> : <Navigate to='/login' />} />
        <Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} /> */}
        <Sidebar />
    </Routes>
  );
};

export default Event;
