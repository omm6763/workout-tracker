const express = require('express')
const { getDayPlan, updateDayPlan } = require('../controllers/dayPlanController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// Require auth for all plan routes
router.use(requireAuth)

// GET plan for a date
router.get('/:date', getDayPlan)

// POST to create/update a plan
router.post('/', updateDayPlan)

module.exports = router