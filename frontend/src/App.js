import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

// pages & components
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ChartsPage from './pages/ChartsPage'
import CalculatorPage from './pages/CalculatorPage'
import ExerciseGuidePage from './pages/ExerciseGuidePage'
import PlannerPage from './pages/PlannerPage' // NEW IMPORT
import Navbar from './components/Navbar'

function App() {
  const { user } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route 
              path="/" 
              element={user ? <Home /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/charts" 
              element={user ? <ChartsPage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/calculator" 
              element={user ? <CalculatorPage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/guide" 
              element={user ? <ExerciseGuidePage /> : <Navigate to="/login" />} 
            />
            {/* NEW ROUTE */}
            <Route 
              path="/planner" 
              element={user ? <PlannerPage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/" />} 
            />
            <Route 
              path="/signup" 
              element={!user ? <Signup /> : <Navigate to="/" />} 
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App