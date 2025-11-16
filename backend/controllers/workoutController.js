const Workout = require('../models/workoutModel')
const mongoose = require('mongoose')


// get all workouts
exports.getWorkouts = async (req, res) => {
  const workouts = await Workout.find({ user_id: req.user._id }).sort({ createdAt: -1 })
  res.status(200).json(workouts)
}

// get a single workout (scoped to user)
exports.getWorkout = async (req, res) => {
  const { id } = req.params
  const workout = await Workout.findOne({ _id: id, user_id: req.user._id })
  if (!workout) return res.status(404).json({ error: 'Not found' })
  res.status(200).json(workout)
}

// create a new workout
exports.createWorkout = async (req, res) => {
  const workout = await Workout.create({ ...req.body, user_id: req.user._id })
  res.status(201).json(workout)
}

// delete a workout
exports.deleteWorkout = async (req, res) => {
  const { id } = req.params
  const workout = await Workout.findOneAndDelete({ _id: id, user_id: req.user._id })
  if (!workout) return res.status(404).json({ error: 'Not found' })
  res.status(200).json(workout)
}

// update a workout
exports.updateWorkout = async (req, res) => {
  const { id } = req.params
  const workout = await Workout.findOneAndUpdate(
    { _id: id, user_id: req.user._id },
    { ...req.body },
    { new: true }
  )
  if (!workout) return res.status(404).json({ error: 'Not found' })
  res.status(200).json(workout)
}