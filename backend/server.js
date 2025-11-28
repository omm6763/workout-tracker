require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const workoutRoutes = require('./routes/workouts')
const userRoutes = require('./routes/user')
const planRoutes = require('./routes/plans')
const savedWorkoutRoutes = require('./routes/savedWorkouts') // NEW IMPORT

const app = express()

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

app.use('/api/workouts', workoutRoutes)
app.use('/api/user', userRoutes)
app.use('/api/plans', planRoutes)
app.use('/api/saved-workouts', savedWorkoutRoutes) // NEW ROUTE

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })