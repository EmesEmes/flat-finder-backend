import { FavoriteFlat } from "../models/favoriteflats.model.js";
import { Flat } from "../models/flat.model.js";

// 🔁 Agrega o elimina un flat de favoritos
const toggleFavoriteFlat = async (req, res) => {
  const { userId, flatId } = req.body;

  try {
    const existing = await FavoriteFlat.findOne({ user: userId, flat: flatId });

    if (existing) {
      await FavoriteFlat.findByIdAndDelete(existing._id);
      return res.status(200).json({
        success: true,
        message: "Flat removed from favorites"
      });
    }

    const newFavorite = new FavoriteFlat({ user: userId, flat: flatId });
    await newFavorite.save();

    res.status(201).json({
      success: true,
      message: "Flat added to favorites",
      data: newFavorite
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📥 Obtiene todos los flats favoritos del usuario con filtros y paginación
const getAllFavoriteFlats = async (req, res) => {
  try {
    const userId = req.params.userId;
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

    const favorites = await FavoriteFlat.find({ user: userId });
    const flatIds = favorites.map(f => f.flat);

    if (!flatIds.length) {
      return res.status(200).json({
        success: true,
        message: "No hay flats favoritos",
        data: [],
        pagination: {
          total: 0,
          page: 1,
          totalPages: 0,
          hasMore: false
        }
      });
    }

    const query = {
      _id: { $in: flatIds },
      deletedAt: null
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
      message: "Flats favoritos encontrados",
      data: flats,
      pagination: {
        total,
        page: pageNumber,
        totalPages: Math.ceil(total / pageLimit),
        hasMore: pageNumber * pageLimit < total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ❌ (opcional) Eliminar favorito manualmente con userId + flatId
const deleteFavoriteFlat = async (req, res) => {
  try {
    const { userId, flatId } = req.body;

    const deleted = await FavoriteFlat.findOneAndDelete({ user: userId, flat: flatId });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Favorite not found" });
    }

    res.status(200).json({ success: true, message: "Favorite removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  toggleFavoriteFlat,
  getAllFavoriteFlats,
  deleteFavoriteFlat
};
