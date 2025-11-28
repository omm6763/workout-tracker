import { useEffect, useState, useRef } from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import WorkoutDetails from '../components/WorkoutDetails'
import WorkoutForm from '../components/WorkoutForm'
import { API_BASE } from '../config'

export default function Home() {
  const { workouts, dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()
  
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const hasFetched = useRef(false)

  const fetchWorkouts = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${API_BASE}/api/workouts?page=${page}&limit=10`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        })
        const json = await response.json()

        if (response.ok) {
          const list = json.workouts ? json.workouts : (Array.isArray(json) ? json : [])
          dispatch({ type: 'SET_WORKOUTS', payload: list })
          if (json.totalPages) setTotalPages(json.totalPages)
        }
      } catch (error) {
        console.error("Failed to fetch workouts:", error)
      } finally {
        setIsLoading(false)
      }
  }

  useEffect(() => {
    if (user) {
       if (!hasFetched.current || !workouts || workouts.length === 0) {
           fetchWorkouts()
           hasFetched.current = true
       }
    }
  }, [dispatch, user])

  // Pagination scroll to top
  useEffect(() => {
      if (user && hasFetched.current) {
          fetchWorkouts()
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  }, [page])

  let lastDate = null;

  return (
    <div className="home">
      <div className="workouts-container">
        {isLoading && <p style={{textAlign:'center', color: '#777', marginTop: '40px'}}>Loading workouts...</p>}
        
        {!isLoading && workouts && workouts.map((workout) => {
            const workoutDate = new Date(workout.createdAt).toLocaleDateString()
            const showDate = workoutDate !== lastDate
            lastDate = workoutDate

            return (
                <div key={workout._id}>
                    {showDate && (
                        <div className="date-header">
                            {new Date(workout.createdAt).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                        </div>
                    )}
                    <WorkoutDetails workout={workout} />
                </div>
            )
        })}
        
        {!isLoading && workouts && workouts.length === 0 && (
            <div style={{textAlign:'center', padding:'60px', color:'#888', background:'#fff', borderRadius:'16px', boxShadow: 'var(--shadow)', border: '1px solid #eee'}}>
                <h3 style={{color: '#ccc'}}>No workouts yet</h3>
                <p>Log your first exercise on the right to get started!</p>
            </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="standard-btn" style={{background: page===1 ? '#e0e0e0' : ''}}>
                Previous
            </button>
            <span style={{alignSelf:'center', fontWeight: '600', color: '#555'}}>
                Page {page} of {totalPages}
            </span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="standard-btn" style={{background: page>=totalPages ? '#e0e0e0' : ''}}>
                Next
            </button>
          </div>
        )}
      </div>
      <WorkoutForm />
    </div>
  )
}