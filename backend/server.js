require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const workoutRoutes = require('./routes/workouts')
const userRoutes = require('./routes/user')
const planRoutes = require('./routes/plans')
const savedWorkoutRoutes = require('./routes/savedWorkouts')

const app = express()

// --- CORS CONFIGURATION UPDATE ---
const allowedOrigins = [
  'http://localhost:3000', // Local development
  'https://workout-tracker-psi-three.vercel.app' // Your deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
// -------------------------------

app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

app.use('/api/workouts', workoutRoutes)
app.use('/api/user', userRoutes)
app.use('/api/plans', planRoutes)
app.use('/api/saved-workouts', savedWorkoutRoutes)

app.get('/', (req, res) => {
  res.send('API is running successfully!')
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })