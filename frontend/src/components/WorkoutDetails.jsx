import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { API_BASE } from '../config'
import { Link } from 'react-router-dom'

export default function WorkoutDetails({ workout }) {
  const { dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()

  const handleDelete = async (e) => {
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

  const handleToggle = async (e) => {
    e.stopPropagation();
    if (!user) return;

    // Optimistically toggle locally would require context update logic, 
    // for now we trigger an update to backend.
    const response = await fetch(`${API_BASE}/api/workouts/${workout._id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}` 
      },
      body: JSON.stringify({ completed: !workout.completed })
    });
    
    if (response.ok) {
        // Simple reload to reflect changes across charts/lists
        window.location.reload(); 
    }
  }

  const cleanTitle = workout.title.trim();
  
  return (
    <div className={`workout-details ${workout.completed ? 'completed' : ''}`}>
      
      {/* 1. Check Circle (Todo Style) */}
      <div 
        className="complete-toggle" 
        onClick={handleToggle}
        title={workout.completed ? "Mark Incomplete" : "Mark Complete"}
      >
        {workout.completed && "✓"}
      </div>

      {/* 2. Content */}
      <div className="workout-info">
        <Link to={`/guide#${encodeURIComponent(cleanTitle)}`} style={{textDecoration: 'none', color: 'inherit'}}>
            <h4>{workout.title}</h4>
        </Link>
        <p><strong>{workout.load}kg</strong> x <strong>{workout.reps}</strong> reps</p>
        <p style={{fontSize: '0.75rem', color: '#888'}}>
            {formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}
        </p>
      </div>
      
      {/* 3. Delete Icon (No Box) */}
      <span 
        className="material-symbols-outlined delete-icon" 
        onClick={handleDelete}
        title="Delete"
      >
        delete
      </span>
    </div>
  )
}