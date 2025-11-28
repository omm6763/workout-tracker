const mongoose = require('mongoose')
const Schema = mongoose.Schema

const savedWorkoutSchema = new Schema({
  user_id: { type: String, required: true },
  title: { type: String, required: true }, // e.g., "Leg Day A"
  muscle_group: { type: String, required: true }, // e.g., "Legs"
  exercises: [{
    name: { type: String, required: true },
    sets: { type: Number, default: 3 },
    reps: { type: Number, default: 10 }
  }]
}, { timestamps: true })

module.exports = mongoose.model('SavedWorkout', savedWorkoutSchema)