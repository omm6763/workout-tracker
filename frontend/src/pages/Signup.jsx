import { useState, useEffect } from 'react'
import useSignup from '../hooks/useSignup'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signup, isLoading, error } = useSignup()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'auto' }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signup(email, password)
  }

  return (
    <div className="auth-page">
      <form className="signup" onSubmit={handleSubmit}>
        <h3>Sign Up</h3>
        <label>Email:</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <label>Password:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button disabled={isLoading}>Sign up</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  )
}