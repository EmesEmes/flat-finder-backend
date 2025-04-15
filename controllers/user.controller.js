import { User } from "../models/user.model.js"

const saveUser = async(req, res) => {
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

export {
  saveUser
}