import express from "express";
import { body, param } from "express-validator";
import { getAllMessage, addMessage, updateMessage } from "../controllers/message.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { authorizationMiddleware, flatOwnerMiddleware, messageOwner } from "../middlewares/authorization.middleware.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = express.Router();

router.use(authenticationMiddleware)

router.get(
  "/:flatId",
  [param("flatId").isMongoId().withMessage("flatId inválido")],
  validateRequest,
  getAllMessage
);

router.post(
  "/",
  [
    body("content")
      .notEmpty().withMessage("El contenido del mensaje es obligatorio")
      .isString().withMessage("El contenido debe ser un texto"),

    body("flatId")
      .notEmpty().withMessage("flatId es obligatorio")
      .isMongoId().withMessage("flatId inválido"),

    body("senderId")
      .notEmpty().withMessage("senderId es obligatorio")
      .isMongoId().withMessage("senderId inválido")
  ],
  validateRequest,
  addMessage
);

router.patch(
  "/:messageId",
  [
    body("response")
      .notEmpty().withMessage("La respuesta no puede estar vacía")
      .isString().withMessage("La respuesta debe ser texto")
  ],
  validateRequest,
  messageOwner,
  updateMessage
);

export default router;
