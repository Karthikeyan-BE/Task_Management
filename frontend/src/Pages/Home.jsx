import { Outlet, Routes ,Route } from "react-router-dom";
import SideBar from '../components/SideBar'
import Users from "../components/Admin/User";
import Createtask from "../components/Admin/Createtask";
import Updatetask from "../components/Admin/Updatetask";
import Status from "../components/Admin/Status";
import Report from "../components/Admin/Report";
import Taskdetail from "../components/Admin/Taskdetail";
const Home = () => {
  return (
    <>
    <div className="flex w-screen">
      <div className="fixed w-1/4">
        <SideBar />
      </div>
      <div className="md:ml-[20%] md:w-3/4">
       <Routes>
        <Route path='/users' element={<Users />} />
        <Route path='/createTask' element={<Createtask />} />
        <Route path='/updateTask' element={<Updatetask />} />
        <Route path='/status/' element={<Status />} />
        <Route path=':taskId' element={<Taskdetail />} />
        <Route path='/report' element={<Report />} />
       </Routes>
      </div>
    </div>
    
    </>
  )
}

export default Home