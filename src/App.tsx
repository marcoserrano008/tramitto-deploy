import './App.css'
import {Outlet} from "react-router-dom";

function App() {
  return (
    <>
      <h1>header</h1>
      <Outlet />
      <h1>footer</h1>
    </>
  )
}

export default App
