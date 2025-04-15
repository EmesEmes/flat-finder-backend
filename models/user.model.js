import mongoose from "mongoose";
import bcryp from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Name is required"],
    minlength: [2, "Name must have at least two characters"],
  },
  lastName: {
    type: String,
    required: [true, "Lastname is required"],
    minlength: [2, "Lastname must have at least two characters"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    minlength: [2, "Phone number must have at least ten numbers"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/^\S+@\S+\.\S+$/, "Por favor ingresa un email válido"],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    validate: {
      validator: function (v) {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}[\]~])[A-Za-z\d!@#$%^&*()_\-+=<>?{}[\]~]{6,}$/.test(
          v
        );
      },
      message:
        "The password must contain at least one letter, one number and one special character",
    },
  },
  birthdate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          return age - 1 >= 18 && age - 1 <= 120;
        }
        return age >= 18 && age <= 120;
      },
      message: "La edad debe estar entre 18 y 120 años",
    },
  },
  image: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    try {
      const salt = await bcryp.genSalt(10);
      user.password = await bcryp.hash(user.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

export const User = mongoose.model("users", userSchema);
