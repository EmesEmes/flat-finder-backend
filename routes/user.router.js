import express from "express"
import { getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/user.controller.js"
import { accountOwnerMiddleware, authorizationMiddleware } from "../middlewares/authorization.middleware.js"
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = express.Router()

router.use(authenticationMiddleware);

router.get("/", authorizationMiddleware("admin"), getAllUsers)
router.get("/:id", getUserById)
router.patch("/:id", accountOwnerMiddleware, updateUser)
router.delete("/:id", accountOwnerMiddleware, deleteUser)

export default router