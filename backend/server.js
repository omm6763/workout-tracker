require('dotenv').config({ override: true })

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const workoutsRoutes = require('./routes/workouts')
const userRoutes = require('./routes/user')

const app = express()

app.use(express.json())
app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'] }))

// Log every request (method + path)
app.use((req, _res, next) => { console.log(req.method, req.path); next() })

// Health check (before DB)
app.get('/api/health', (_req, res) => res.json({ ok: true }))

const mongoUri = (process.env.MONGO_URI || '').trim()
if (!mongoUri) { console.error('MONGO_URI missing'); process.exit(1) }
if (/USER:PASS@CLUSTER/i.test(mongoUri)) {
  console.error('MONGO_URI still contains placeholders'); process.exit(1)
}
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
  .catch(err => { console.error('Mongo connection error:', err); process.exit(1) })
