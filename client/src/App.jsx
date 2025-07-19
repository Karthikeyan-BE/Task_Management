import { useState } from 'react'
import Event from './Event';
import {Toaster} from 'react-hot-toast';
import {BrowserRouter} from 'react-router-dom'
import Sidebar from './components/Sidebar';

function App() {
  return (
    <>
    {/* <BrowserRouter >
      <Event />
    </BrowserRouter> */}
      <Toaster />
      <Sidebar />
    </>
  )
}

export default App
