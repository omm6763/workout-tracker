require('dotenv').config({ override: true })

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const workoutsRoutes = require('./routes/workouts')
const userRoutes = require('./routes/user')

const app = express()
app.use(express.json())

// Allowed frontend origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://workout-tracker-psi-three.vercel.app'
]

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)          // allow curl / server-side
    if (allowedOrigins.includes(origin)) return cb(null, true)
    return cb(new Error('CORS blocked: ' + origin))
  },
  methods: ['GET','POST','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}))
app.options(/.*/, cors())

// Request logger
app.use((req, res, next) => {
  console.log(req.method, req.path)
  next()
})

// Health
app.get('/', (req, res) => {
  res.json({
    message: 'Workout Tracker API',
    status: 'Running',
    endpoints: {
      workouts: '/api/workouts',
      auth: '/api/user'
    }
  })
})

const mongoUri = (process.env.MONGO_URI || '').trim()
if (!mongoUri) { console.error('MONGO_URI missing'); process.exit(1) }
const masked = mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//USER:PASS@')
console.log('Connecting to:', masked)

mongoose.connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected')
    app.use('/api/workouts', workoutsRoutes)
    app.use('/api/user', userRoutes)
    const PORT = process.env.PORT || 4000
    app.listen(PORT, () => console.log('listening on port', PORT))
  })
  .catch(err => {
    console.error('Mongo connection error:', err)
    process.exit(1)
  })
