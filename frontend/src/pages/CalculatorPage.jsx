import { useState } from 'react'

// Standard exercises
const COMMON_EXERCISES = [
  "Bench Press", "Squat", "Deadlift", "Overhead Press", 
  "Pull Up", "Dumbbell Row", "Lunges", "Plank", 
  "Bicep Curl", "Tricep Extension", "Leg Press", "Lat Pulldown"
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
  const [ormWeight, setOrmWeight] = useState('')
  const [ormReps, setOrmReps] = useState('')
  const [ormResult, setOrmResult] = useState(null)

  const calculateBMI = (e) => {
    e.preventDefault()
    if (!weight || !height) return
    const hM = height / 100
    const bmi = (weight / (hM * hM)).toFixed(1)
    let status = ''
    if (bmi < 18.5) status = 'Underweight'
    else if (bmi >= 18.5 && bmi < 24.9) status = 'Normal'
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

  const calculate1RM = (e) => {
    e.preventDefault()
    if (!ormWeight || !ormReps) return
    // Brzycki Formula
    const oneRepMax = (ormWeight * (36 / (37 - ormReps))).toFixed(1)
    setOrmResult(oneRepMax)
  }

  return (
    <div className="progress-page" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      
      <div style={{ marginTop: '30px', marginBottom: '30px', textAlign: 'center' }}>
        <h2 style={{fontSize: '2rem', margin: 0}}>Fitness Tools</h2>
      </div>

      <div className="calculator-container">
        
        <div className="calc-toggle">
          <button className={`toggle-btn ${activeTab === 'bmi' ? 'active' : ''}`} onClick={() => setActiveTab('bmi')}>BMI</button>
          <button className={`toggle-btn ${activeTab === 'calorie' ? 'active' : ''}`} onClick={() => setActiveTab('calorie')}>Calories</button>
          <button className={`toggle-btn ${activeTab === '1rm' ? 'active' : ''}`} onClick={() => setActiveTab('1rm')}>1RM</button>
        </div>

        {activeTab === 'bmi' && (
          <div className="calc-content">
            <h3 style={{marginTop: 0, color: '#333', fontSize: '1.3rem'}}>Body Mass Index</h3>
            <form onSubmit={calculateBMI}>
              <label>Weight (kg):</label>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="70" required />
              <label>Height (cm):</label>
              <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="175" required />
              <button className="calc-btn" style={{width: '100%', marginTop: '10px'}}>Calculate</button>
            </form>
            {bmiResult && (
              <div className="calc-result">
                <div style={{fontSize:'1.5rem', fontWeight:'bold'}}>{bmiResult.value}</div>
                <div style={{fontSize:'0.9rem', color:'#666'}}>{bmiResult.status}</div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'calorie' && (
          <div className="calc-content">
            <h3 style={{marginTop: 0, color: '#333', fontSize: '1.3rem'}}>Calorie Estimate</h3>
            <form onSubmit={calculateCalories}>
              <label>Exercise:</label>
              <select value={exerciseName} onChange={e => setExerciseName(e.target.value)}>
                  {COMMON_EXERCISES.map(ex => <option key={ex} value={ex}>{ex}</option>)}
              </select>
              <label>Weight (kg):</label>
              <input type="number" value={liftWeight} onChange={e => setLiftWeight(e.target.value)} placeholder="80" required />
              <label>Reps:</label>
              <input type="number" value={reps} onChange={e => setReps(e.target.value)} placeholder="10" required />
              <button className="calc-btn" style={{width: '100%', marginTop: '10px'}}>Calculate</button>
            </form>
            {calorieResult && (
              <div className="calc-result">
                <div style={{fontSize:'1.5rem', fontWeight:'bold'}}>🔥 ~{calorieResult.burned} kcal</div>
                <div style={{fontSize:'0.9rem', color:'#666'}}>1 set of {calorieResult.exercise}</div>
              </div>
            )}
          </div>
        )}

        {activeTab === '1rm' && (
          <div className="calc-content">
            <h3 style={{marginTop: 0, color: '#333', fontSize: '1.3rem'}}>One Rep Max</h3>
            <form onSubmit={calculate1RM}>
              <label>Weight (kg):</label>
              <input type="number" value={ormWeight} onChange={e => setOrmWeight(e.target.value)} placeholder="100" required />
              <label>Reps:</label>
              <input type="number" value={ormReps} onChange={e => setOrmReps(e.target.value)} placeholder="5" max="30" required />
              <button className="calc-btn" style={{width: '100%', marginTop: '10px'}}>Calculate</button>
            </form>
            {ormResult && (
              <div className="calc-result">
                <div style={{fontSize:'1.5rem', fontWeight:'bold'}}>{ormResult} kg</div>
                <div style={{fontSize:'0.9rem', color:'#666'}}>Estimated Max Lift</div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}