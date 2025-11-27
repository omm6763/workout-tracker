import { useState } from 'react'
import { useSignup } from '../hooks/useSignup'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signup, error, isLoading } = useSignup()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signup(email, password)
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h3>Sign Up</h3>
        
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
          placeholder="Create a password"
        />

        <button disabled={isLoading}>Sign up</button>
        
        {error && <div className="error">{error}</div>}

        <p style={{marginTop: '20px', fontSize: '0.9rem', color: '#666'}}>
          Already have an account? <a href="/login" style={{color: '#1aac83', fontWeight: 'bold'}}>Log in</a>
        </p>
      </form>
    </div>
  )
}