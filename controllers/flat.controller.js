import { Flat } from "../models/flat.model.js";

const saveFlat = async (req, res) => {
    try {
        const flat = new Flat(req.body)
        await flat.save()
        res.status(201).json({
            message: "Flat created successfully",
            success: true,
            data: flat
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
}
const getAllFlats = async (req, res) => {
    try {
        const flats = await Flat.find()
        res.status(201).json({
            success: true,
            data: flats
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
}
export {
    saveFlat,
    getAllFlats
}