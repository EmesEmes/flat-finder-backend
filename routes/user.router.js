import express from "express"
import { saveUser, getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/user.controller.js"


const router = express.Router()

router.post("/register", saveUser)
router.get("/", getAllUsers)
router.get("/:id", getUserById)
router.patch("/:id", updateUser)
router.delete("/:id", deleteUser)

export default router