import express from "express";
import { body, param } from "express-validator";
import { getAllMessage, addMessage, updateMessage } from "../controllers/message.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { authorizationMiddleware, flatOwnerMiddleware, messageOwner } from "../middlewares/authorization.middleware.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = express.Router();

// router.use(authenticationMiddleware)

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
      .notEmpty().withMessage("Content is required")
      .isString().withMessage("Content must be text"),

    body("flatId")
      .notEmpty().withMessage("flatId is required")
      .isMongoId().withMessage("invalid flatId"),

    body("senderId")
      .notEmpty().withMessage("senderId is required")
      .isMongoId().withMessage("invalid senderId")
  ],
  validateRequest,
  addMessage
);

router.patch(
  "/:messageId",
  [
    body("response")
      .notEmpty().withMessage("Response is required")
      .isString().withMessage("Response must be text")
  ],
  validateRequest,
  authenticationMiddleware,
  messageOwner,
  updateMessage
);

export default router;
