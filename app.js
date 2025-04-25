import express from 'express'
import { connectDB } from './db/db.js'
import userRouter from './routes/user.router.js'
import flatRouter from "./routes/flat.router.js"
import authRouter from "./routes/auth.router.js"


const app = express()
app.use(express.json())
app.use('/users', userRouter)
app.use('/flat', flatRouter)
app.use('/auth', authRouter)

connectDB()

app.listen(8080, () => {
  console.log("server runnint at port 8080")
})