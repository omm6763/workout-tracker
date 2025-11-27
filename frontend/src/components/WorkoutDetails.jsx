import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { API_BASE } from '../config'
import { Link } from 'react-router-dom'

export default function WorkoutDetails({ workout }) {
  const { dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return

    const response = await fetch(`${API_BASE}/api/workouts/${workout._id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({ type: 'DELETE_WORKOUT', payload: json })
    }
  }

  // Clean title for URL 
  const cleanTitle = workout.title.trim();
  
  return (
    <div className="workout-details">
      <Link to={`/guide#${encodeURIComponent(cleanTitle)}`} style={{textDecoration: 'none', color: 'inherit', display: 'block', height: '100%'}}>
        <h4>{workout.title}</h4>
        <p><strong>Load (kg): </strong>{workout.load}</p>
        <p><strong>Reps: </strong>{workout.reps}</p>
        <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
      </Link>
      <span className="material-symbols-outlined" onClick={handleDelete}>delete</span>
    </div>
  )
}