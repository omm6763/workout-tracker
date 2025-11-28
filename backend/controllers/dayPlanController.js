const DayPlan = require('../models/dayPlanModel')
const mongoose = require('mongoose')

// Get plan for a specific date
const getDayPlan = async (req, res) => {
  const { date } = req.params
  const user_id = req.user._id

  try {
    const plan = await DayPlan.findOne({ user_id, date })
    
    if (!plan) {
      // Return an empty template if no plan exists yet
      return res.status(200).json({ date, exercises: [] })
    }
    
    res.status(200).json(plan)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Create or Update plan
const updateDayPlan = async (req, res) => {
  const { date, exercises } = req.body
  const user_id = req.user._id

  if (!date) {
    return res.status(400).json({ error: 'Date is required' })
  }

  try {
    // upsert: true means "create if not exists, update if it does"
    const plan = await DayPlan.findOneAndUpdate(
      { user_id, date },
      { exercises },
      { new: true, upsert: true } 
    )
    res.status(200).json(plan)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = { getDayPlan, updateDayPlan }