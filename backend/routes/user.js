const express = require('express')
const { loginUser, signupUser } = require('../controllers/usercontroller')
const router = express.Router()

router.post('/login', loginUser)
router.post('/signup', signupUser)

module.exports = router