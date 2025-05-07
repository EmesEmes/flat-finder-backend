import express from "express"
import {
    addFlat, getAllFlats, deleteFlat, updateFlat, getFlatById
} from "../controllers/flat.controller.js"
import { flatOwnerMiddleware } from "../middlewares/authorization.middleware.js"
import authenticationMiddleware from "../middlewares/authentication.middleware.js"

const router = express.Router()

router.use(authenticationMiddleware)

router.get("/", getAllFlats)
router.get("/:id", getFlatById)
router.patch("/:id", flatOwnerMiddleware, updateFlat)
router.delete("/:id", flatOwnerMiddleware, deleteFlat)
router.post("/", addFlat)

export default router