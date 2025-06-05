import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"


const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided", success: false })
  }

  try {
    // 1. Extraer token y verificarlo
    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 2. Buscar al usuario en base de datos (sin la contraseña)
    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false })
    }

    // 3. Adjuntar el usuario a req.user
    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: "Invalid token", success: false })
  }
}

export default authenticationMiddleware
