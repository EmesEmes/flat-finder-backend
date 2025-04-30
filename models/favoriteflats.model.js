import mongoose from "mongoose"
import { User } from "./user.model.js"
import { Flat } from "./flat.model.js"

const favoriteFlatSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
            require: true,
        },
        flatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Flat,
            require: true,
        }
    }
)
export const FavoriteFlat = new mongoose.model("favoriteFlats", favoriteFlatSchema)