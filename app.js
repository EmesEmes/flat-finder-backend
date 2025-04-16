import express from 'express'
import { connectDB } from './db/db.js'
import userRouter from './routes/user.router.js'
import flatRouter from "./routes/flat.router.js"

const app = express()
app.use(express.json())
app.use('/auth', userRouter)
app.use('/flat', flatRouter)
connectDB()

app.listen(8080, () => {
  console.log("server runnint at port 8080")
})