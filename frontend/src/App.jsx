import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Tenant from './pages/Tenant'
import Landload from './pages/Landload'
import LoginPage from './pages/LoginPage'
import UserProfileForm from './pages/UserProfileForm'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NotificationArea from './pages/NotificationArea'

function App() {
  const [count, setCount] = useState(0)

  return (
  <>
    <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<UserProfileForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tenant" element={<Tenant />} />
            <Route path="/landlord" element={<Landload />} />
          </Routes>
        </Router>
        <NotificationArea />
    </>
  )
}

export default App
