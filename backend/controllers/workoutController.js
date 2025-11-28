const Workout = require('../models/workoutModel')
const mongoose = require('mongoose')

// ... (getWorkouts, getWorkoutStats, getWorkout remain same) ...

// 1. Get All Workouts (with pagination)
exports.getWorkouts = async (req, res) => {
  const user_id = req.user._id
  const page = Math.max(1, parseInt(req.query.page) || 1)
  const limit = Math.max(1, parseInt(req.query.limit) || 10)
  const skip = (page - 1) * limit

  try {
    // Sort by createdAt descending (newest first)
    const workouts = await Workout.find({ user_id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const count = await Workout.countDocuments({ user_id })

    res.status(200).json({
      workouts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalWorkouts: count
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// 2. Get Analytics Stats
exports.getWorkoutStats = async (req, res) => {
  const user_id = req.user._id;
  try {
    const objectId = new mongoose.Types.ObjectId(String(user_id));
    const stats = await Workout.aggregate([
      { 
        $match: { 
            $or: [{ user_id: objectId }, { user_id: String(user_id) }],
            completed: true 
        } 
      },
      {
        $addFields: {
            volume: { $multiply: ["$load", "$reps"] },
            est1RM: { $multiply: ["$load", { $add: [1, { $divide: ["$reps", 30] }] }] }
        }
      },
      {
        $group: {
          _id: "$title",
          data: { 
            $push: { 
              date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              load: "$load",
              volume: "$volume",
              oneRepMax: "$est1RM"
            } 
          },
          maxLoad: { $max: "$load" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    res.status(200).json(stats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

exports.getWorkout = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ error: 'No such workout' })
  const workout = await Workout.findById(id)
  if (!workout) return res.status(404).json({ error: 'No such workout' })
  res.status(200).json(workout)
}

// 4. Create Workout (UPDATED TO ACCEPT CREATED_AT)
exports.createWorkout = async (req, res) => {
  const { title, load, reps, completed, createdAt } = req.body // Added createdAt

  let emptyFields = []
  if (!title) emptyFields.push('title')
  if (!load) emptyFields.push('load')
  if (!reps) emptyFields.push('reps')
  if (emptyFields.length > 0) return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })

  try {
    const user_id = req.user._id
    
    // Create object with optional createdAt
    const workoutData = { title, load, reps, user_id, completed: completed || false }
    if (createdAt) {
        workoutData.createdAt = new Date(createdAt) // Manually set date if provided
    }

    const workout = await Workout.create(workoutData)
    res.status(200).json(workout)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// 5. Delete Workout
exports.deleteWorkout = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ error: 'No such workout' })
  const workout = await Workout.findOneAndDelete({ _id: id })
  if (!workout) return res.status(400).json({ error: 'No such workout' })
  res.status(200).json(workout)
}

// 6. Update Workout
exports.updateWorkout = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ error: 'No such workout' })
  const workout = await Workout.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true })
  if (!workout) return res.status(400).json({ error: 'No such workout' })
  res.status(200).json(workout)
}