import { useState, useEffect } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { API_BASE } from '../config'

// Predefined data
const MUSCLES = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"]
const EXERCISES = {
  "Chest": ["Bench Press", "Push Ups", "Chest Fly", "Incline Press"],
  "Back": ["Deadlift", "Pull Up", "Lat Pulldown", "Rows"],
  "Legs": ["Squat", "Lunges", "Leg Press", "Calf Raise"],
  "Shoulders": ["Overhead Press", "Lateral Raise", "Face Pull"],
  "Arms": ["Bicep Curl", "Tricep Extension", "Dips"],
  "Core": ["Plank", "Crunches", "Leg Raises"]
}

export default function PlannerPage() {
  const { user } = useAuthContext()
  
  // --- STATE ---
  const [weekDays, setWeekDays] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  
  // Planner Data
  const [dayPlan, setDayPlan] = useState({ exercises: [] })
  const [showBuilder, setShowBuilder] = useState(false)
  const [statusMsg, setStatusMsg] = useState(null)

  // Builder Form State
  const [muscle, setMuscle] = useState("Chest")
  const [exercise, setExercise] = useState(EXERCISES["Chest"][0])
  const [sets, setSets] = useState(3)
  const [reps, setReps] = useState(10)
  const [currentBuilderList, setCurrentBuilderList] = useState([]) 
  
  // --- INITIALIZATION ---
  useEffect(() => {
    const days = []
    for(let i=0; i<7; i++) {
        const d = new Date()
        d.setDate(d.getDate() + i)
        days.push({
            dateObj: d, // Store full date object for backend
            dateStr: d.toISOString().split('T')[0],
            dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
            displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        })
    }
    setWeekDays(days)
    setSelectedDate(days[0]) 
  }, [])

  // Fetch Plan for Selected Date
  useEffect(() => {
      if (!user || !selectedDate) return
      const fetchPlan = async () => {
          try {
            const res = await fetch(`${API_BASE}/api/plans/${selectedDate.dateStr}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            })
            const json = await res.json()
            if(res.ok) setDayPlan(json)
          } catch (e) { console.log(e) }
      }
      fetchPlan()
      setShowBuilder(false)
      setCurrentBuilderList([])
  }, [selectedDate, user])

  useEffect(() => {
      setExercise(EXERCISES[muscle][0])
  }, [muscle])

  // --- HANDLERS ---

  // 1. Add to Builder List
  const addToBuilder = (e) => {
      e.preventDefault()
      const newItem = { name: exercise, muscle, target_sets: sets, target_reps: reps }
      setCurrentBuilderList([...currentBuilderList, newItem])
  }

  // 2. Remove from Builder List
  const removeFromBuilder = (index) => {
      const updated = currentBuilderList.filter((_, i) => i !== index)
      setCurrentBuilderList(updated)
  }

  // 3. Save Plan to Database
  const handleSavePlan = async () => {
      if(currentBuilderList.length === 0) return alert("Add exercises to the list first!")

      const mergedExercises = [...dayPlan.exercises, ...currentBuilderList]

      const res = await fetch(`${API_BASE}/api/plans`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
          body: JSON.stringify({ date: selectedDate.dateStr, exercises: mergedExercises })
      })
      
      if (res.ok) {
          const json = await res.json()
          setDayPlan(json)
          setCurrentBuilderList([]) 
          setShowBuilder(false) 
          showStatus("Plan Saved Successfully! ✅")
      }
  }

  // 4. Delete Exercise from Actual Plan
  const handleDeleteFromPlan = async (index) => {
      if(!window.confirm("Remove this exercise from the plan?")) return

      const updatedExercises = dayPlan.exercises.filter((_, i) => i !== index)
      
      const res = await fetch(`${API_BASE}/api/plans`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
          body: JSON.stringify({ date: selectedDate.dateStr, exercises: updatedExercises })
      })
      if (res.ok) {
          const json = await res.json()
          setDayPlan(json)
      }
  }

  // 5. MOVE TO DASHBOARD (Fixed Date Logic)
  const handleMoveToDashboard = async () => {
      if(dayPlan.exercises.length === 0) return alert("No exercises in plan to move!")
      if(!window.confirm(`Move exercises to Dashboard for ${selectedDate.displayDate}?`)) return

      let count = 0
      let errors = 0

      for(const ex of dayPlan.exercises) {
          const workoutBody = { 
              title: ex.name, 
              load: 10, 
              reps: ex.target_reps || 10,
              completed: false,
              // CRITICAL FIX: Send the date of the PLAN, not today's date
              createdAt: selectedDate.dateObj 
          }

          try {
            const res = await fetch(`${API_BASE}/api/workouts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                body: JSON.stringify(workoutBody)
            })
            if(res.ok) count++
            else {
                const err = await res.json()
                console.error("Backend Error:", err)
                errors++
            }
          } catch(e) {
              console.error("Network Error:", e)
              errors++
          }
      }

      if (count > 0) {
          showStatus(`Moved ${count} workouts to ${selectedDate.displayDate}! 🚀`)
      } else if (errors > 0) {
          alert("Failed to move workouts. Check console.")
      }
  }

  const showStatus = (txt) => {
      setStatusMsg(txt)
      setTimeout(() => setStatusMsg(null), 3000)
  }

  return (
    <div className="planner-container">
      
      <div style={{textAlign:'center', marginBottom:'30px'}}>
        <h2>📅 Weekly Planner</h2>
      </div>

      {/* WEEK CALENDAR */}
      <div className="week-grid">
          {weekDays.map(day => (
              <div 
                key={day.dateStr} 
                className={`day-card ${selectedDate?.dateStr === day.dateStr ? 'active' : ''}`}
                onClick={() => setSelectedDate(day)}
              >
                  <h4>{day.dayName}</h4>
                  <p>{day.displayDate}</p>
              </div>
          ))}
      </div>

      {/* TOP ACTIONS */}
      <div style={{display:'flex', gap:'20px', marginBottom:'30px', justifyContent:'center'}}>
          <button 
            className="standard-btn" 
            onClick={() => setShowBuilder(!showBuilder)}
            style={{background: showBuilder ? '#333' : '#1aac83', minWidth: '160px'}}
          >
            {showBuilder ? 'Close Builder' : '+ Add Plan'}
          </button>

          <button 
            className="standard-btn" 
            onClick={handleMoveToDashboard}
            style={{background: '#fff', color: '#1aac83', border:'2px solid #1aac83', minWidth: '160px'}}
          >
            Move to Dashboard ➔
          </button>
      </div>

      {statusMsg && <div style={{textAlign:'center', padding:'10px', background:'#e6fffa', color:'#1aac83', borderRadius:'8px', marginBottom:'20px'}}>{statusMsg}</div>}

      <div className="calculator-grid" style={{gridTemplateColumns: showBuilder ? '1fr 1fr' : '1fr', alignItems:'start'}}>
          
          {/* 1. BUILDER CARD */}
          {showBuilder && (
              <div className="calc-card fade-in">
                  <h3 style={{marginTop:0, borderBottom:'1px solid #eee', paddingBottom:'10px'}}>Build Workout</h3>
                  
                  <form onSubmit={addToBuilder}>
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                        <div>
                            <label>Muscle:</label>
                            <select value={muscle} onChange={e => setMuscle(e.target.value)}>
                                {MUSCLES.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <div>
                            <label>Exercise:</label>
                            <select value={exercise} onChange={e => setExercise(e.target.value)}>
                                {EXERCISES[muscle].map(ex => <option key={ex} value={ex}>{ex}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={{display:'flex', gap:'10px'}}>
                        <div style={{flex:1}}>
                            <label>Sets:</label>
                            <input type="number" value={sets} onChange={e => setSets(e.target.value)} />
                        </div>
                        <div style={{flex:1}}>
                            <label>Reps:</label>
                            <input type="number" value={reps} onChange={e => setReps(e.target.value)} />
                        </div>
                    </div>
                    
                    <button className="standard-btn" style={{width:'100%', marginTop:'10px'}}>Add to Current List</button>
                  </form>

                  {/* Current List Preview */}
                  {currentBuilderList.length > 0 && (
                      <div style={{marginTop:'20px', background:'#f9f9f9', padding:'15px', borderRadius:'8px'}}>
                          <h4 style={{margin:'0 0 10px 0'}}>Current List:</h4>
                          <ul style={{paddingLeft:'20px', margin:0}}>
                              {currentBuilderList.map((item, i) => (
                                  <li key={i} style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'5px'}}>
                                      <span>{item.name} <small>({item.target_sets}x{item.target_reps})</small></span>
                                      <span 
                                        onClick={() => removeFromBuilder(i)} 
                                        style={{cursor:'pointer', color:'#e7195a', fontWeight:'bold'}}
                                      >✕</span>
                                  </li>
                              ))}
                          </ul>
                          
                          <div style={{marginTop:'20px'}}>
                              <button className="standard-btn" onClick={handleSavePlan} style={{width: '100%'}}>
                                Save Plan to {selectedDate?.displayDate}
                              </button>
                          </div>
                      </div>
                  )}
              </div>
          )}

          {/* 2. PLAN VIEW */}
          <div className="guide-card" style={{minHeight:'400px'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'2px solid #eee', paddingBottom:'15px', marginBottom:'20px'}}>
                  <h3 style={{margin:0}}>Plan: {selectedDate?.dayName}, {selectedDate?.displayDate}</h3>
                  <span style={{background:'#eee', padding:'5px 10px', borderRadius:'20px', fontSize:'0.8rem'}}>
                      {dayPlan.exercises.length} Exercises
                  </span>
              </div>

              {dayPlan.exercises.length === 0 ? (
                  <div style={{textAlign:'center', color:'#999', marginTop:'50px'}}>
                      <p>No exercises planned for today.</p>
                      <p>Click <strong>"+ Add Plan"</strong> to create one.</p>
                  </div>
              ) : (
                  <div className="plan-list">
                      {dayPlan.exercises.map((item, idx) => (
                          <div key={idx} style={{
                              display:'flex', 
                              justifyContent:'space-between', 
                              alignItems:'center', 
                              padding:'15px', 
                              borderBottom:'1px solid #f0f0f0',
                              background: item.isCompleted ? '#f0fff4' : 'white'
                          }}>
                              <div>
                                  <strong style={{fontSize:'1.1rem', color:'#333'}}>{item.name}</strong>
                                  <div style={{color:'#666', fontSize:'0.9rem', marginTop:'4px'}}>
                                      {item.muscle} • {item.target_sets} sets x {item.target_reps} reps
                                  </div>
                              </div>
                              
                              <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                   <button 
                                      onClick={() => handleDeleteFromPlan(idx)}
                                      className="delete-btn"
                                      title="Remove from plan"
                                   >
                                      <span className="material-symbols-outlined">delete</span>
                                   </button>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>

      </div>
    </div>
  )
}