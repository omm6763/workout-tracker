import { useEffect, useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { API_BASE } from '../config'

export default function ChartsPage() {
  const { user } = useAuthContext()
  
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentChartIndex, setCurrentChartIndex] = useState(0)

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
                load: Number(entry.load)
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

  return (
    <div className="progress-page" style={{ padding: '0 20px', maxWidth: '1200px', margin: '0 auto', paddingBottom: '50px' }}>
      
      <div style={{ marginTop: '20px', marginBottom: '30px' }}>
        <h2>📊 Performance Charts</h2>
      </div>

      {loading && <p>Loading charts...</p>}
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
                <h4 style={{ textTransform: 'capitalize', color: '#1aac83', margin: 0, fontSize: '1.2rem' }}>
                    {stats[currentChartIndex].name} ({currentChartIndex + 1}/{stats.length})
                </h4>
                <button className="carousel-btn" onClick={handleNextChart} disabled={stats.length <= 1}>
                    Next →
                </button>
            </div>
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats[currentChartIndex].data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="load" 
                    stroke="#1aac83" 
                    strokeWidth={3} 
                    activeDot={{ r: 8 }} 
                    name="Load (kg)"
                    dot={{ r: 4 }}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
        </div>
      )}
    </div>
  )
}