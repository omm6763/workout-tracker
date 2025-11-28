const express = require('express')
const { getSavedWorkouts, createSavedWorkout, deleteSavedWorkout } = require('../controllers/savedWorkoutController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()
router.use(requireAuth)

router.get('/', getSavedWorkouts)
router.post('/', createSavedWorkout)
router.delete('/:id', deleteSavedWorkout)

module.exports = router