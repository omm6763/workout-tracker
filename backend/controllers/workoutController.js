const Workout = require('../models/workoutModel')
const mongoose = require('mongoose')

// 1. Get All Workouts (with pagination)
exports.getWorkouts = async (req, res) => {
  const user_id = req.user._id
  
  const page = Math.max(1, parseInt(req.query.page) || 1)
  const limit = Math.max(1, parseInt(req.query.limit) || 10)
  const skip = (page - 1) * limit

  try {
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

// 2. Get Analytics Stats (With IDs for Deletion)
exports.getWorkoutStats = async (req, res) => {
  const user_id = req.user._id;

  try {
    const objectId = new mongoose.Types.ObjectId(String(user_id));

    const stats = await Workout.aggregate([
      { 
        $match: { 
          $or: [
            { user_id: objectId },
            { user_id: String(user_id) }
          ]
        } 
      },
      {
        $group: {
          _id: "$title",
          data: { 
            $push: { 
              date: "$createdAt", 
              load: "$load",
              id: "$_id" // Include ID so we can delete it!
            } 
          },
          maxLoad: { $max: "$load" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    
    res.status(200).json(stats);
  } catch (error) {
    console.error("[Analytics] Error:", error);
    res.status(400).json({ error: error.message });
  }
}

// 3. Get Single Workout
exports.getWorkout = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout' })
  }
  const workout = await Workout.findById(id)
  if (!workout) {
    return res.status(404).json({ error: 'No such workout' })
  }
  res.status(200).json(workout)
}

// 4. Create Workout
exports.createWorkout = async (req, res) => {
  const { title, load, reps } = req.body

  let emptyFields = []
  if (!title) emptyFields.push('title')
  if (!load) emptyFields.push('load')
  if (!reps) emptyFields.push('reps')
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
  }

  try {
    const user_id = req.user._id
    const currentMax = await Workout.findOne({ user_id, title }).sort({ load: -1 })
    const isNewPR = !currentMax || load > currentMax.load

    const workout = await Workout.create({ title, load, reps, user_id })
    res.status(200).json({ ...workout._doc, isNewPR })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// 5. Delete Workout
exports.deleteWorkout = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout' })
  }
  const workout = await Workout.findOneAndDelete({ _id: id })
  if (!workout) {
    return res.status(400).json({ error: 'No such workout' })
  }
  res.status(200).json(workout)
}

// 6. Update Workout
exports.updateWorkout = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout' })
  }
  const workout = await Workout.findOneAndUpdate({ _id: id }, { ...req.body })
  if (!workout) {
    return res.status(400).json({ error: 'No such workout' })
  }
  res.status(200).json(workout)
}