const SavedWorkout = require('../models/savedWorkoutModel')
const mongoose = require('mongoose')

// Get all saved templates
const getSavedWorkouts = async (req, res) => {
  const user_id = req.user._id
  try {
    const workouts = await SavedWorkout.find({ user_id }).sort({ createdAt: -1 })
    res.status(200).json(workouts)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Create a new template
const createSavedWorkout = async (req, res) => {
  const { title, muscle_group, exercises } = req.body
  try {
    const user_id = req.user._id
    const workout = await SavedWorkout.create({ title, muscle_group, exercises, user_id })
    res.status(200).json(workout)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Delete a template
const deleteSavedWorkout = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ error: 'No such workout' })
  const workout = await SavedWorkout.findOneAndDelete({ _id: id })
  if (!workout) return res.status(400).json({ error: 'No such workout' })
  res.status(200).json(workout)
}

module.exports = { getSavedWorkouts, createSavedWorkout, deleteSavedWorkout }