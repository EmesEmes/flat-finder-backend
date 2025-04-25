import express from "express"
import {
    addFlat, getAllFlats, deleteFlat, updateFlat, getFlatById
} from "../controllers/flat.controller.js"

const router = express.Router()


router.get("/", getAllFlats)
router.patch("/:id", updateFlat)
router.post("/", addFlat)
router.delete("/:id", deleteFlat)
router.get("/:id", getFlatById)


export default router