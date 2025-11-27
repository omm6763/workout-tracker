import { useState } from 'react'

// Clean Exercise List
const COMMON_EXERCISES = [
  "Bench Press", "Squat", "Deadlift", "Overhead Press", "Pull Up", "Dumbbell Row", 
  "Lunges", "Plank", "Bicep Curl", "Tricep Extension", "Leg Press", "Lat Pulldown"
]

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState('bmi')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [bmiResult, setBmiResult] = useState(null)
  const [exerciseName, setExerciseName] = useState(COMMON_EXERCISES[0])
  const [liftWeight, setLiftWeight] = useState('')
  const [reps, setReps] = useState('')
  const [calorieResult, setCalorieResult] = useState(null)

  const calculateBMI = (e) => {
    e.preventDefault()
    if (!weight || !height) return
    
    const hM = height / 100
    const bmi = (weight / (hM * hM)).toFixed(1)
    
    let status = ''
    if (bmi < 18.5) status = 'Underweight'
    else if (bmi >= 18.5 && bmi < 24.9) status = 'Normal Weight'
    else if (bmi >= 25 && bmi < 29.9) status = 'Overweight'
    else status = 'Obese'

    setBmiResult({ value: bmi, status })
  }

  const calculateCalories = (e) => {
    e.preventDefault()
    if (!liftWeight || !reps) return
    const burned = (liftWeight * reps * 0.05).toFixed(1)
    setCalorieResult({ burned, exercise: exerciseName })
  }

  return (
    <div className="progress-page" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      
      <div style={{ marginTop: '40px', marginBottom: '50px', textAlign: 'center' }}>
        <h2 style={{fontSize: '2.5rem'}}>Fitness Tools</h2>
        <p style={{color: '#666', fontSize: '1.2rem'}}>Select a calculator below to get started.</p>
      </div>

      <div className="calculator-container">
        <div className="calc-toggle">
          <button 
            className={`toggle-btn ${activeTab === 'bmi' ? 'active' : ''}`}
            onClick={() => setActiveTab('bmi')}
          >
            BMI Calculator
          </button>
          <button 
            className={`toggle-btn ${activeTab === 'calorie' ? 'active' : ''}`}
            onClick={() => setActiveTab('calorie')}
          >
            Calorie Estimator
          </button>
        </div>

        {activeTab === 'bmi' && (
          <div className="calc-content fade-in">
            <form onSubmit={calculateBMI}>
              <label>Weight (kg):</label>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 70" required />
              <label>Height (cm):</label>
              <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 175" required />
              <button className="calc-btn" style={{marginTop: '20px', width: '100%'}}>Calculate BMI</button>
            </form>
            {bmiResult && (
              <div className="calc-result">
                <h3 style={{margin: 0}}>BMI: {bmiResult.value}</h3>
                <p style={{margin: '10px 0 0 0', fontSize: '0.9em', color: '#555'}}>{bmiResult.status}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'calorie' && (
          <div className="calc-content fade-in">
            <form onSubmit={calculateCalories}>
              <label>Select Exercise:</label>
              <select value={exerciseName} onChange={e => setExerciseName(e.target.value)} style={{width:'100%', padding:'14px', marginBottom:'20px', borderRadius:'6px', border:'1px solid #ddd', fontSize:'1em', background:'#fafafa'}}>
                  {COMMON_EXERCISES.map(ex => <option key={ex} value={ex}>{ex}</option>)}
              </select>
              <label>Weight Lifted (kg):</label>
              <input type="number" value={liftWeight} onChange={e => setLiftWeight(e.target.value)} placeholder="e.g. 80" required />
              <label>Reps Performed:</label>
              <input type="number" value={reps} onChange={e => setReps(e.target.value)} placeholder="e.g. 10" required />
              <button className="calc-btn" style={{marginTop: '20px', width: '100%'}}>Calculate Burn</button>
            </form>
            {calorieResult && (
              <div className="calc-result">
                <h3 style={{margin: 0}}>🔥 {calorieResult.burned} kcal</h3>
                <p style={{margin: '10px 0 0 0', fontSize: '0.9em', color: '#555'}}>Estimated burn for 1 set of {calorieResult.exercise}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}