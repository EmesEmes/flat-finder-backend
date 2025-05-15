import express from "express";
import {
  toggleFavoriteFlat,
  getAllFavoriteFlats,
  deleteFavoriteFlat
} from "../controllers/favoriteFlats.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import { accountOwnerMiddleware } from "../middlewares/authorization.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { body } from "express-validator";

const router = express.Router();

router.use(authenticationMiddleware);

router.post(
  "/toggle",
  [
    body("userId").isMongoId().withMessage("userId inválido"),
    body("flatId").isMongoId().withMessage("flatId inválido")
  ],
  validateRequest,
  toggleFavoriteFlat
);

router.get("/:userId", accountOwnerMiddleware, getAllFavoriteFlats);

router.delete(
  "/",
  [
    body("userId").isMongoId().withMessage("userId inválido"),
    body("flatId").isMongoId().withMessage("flatId inválido")
  ],
  validateRequest,
  deleteFavoriteFlat
);

export default router;
