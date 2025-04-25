import mongoose from "mongoose"
import { User } from "./user.model.js"
import { Flat } from "./flat.model.js"


const messageSchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
            require: true,
        },
        content: {
            type: String,
            require: true,
        },
        flatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Flat,
            require: true,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
            require: true,
        },
        createAt: {
            type: Date,
            default: Date.now,
        }
    }
)

export const Message = new mongoose.model("message", messageSchema)
