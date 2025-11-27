import { Link, useLocation } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

export default function Navbar() {
  const { logout } = useLogout()
  const { user } = useAuthContext()
  const location = useLocation()

  const handleClick = () => {
    logout()
  }

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>Workout Buddy</h1>
        </Link>
        <nav>
          {user && (
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              
              <Link 
                to="/" 
                className={`nav-btn ${location.pathname === '/' ? 'active' : 'inactive'}`}
              >
                Dashboard
              </Link>
              
              <Link 
                to="/charts" 
                className={`nav-btn ${location.pathname === '/charts' ? 'active' : 'inactive'}`}
              >
                Charts
              </Link>
              
              <Link 
                to="/calculator" 
                className={`nav-btn ${location.pathname === '/calculator' ? 'active' : 'inactive'}`}
              >
                Calculators
              </Link>

              <Link 
                to="/guide" 
                className={`nav-btn ${location.pathname === '/guide' ? 'active' : 'inactive'}`}
              >
                Guide
              </Link>

              <span style={{fontSize: '1rem', color: '#555', borderLeft: '2px solid #eee', paddingLeft: '20px', marginLeft: '10px', fontWeight: '500'}}>
                {user.email}
              </span>
              
              <button onClick={handleClick} className="logout-btn">
                Log out
              </button>
            </div>
          )}
          {!user && (
            <div style={{display: 'flex', gap: '20px'}}>
              <Link to="/login" style={{fontSize: '1.2rem', fontWeight: '500'}}>Login</Link>
              <Link to="/signup" style={{fontSize: '1.2rem', fontWeight: '500'}}>Signup</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}