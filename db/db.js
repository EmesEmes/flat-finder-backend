import mongoose from "mongoose"

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log("Data Base Connected Succesfully")
  } catch (error) {
    console.error("Error, Data Base can not be connected")
  }
}