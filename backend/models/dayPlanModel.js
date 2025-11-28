const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dayPlanSchema = new Schema({
  user_id: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  exercises: [{
    name: { type: String, required: true },
    muscle: { type: String },
    target_sets: { type: Number },
    target_reps: { type: Number },
    isCompleted: { type: Boolean, default: false }
  }]
}, { timestamps: true })

dayPlanSchema.index({ user_id: 1, date: 1 }, { unique: true })

module.exports = mongoose.model('DayPlan', dayPlanSchema)