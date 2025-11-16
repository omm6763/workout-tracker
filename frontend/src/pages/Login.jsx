import { useState, useEffect } from 'react'
import useLogin from '../hooks/useLogin'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading, error } = useLogin()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'auto' }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <div className="auth-page">
      <form className="login" onSubmit={handleSubmit}>
        <h3>Log In</h3>
        <label>Email:</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <label>Password:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button disabled={isLoading}>Log in</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  )
}