import express from "express"
import { getAllFavoriteFlat, addFavoriteFlat, deleteFavoriteFlat } from "../controllers/favoriteFlats.controller.js"

const router = express.Router()

router.get("/:userId", getAllFavoriteFlat)
router.post("/", addFavoriteFlat)
router.delete("/:favoriteId", deleteFavoriteFlat)

export default router