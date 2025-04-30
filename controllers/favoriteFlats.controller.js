import { FavoriteFlat } from "../models/favoriteflats.model.js"

const getAllFavoriteFlat = async (req, res) => {
    try {
        const id = req.params.userId
        const favoriteFlat = await FavoriteFlat.find({ user: id })
        res.status(200).json({
            success: true,
            message: "All Favorites Flats",
            data: favoriteFlat
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const addFavoriteFlat = async (req, res) => {
    try {
        const addFavoriteFlats = new FavoriteFlat(req.body)
        await addFavoriteFlats.save()
        res.status(200).json({
            success: true,
            message: "Favorites Flats created",
            data: addFavoriteFlats
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteFavoriteFlat = async (req, res) => {
    try {
        const deletedFavorite = await FavoriteFlat.findOneAndDelete(req.params.favoriteId)
        if (!deletedFavorite) {
            res.status(404).json({
                success: false,
                message: "Favorite not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Favorites Flats deleted"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

export {
    getAllFavoriteFlat,
    addFavoriteFlat,
    deleteFavoriteFlat
}