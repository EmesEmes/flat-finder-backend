import express from "express"
import { saveUser } from "../controllers/user.controller.js"

const router = express.Router()

router.post("/register", saveUser)

export default router