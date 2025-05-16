import express from 'express'
import dotenv from "dotenv"
import { connectDB } from './db/db.js'
import userRouter from './routes/user.router.js'
import flatRouter from "./routes/flat.router.js"
import authRouter from "./routes/auth.router.js"
import messageRouter from "./routes/message.router.js"
import favoriteFlatsRouter from './routes/favoriteFlats.router.js'
import cors from "cors"

dotenv.config()

const app = express()
app.use(cors());
app.use(express.json())
app.use('/users', userRouter)
app.use('/flats', flatRouter)
app.use('/auth', authRouter)
app.use('/messages', messageRouter)
app.use('/favorites', favoriteFlatsRouter)

connectDB()

app.listen(8080, () => {
  console.log("server runnint at port 8080")
}) 