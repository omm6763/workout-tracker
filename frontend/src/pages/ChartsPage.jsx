import { useEffect, useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { API_BASE } from '../config'

export default function ChartsPage() {
  const { user } = useAuthContext()
  
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentChartIndex, setCurrentChartIndex] = useState(0)
  
  // NEW: State for switching metrics
  const [metric, setMetric] = useState('load') // Options: 'load', 'volume', 'oneRepMax'

  useEffect(() => {
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
                volume: Number(entry.volume),
                oneRepMax: Math.round(Number(entry.oneRepMax))
              }))
            return { name: group._id, data: sortedHistory }
          })
          setStats(formattedData)
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [user])

  const handleNextChart = () => setCurrentChartIndex((prev) => (prev + 1) % stats.length);
  const handlePrevChart = () => setCurrentChartIndex((prev) => (prev - 1 + stats.length) % stats.length);

  // Helper for labels
  const getMetricLabel = () => {
    if (metric === 'load') return 'Weight Lifted (kg)';
    if (metric === 'volume') return 'Total Volume (kg)';
    if (metric === 'oneRepMax') return 'Est. 1 Rep Max (kg)';
  }

  return (
    <div className="progress-page" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', paddingBottom: '50px' }}>
      
      <div style={{ marginTop: '40px', marginBottom: '30px', textAlign: 'center' }}>
        <h2>📊 Advanced Analytics</h2>
        <p style={{color: '#666', fontSize: '1.1rem'}}>Analyze your strength, volume, and performance limits.</p>
      </div>

      {/* METRIC TOGGLES */}
      <div style={{display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px'}}>
          <button 
            onClick={() => setMetric('load')}
            className="standard-btn"
            style={{background: metric === 'load' ? '#1aac83' : '#fff', color: metric === 'load' ? '#fff' : '#1aac83', border: '2px solid #1aac83'}}
          >
            Weight
          </button>
          <button 
            onClick={() => setMetric('volume')}
            className="standard-btn"
            style={{background: metric === 'volume' ? '#1aac83' : '#fff', color: metric === 'volume' ? '#fff' : '#1aac83', border: '2px solid #1aac83'}}
          >
            Volume (Set)
          </button>
          <button 
            onClick={() => setMetric('oneRepMax')}
            className="standard-btn"
            style={{background: metric === 'oneRepMax' ? '#1aac83' : '#fff', color: metric === 'oneRepMax' ? '#fff' : '#1aac83', border: '2px solid #1aac83'}}
          >
            Est. 1RM
          </button>
      </div>

      {loading && <p style={{textAlign: 'center'}}>Loading analytics...</p>}
      
      {!loading && stats.length === 0 && (
          <div style={{textAlign: 'center', padding: '40px', background: 'white', borderRadius: '10px'}}>
              <h3>No Data Yet</h3>
              <p>Log your workouts on the dashboard to see progress charts here.</p>
          </div>
      )}

      {!loading && stats.length > 0 && (
        <div className="chart-carousel">
            <div className="carousel-controls">
                <button className="carousel-btn" onClick={handlePrevChart} disabled={stats.length <= 1}>
                    ← Prev
                </button>
                <h4 style={{ textTransform: 'capitalize', color: '#333', margin: 0, fontSize: '1.4rem' }}>
                    {stats[currentChartIndex].name} <span style={{color: '#1aac83', fontSize: '0.8em'}}>({getMetricLabel()})</span>
                </h4>
                <button className="carousel-btn" onClick={handleNextChart} disabled={stats.length <= 1}>
                    Next →
                </button>
            </div>
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                {/* Using AreaChart for Volume to make it look distinct, Line for others */}
                {metric === 'volume' ? (
                    <AreaChart data={stats[currentChartIndex].data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip contentStyle={{borderRadius: '8px'}} />
                        <Legend />
                        <Area type="monotone" dataKey="volume" stroke="#8884d8" fill="#8884d8" name="Volume (kg)" />
                    </AreaChart>
                ) : (
                    <LineChart data={stats[currentChartIndex].data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="date" />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip contentStyle={{borderRadius: '8px'}} />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey={metric} 
                            stroke={metric === 'oneRepMax' ? "#e7195a" : "#1aac83"} 
                            strokeWidth={3} 
                            activeDot={{ r: 8 }} 
                            name={metric === 'oneRepMax' ? "Est. 1RM (kg)" : "Weight (kg)"}
                            dot={{ r: 4 }}
                            isAnimationActive={true}
                        />
                    </LineChart>
                )}
              </ResponsiveContainer>
            </div>
            <p style={{textAlign:'center', color: '#888', fontSize: '0.9rem', marginTop: '20px'}}>
                {metric === 'oneRepMax' ? '1RM calculated using Epley Formula based on your sets.' : ''}
                {metric === 'volume' ? 'Volume = Weight × Reps. High volume builds endurance and size.' : ''}
            </p>
        </div>
      )}
    </div>
  )
}