import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext'
import { WorkoutContextProvider } from './context/WorkoutContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  return (
    <AuthContextProvider>
      <WorkoutContextProvider>
        <BrowserRouter>
          <Navbar />
          <div className="pages">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>
        </BrowserRouter>
      </WorkoutContextProvider>
    </AuthContextProvider>
  )
}

export default App
