const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

module.exports = async function requireAuth(req, res, next) {
  const { authorization } = req.headers
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' })
  }
  const token = authorization.split(' ')[1]
  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(_id).select('_id email')
    if (!req.user) return res.status(401).json({ error: 'User not found' })
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Request is not authorized' })
  }
}