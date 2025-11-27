import { useState } from 'react'
import { useLogin } from '../hooks/useLogin'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, error, isLoading } = useLogin()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h3>Log In</h3>
        
        <label>Email address:</label>
        <input 
          type="email" 
          onChange={(e) => setEmail(e.target.value)} 
          value={email} 
          placeholder="Enter your email"
        />
        
        <label>Password:</label>
        <input 
          type="password" 
          onChange={(e) => setPassword(e.target.value)} 
          value={password} 
          placeholder="Enter your password"
        />

        <button disabled={isLoading}>Log in</button>
        
        {error && <div className="error">{error}</div>}
        
        <p style={{marginTop: '20px', fontSize: '0.9rem', color: '#666'}}>
          Don't have an account? <a href="/signup" style={{color: '#1aac83', fontWeight: 'bold'}}>Sign up</a>
        </p>
      </form>
    </div>
  )
}