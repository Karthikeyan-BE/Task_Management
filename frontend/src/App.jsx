import {BrowserRouter , Routes , Route, Navigate} from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import useAuthStore from './store/useauthStore';
import Loading from './components/Loading'
function App() {
  const { checkAuth , authUser } = useAuthStore();
  if(!checkAuth){
    return(
      <> <Loading /> </>
    )
  }
  return (
    <>
      <BrowserRouter >
        <Routes>
          <Route path='/' element={authUser ? <Home /> :<Navigate to='/login' />} />
          <Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
          {/* <Route index element ={<Home/>} />
          <Route path='' element ={<Home/>} />
           */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
