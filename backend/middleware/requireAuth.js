const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {
  // verify user is authenticated
  const { authorization } = req.headers

  console.log("=== AUTH DEBUG ===");
  console.log("Authorization header:", authorization);

  if (!authorization) {
    console.log("No authorization header");
    return res.status(401).json({error: 'Authorization token required'})
  }

  const token = authorization.split(' ')[1]
  console.log("Token extracted:", token ? "exists" : "missing");

  try {
    const { _id } = jwt.verify(token, process.env.SECRET)
    console.log("Token verified, user ID:", _id);

    

    req.user = await User.findOne({ _id }).select('_id')
    console.log("User found:", req.user ? "yes" : "no");
    next()

  } catch (error) {
    console.log("Auth error:", error.message)
    res.status(401).json({error: 'Request is not authorized', details: error.message})
  }
}

module.exports = requireAuth