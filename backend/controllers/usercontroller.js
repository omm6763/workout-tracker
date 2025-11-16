const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

function createToken(_id) {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '3d' })
}

// log in user
const loginUser = async (req, res) =>  {
  const { email, password } = req.body
  try {
    const user = await User.login(email, password)
    const token = createToken(user._id)
    res.status(200).json({ email: user.email, token })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}


// sign up user
const signupUser = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.signup(email, password)
    const token = createToken(user._id)
    res.status(201).json({ email: user.email, token })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

module.exports={loginUser,signupUser}