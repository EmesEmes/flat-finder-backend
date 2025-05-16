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
    body("city").notEmpty().withMessage("La ciudad es obligatoria"),
    body("streetName").notEmpty().withMessage("La calle es obligatoria"),
    body("streetNumber").isNumeric().withMessage("Debe ser número"),
    body("areaSize").isNumeric().withMessage("Área debe ser número"),
    body("yearBuilt")
      .isInt({ min: 1800, max: new Date().getFullYear() })
      .withMessage("Año inválido"),
    body("hasAC").isBoolean().withMessage("Debe ser true o false"),
    body("rentPrice").isNumeric().withMessage("Debe ser número"),
    body("dateAvailable").isISO8601().toDate().withMessage("Fecha inválida"),
    body("latitude").notEmpty().withMessage("Latitud inválida"),
    body("longitude").notEmpty().withMessage("Longitud inválida"),
    body("ownerId").isMongoId().withMessage("ID de dueño inválido")
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
