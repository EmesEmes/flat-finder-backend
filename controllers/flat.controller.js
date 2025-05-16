import { FavoriteFlat } from "../models/favoriteflats.model.js"
import { Flat } from "../models/flat.model.js"
import { Message } from "../models/message.model.js"

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
    const {
      city,
      hasAC,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 10
    } = req.query;

    const query = {
      deletedAt: null // ← muy importante para excluir flats eliminados lógicamente
    };

    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    if (hasAC !== undefined) {
      query.hasAC = hasAC === "true";
    }

    if (minPrice || maxPrice) {
      query.rentPrice = {};
      if (minPrice) query.rentPrice.$gte = Number(minPrice);
      if (maxPrice) query.rentPrice.$lte = Number(maxPrice);
    }

    if (minArea || maxArea) {
      query.areaSize = {};
      if (minArea) query.areaSize.$gte = Number(minArea);
      if (maxArea) query.areaSize.$lte = Number(maxArea);
    }

    // Validación de campos de ordenamiento (opcional pero recomendado)
    const allowedSortFields = ["rentPrice", "createdAt", "areaSize", "yearBuilt"];
    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({ message: "Campo de ordenamiento no válido" });
    }

    const pageNumber = Number(page);
    const pageLimit = Number(limit);
    const skip = (pageNumber - 1) * pageLimit;

    const flats = await Flat.find(query)
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(pageLimit);

    const total = await Flat.countDocuments(query);

    res.status(200).json({
      success: true,
      data: flats,
      pagination: {
        total,
        page: pageNumber,
        limit: pageLimit,
        totalPages: Math.ceil(total / pageLimit),
        hasMore: pageNumber * pageLimit < total
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false
    });
  }
};

const getFlatById = async (req, res) => {
    try {
        const flat = await Flat.findById(req.params.id)
        if (!flat) {
            return res.status(404).send({
                message: "Flat not found"
            })
        }
        res.status(200).json({
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

const deleteFlat = async (req, res) => {
  const flatId = req.params.id;

  try {
    const flat = await Flat.findById(flatId);
    if (!flat || flat.deletedAt) {
      return res.status(404).json({
        success: false,
        message: "Flat no encontrado o ya eliminado"
      });
    }

    // Borrado lógico del flat
    flat.deletedAt = new Date();
    await flat.save();

    // Borrado físico de mensajes relacionados
    await Message.deleteMany({ flatId });

    // Borrado físico de favoritos relacionados
    await FavoriteFlat.deleteMany({ flat: flatId });

    res.status(200).json({
      success: true,
      message: "Flat eliminado lógicamente, mensajes y favoritos eliminados"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
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

const restoreFlat = async (req, res) => {
  try {
    const flatId = req.params.id;

    const flat = await Flat.findById(flatId);

    if (!flat) {
      return res.status(404).json({
        success: false,
        message: "Flat no encontrado"
      });
    }

    if (flat.deletedAt === null) {
      return res.status(400).json({
        success: false,
        message: "El flat ya está activo"
      });
    }

    flat.deletedAt = null;
    await flat.save();

    res.status(200).json({
      success: true,
      message: "Flat restaurado correctamente",
      data: flat
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export {
    addFlat,
    getAllFlats,
    deleteFlat,
    getFlatById,
    updateFlat,
    restoreFlat
}