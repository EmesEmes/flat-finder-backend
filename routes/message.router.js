import express from "express"
import { getAllMessage, addMessage, updateMessage } from "../controllers/message.controller.js"

const router = express.Router()

router.get("/:flatId", getAllMessage)
router.post("/", addMessage)
router.patch("/:flatId", updateMessage)

export default router

