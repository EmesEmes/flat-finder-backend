import { User } from "../models/user.model.js"

const saveUser = async (req, res) => {
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

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.status(201).json({
      success: true,
      data: users
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false
    })
  }
}

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).send({
        message: "User not found"
      })
    }
    res.send(user)
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false
    })
  }
}

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    res.status(200).json({
      message: "Update done",
      success: true,
      data: user
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false
    })
  }
}

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      res.status(404).json({
        message: "user not found",
        success: false
      })
    }
    res.status(200).json({
      message: "user deleted successfully",
      success: true
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false
    })
  }
}


export {
  saveUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
}

