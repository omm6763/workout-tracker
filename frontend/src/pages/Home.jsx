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
        const response = await fetch(`${API_BASE}/api/workouts?page=${page}&limit=5`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        })
        const json = await response.json()

        if (response.ok) {
          const list = json.workouts ? json.workouts : (Array.isArray(json) ? json : [])
          dispatch({ type: 'SET_WORKOUTS', payload: list })
          
          if (json.totalPages) {
            setTotalPages(json.totalPages)
          }
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

  useEffect(() => {
      if (user && hasFetched.current) {
          fetchWorkouts()
          window.scrollTo(0, 0)
      }
  }, [page])

  return (
    <div className="home">
      <div className="workouts-container">
        <div className="workouts">
          {isLoading && <p style={{textAlign:'center', color: '#777'}}>Loading workouts...</p>}
          
          {!isLoading && workouts && workouts.length > 0 ? (
            workouts.map((workout) => (
              <WorkoutDetails key={workout._id} workout={workout} />
            ))
          ) : (
            !isLoading && <p style={{color: '#666', textAlign: 'center', padding: '20px'}}>No workouts found on this page.</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '15px', padding: '20px 0' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              Previous
            </button>
            <span style={{alignSelf:'center'}}>Page <b>{page}</b> of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
              Next
            </button>
          </div>
        )}
      </div>
      <WorkoutForm />
    </div>
  )
}