import { Flat } from "../models/flat.model.js";

const addFlat = async (req, res) => {
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

const getFlatById = async (req, res) => {
    try {
        const flat = await Flat.findById(req.params.id)
        if (!flat) {
            return res.status(404).send({
                message: "Flat not found"
            })
        }
        res.send(flat)
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

const deleteFlat = async (req, res) => {
    try {
        const flat = await Flat.findByIdAndDelete(req.params.id)
        if (!flat) {
            res.status(404).json({
                message: "Flat not found",
                success: false
            })
        }
        res.status(200).json({
            message: "flat deleted successfully",
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
}
const updateFlat = async (req, res) => {
    try {
        const flat = await Flat.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        res.status(200).json({
            message: "Update done",
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

export {
    addFlat,
    getAllFlats,
    deleteFlat,
    getFlatById,
    updateFlat
}