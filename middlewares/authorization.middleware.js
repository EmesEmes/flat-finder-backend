
const authorizationMiddleware = (roles) => (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(403).json({ message: "Access denied, no role provided" })
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied, invalid role" })
  }
  next()
}

export default authorizationMiddleware
