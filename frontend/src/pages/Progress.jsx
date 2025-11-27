import { useEffect, useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext' 
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { API_BASE } from '../config'
import BodyHeatmap from '../components/BodyHeatmap'

export default function Progress() {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthContext()
  const { dispatch } = useWorkoutsContext()

  const fetchStats = async () => {
    if (!user) return
    
    try {
      const response = await fetch(`${API_BASE}/api/workouts/stats?t=${Date.now()}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
      const json = await response.json()

      if (response.ok) {
        const formattedData = json.map(group => {
          const sortedHistory = group.data
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(entry => ({
              ...entry,
              date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              load: Number(entry.load),
              rawId: entry.id
            }))
          
          return { name: group._id, data: sortedHistory, allIds: group.data.map(d => d.id) }
        })
        setStats(formattedData)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [user])

  const handleDeleteExercise = async (ids, exerciseName) => {
    if(!window.confirm(`Delete ALL history for ${exerciseName}?`)) return;

    for (const id of ids) {
      if(id) {
        await fetch(`${API_BASE}/api/workouts/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${user.token}` }
        })
      }
    }
    
    ids.forEach(id => { if(id) dispatch({ type: 'DELETE_WORKOUT', payload: { _id: id } }) })
    fetchStats()
  }

  return (
    <div className="progress-page" style={{ padding: '0 20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ marginTop: '20px', marginBottom: '30px' }}>
        <h2>Analytics Dashboard</h2>
      </div>

      {/* NEW: Body Heatmap Section */}
      {!loading && <BodyHeatmap workoutHistory={stats} />}

      <h3 style={{marginTop: '40px', color: '#333'}}>Strength Progression</h3>
      
      {loading && <p>Loading charts...</p>}

      {!loading && stats.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px', background: '#fff', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
          <h3 style={{color: '#555'}}>No Data Available</h3>
          <p>Log workouts with standard names (e.g., "Bench Press") to see your progress charts.</p>
        </div>
      )}
      
      <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px', paddingBottom: '50px', marginTop: '20px' }}>
        {stats.map((exercise) => (
          <div key={exercise.name} className="chart-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>
                <h4 style={{ textTransform: 'capitalize', color: '#1aac83', margin: 0 }}>{exercise.name}</h4>
                
                {/* Dustbin Delete Button */}
                <button 
                    onClick={() => handleDeleteExercise(exercise.allIds, exercise.name)}
                    className="delete-btn"
                    title="Delete History"
                >
                    <span className="material-symbols-outlined">delete</span>
                </button>
            </div>

            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={exercise.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" style={{ fontSize: '12px' }} />
                  <YAxis style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="load" 
                    stroke="#1aac83" 
                    strokeWidth={2}
                    activeDot={{ r: 6 }} 
                    name="Load (kg)"
                    dot={{r: 4}}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}