import express from "express";
import {
  addFlat,
  getAllFlats,
  deleteFlat,
  updateFlat,
  getFlatById,
  restoreFlat,
  getMyFlats
} from "../controllers/flat.controller.js";
import { accountOwnerMiddleware, flatOwnerMiddleware } from "../middlewares/authorization.middleware.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { body } from "express-validator";

const router = express.Router();

router.get("/", getAllFlats);
router.get("/:id", getFlatById);


router.use(authenticationMiddleware);


router.post(
  "/",
  [
    body("city").notEmpty().withMessage("City is required"),
    body("streetName").notEmpty().withMessage("Street name is required"),
    body("streetNumber").isNumeric().withMessage("Street number must be a valid numbers"),
    body("areaSize").isNumeric().withMessage("Area size must be a valid number"),
    body("yearBuilt")
      .isInt({ min: 1800, max: new Date().getFullYear() })
      .withMessage("invalid year"),
    body("hasAC").isBoolean().withMessage("AC is required"),
    body("rentPrice").isNumeric().withMessage("rent price must be a valid number"),
    body("dateAvailable").isISO8601().toDate().withMessage("Invalid Date"),
    body("latitude").notEmpty().withMessage("latitude is required"),
    body("longitude").notEmpty().withMessage("Longitude is required"),
    body("ownerId").isMongoId().withMessage("Invalid owner Id")
  ],
  validateRequest,
  addFlat
);


router.patch(
  "/:flatId",
  flatOwnerMiddleware,
  [
    body("city").optional().isString(),
    body("streetName").optional().isString(),
    body("streetNumber").optional().isNumeric(),
    body("areaSize").optional().isNumeric(),
    body("yearBuilt").optional().isInt({ min: 1800, max: new Date().getFullYear() }),
    body("hasAC").optional().isBoolean(),
    body("rentPrice").optional().isNumeric(),
    body("dateAvailable").optional().isISO8601().toDate(),
    body("latitude").optional().isFloat(),
    body("longitude").optional().isFloat(),
    body("ownerId").optional().isMongoId()
  ],
  validateRequest,
  updateFlat
);
router.get("/my-flats/:userId",accountOwnerMiddleware, getMyFlats)
router.delete("/:id", flatOwnerMiddleware, deleteFlat);
router.patch("/restore/:id", flatOwnerMiddleware, restoreFlat);

export default router;
