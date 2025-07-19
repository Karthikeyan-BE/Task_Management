import { Outlet } from "react-router-dom"
const Home = () => {
  return (
    <>
    <div>
      <div>
        <sidebar/>
      </div>
      <div>
       <Outlet />
      </div>
    </div>
    
    </>
  )
}

export default Home