import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updatePassword,
  restoreUser,
} from "../controllers/user.controller.js";
import {
  accountOwnerMiddleware,
  authorizationMiddleware,
} from "../middlewares/authorization.middleware.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { body } from "express-validator";

const router = express.Router();

router.use(authenticationMiddleware);

router.get("/", authorizationMiddleware("admin"), getAllUsers);
router.get(
  "/:id",
  accountOwnerMiddleware,
  [
    body("firstName").optional().isLength({ min: 2 }),
    body("lastName").optional().isLength({ min: 2 }),
    body("phone").optional().isLength({ min: 10 }),
    body("birthdate").optional().isISO8601().toDate(),
  ],
  validateRequest,
  getUserById
);
router.patch("/:id", accountOwnerMiddleware, updateUser);
router.delete("/:id", accountOwnerMiddleware, deleteUser);

router.patch(
  "/:id/password",
  accountOwnerMiddleware,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("You must type your current password"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must have at least six character")
      .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}[\]~])/)
      .withMessage(
        "Password must contain at least one character, number and special character"
      ),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Password don't match");
      }
      return true;
    }),
  ],
  validateRequest,
  updatePassword
);
router.patch("/restore/:id", authorizationMiddleware("admin"), restoreUser);

export default router;
