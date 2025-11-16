import { useContext } from 'react'
import { WorkoutContext } from '../context/WorkoutContext'

export const useWorkoutsContext = () => {
  const context = useContext(WorkoutContext)
  if (!context) throw Error('useWorkoutsContext must be used inside a WorkoutContextProvider')
  return context
}
export default useWorkoutsContext
