import Event from './Event';
import {Toaster} from 'react-hot-toast';
import {BrowserRouter} from 'react-router-dom'

function App() {
  return (
    <>
    <BrowserRouter >
      <Event />
    </BrowserRouter>
      <Toaster />
    </>
  )
}

export default App
