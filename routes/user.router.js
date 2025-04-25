import express from "express"
import { getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/user.controller.js"

import authorizationMiddleware from "../middlewares/authorization.middleware.js"


const router = express.Router()

router.get("/", authorizationMiddleware(["admin"]), getAllUsers)
router.get("/:id", getUserById)
router.patch("/:id", updateUser)
router.delete("/:id", deleteUser)

export default router