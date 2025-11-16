import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw Error('useAuthContext must be used inside AuthContextProvider')
  return ctx
}