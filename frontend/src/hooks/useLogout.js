import { useAuthContext } from './useAuthContext'
import { useWorkoutsContext } from './useWorkoutsContext'
import { useNavigate } from 'react-router-dom'

export const useLogout = () => {
  const { dispatch } = useAuthContext()
  const { dispatch: workoutsDispatch } = useWorkoutsContext()
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
    workoutsDispatch({ type: 'SET_WORKOUTS', payload: null })
    navigate('/login')
  }

  return { logout }
}

export default useLogout