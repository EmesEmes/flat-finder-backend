import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"

const register = async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        res.status(201).json({
            message: "User created succesfully",
            success: true,
            data: user
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" })
        }
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        )
        res.json({ token })
    } catch (error) {
        res.status(500).json({ message: "error" })
    }
}

export { login, register }