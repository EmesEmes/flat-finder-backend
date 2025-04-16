import express from "express"
import { saveFlat, getAllFlats } from "../controllers/flat.controller.js"

const router = express.Router()

router.post("/", saveFlat)
router.get("/", getAllFlats)

export default router