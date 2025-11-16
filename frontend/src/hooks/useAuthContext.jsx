import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw Error('useAuthContext must be used inside an AuthContextProvider')
  }
  return context
}
// Optionally also add default export to keep old imports working:
export default useAuthContext