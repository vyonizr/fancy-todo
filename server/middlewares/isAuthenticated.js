const jwt = require("jsonwebtoken")

module.exports = function isAuthenticated(req, res, next) {
  if (req.headers.authentication) {
    const decodedToken = jwt.verify(req.headers.authentication, process.env.JWT_SECRET)
    req.authenticatedUser = decodedToken
    next()
  }
  // else if (req.query.token) {
  //   const decodedToken = jwt.verify(req.query.token, process.env.JWT_SECRET)
  //   req.authenticatedUser = decodedToken
  //   next()
  // }
  else {
    res.status(401).json({
      message: "You are not authenticated. Please login."
    })
  }
}