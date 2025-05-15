import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Name is required"],
    minlength: [2, "Name must have at least two characters"],
  },
  lastName: {
    type: String,
    required: [true, "Lastname is required."],
    minlength: [2, "Lastname must have at least two characters."],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required."],
    minlength: [10, "Phone number must have at least ten numbers."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address."],
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "The password must be at least 6 characters long."],
    select: false,
    validate: {
      validator: function (v) {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}[\]~])[A-Za-z\d!@#$%^&*()_\-+=<>?{}[\]~]{6,}$/.test(
          v
        )
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
        const today = new Date()
        const birthDate = new Date(value)
        const age = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          return age - 1 >= 18 && age - 1 <= 120
        }
        return age >= 18 && age <= 120
      },
      message: "The age must be between 18 and 120 years",
    },
  },
  image: {
    type: String
  },
  role: {
    type: String,
    default: "user"
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
  }
})

userSchema.pre("save", async function (next) {
  const user = this
  if (user.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(user.password, salt)
      next()
    } catch (error) {
      next(error)
    }
  } else {
    next()
  }
})

userSchema.methods.comparePassword = async function (plainPassword) {
  const validationResult = await bcrypt.compare(plainPassword, this.password)
  return validationResult
}

export const User = mongoose.model("users", userSchema)