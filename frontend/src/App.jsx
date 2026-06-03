import { useState } from "react"
import "./index.css"
import "./App.css"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [rol,   setRol]   = useState(localStorage.getItem("rol"))

  if (!token) {
    return <Login setToken={setToken} setRol={setRol} />
  }

  return <Dashboard rol={rol} setToken={setToken} />
}

export default App
