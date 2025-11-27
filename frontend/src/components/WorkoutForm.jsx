import { useState } from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { API_BASE } from '../config'

// Clean Exercise List
const COMMON_EXERCISES = [
  "Bench Press", "Squat", "Deadlift", "Overhead Press", 
  "Pull Up", "Dumbbell Row", "Lunges", "Plank", 
  "Bicep Curl", "Tricep Extension", "Leg Press", "Lat Pulldown"
]

export default function WorkoutForm() {
  const { dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()

  const [selectedExercise, setSelectedExercise] = useState(COMMON_EXERCISES[0])
  const [customTitle, setCustomTitle] = useState('')
  const [load, setLoad] = useState('')
  const [reps, setReps] = useState('')
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])
  const [successMsg, setSuccessMsg] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setError('You must be logged in')
      return
    }

    const finalTitle = selectedExercise === 'Other' ? customTitle : selectedExercise

    if (selectedExercise === 'Other' && !customTitle.trim()) {
      setError('Please specify the exercise name')
      return
    }

    const workout = { title: finalTitle, load, reps }

    const response = await fetch(`${API_BASE}/api/workouts`, {
      method: 'POST',
      body: JSON.stringify(workout),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (!response.ok) {
      setError(json.error)
      setEmptyFields(json.emptyFields || [])
    }
    if (response.ok) {
      setCustomTitle('')
      setLoad('')
      setReps('')
      setError(null)
      setEmptyFields([])
      
      if (json.isNewPR) {
        setSuccessMsg(`🏆 New Personal Record: ${json.title}!`)
      } else {
        setSuccessMsg('Workout added!')
      }
      setTimeout(() => setSuccessMsg(null), 3000)

      dispatch({ type: 'CREATE_WORKOUT', payload: json })
    }
  }

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Workout</h3>

      <label>Exercise:</label>
      <select 
        value={selectedExercise} 
        onChange={(e) => setSelectedExercise(e.target.value)}
      >
        {COMMON_EXERCISES.map(ex => <option key={ex} value={ex}>{ex}</option>)}
        <option value="Other">➕ Add Custom Exercise</option>
      </select>

      {selectedExercise === 'Other' && (
        <input
          type="text"
          placeholder="Type exercise name..."
          onChange={(e) => setCustomTitle(e.target.value)}
          value={customTitle}
          className={emptyFields.includes('title') ? 'error' : ''}
          autoFocus
        />
      )}

      <label>Load (kg):</label>
      <input
        type="number"
        onChange={(e) => setLoad(e.target.value)}
        value={load}
        className={emptyFields.includes('load') ? 'error' : ''}
        placeholder="e.g. 80"
      />

      <label>Reps:</label>
      <input
        type="number"
        onChange={(e) => setReps(e.target.value)}
        value={reps}
        className={emptyFields.includes('reps') ? 'error' : ''}
        placeholder="e.g. 10"
      />

      <button>Add Workout</button>
      
      {error && <div className="error">{error}</div>}
      
      {successMsg && (
        <div className="success-msg" style={{ 
          marginTop: '20px', 
          padding: '15px', 
          background: '#e6fffa', 
          border: '1px solid #1aac83', 
          color: '#1aac83', 
          borderRadius: '6px',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          {successMsg}
        </div>
      )}
    </form>
  )
}