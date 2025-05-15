import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/register", 
  [
    body("firstName")
      .notEmpty().withMessage("Name is required.")
      .isLength({ min: 2 }).withMessage("Name must have at least two characters."),

    body("lastName")
      .notEmpty().withMessage("Lastname is required.")
      .isLength({ min: 2 }).withMessage("Lastname must have at least two characters."),

    body("phone")
      .notEmpty().withMessage("Phone number is required.")
      .isLength({ min: 10 }).withMessage("Phone number must have at least ten numbers."),

    body("email")
      .isEmail().withMessage("Email is required")
      .custom(async (email) => {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error("Este correo ya está registrado");
        }
      }),

    body("password")
      .isLength({ min: 6 }).withMessage("The password must be at least 6 characters long.")
      .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}[\]~])/)
      .withMessage("The password must contain at least one letter, one number and one special character"),

    body("birthdate")
      .notEmpty().withMessage("birthdate is required")
      .isISO8601().toDate()
      .custom((value) => {
        const today = new Date();
        const birthDate = new Date(value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 18 || age > 120) {
          throw new Error("The age must be between 18 and 120 years");
        }
        return true;
      }),

    body("role")
      .optional()
      .isIn(["user", "admin"])
      .withMessage("Invalid role")
  ],
  validateRequest,
  register);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Must provide a valid email"),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
  ],
  validateRequest,
  login);

export default router;
