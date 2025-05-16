import { FavoriteFlat } from "../models/favoriteflats.model.js";
import { Flat } from "../models/flat.model.js";


const toggleFavoriteFlat = async (req, res) => {
  const { user, flatId } = req.body;
  try {
    const existing = await FavoriteFlat.findOne({ user: user, flatId: flatId });
    if (existing) {
      await FavoriteFlat.findByIdAndDelete(existing._id);
      return res.status(200).json({
        success: true,
        message: "Flat removed from favorites"
      });
    }

    const newFavorite = new FavoriteFlat({ user: user, flatId: flatId });
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

const getAllFavoriteFlats = async (req, res) => {
  // try {
  //   const user = req.params.userId
  //   const favorites = await FavoriteFlat.find({ user: user }).populate("flatId")
  //   res.status(200).json({
  //     success: true,
  //     data: favorites
  //   })
  // } catch (error) {
  //   res.status(500).json({ success: false, message: error.message })
  // }
  try {
    const user = req.params.userId;

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

    const allowedSortFields = ["rentPrice", "createdAt", "areaSize", "yearBuilt"];
    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({ message: "Campo de ordenamiento no válido" });
    }

    // 1. Buscar favoritos con flat poblado y su dueño también
    const favorites = await FavoriteFlat
      .find({ user })
      .populate({
        path: "flatId",
        match: { deletedAt: null }, // excluir flats eliminados lógicamente
        populate: {
          path: "ownerId",
          model: "users"
        }
      });

    // 2. Extraer los flats existentes
    let flats = favorites
      .map(f => f.flatId)
      .filter(flat => flat); // descarta nulls si el match falló

    // 3. Filtros
    if (city) {
      flats = flats.filter(flat => flat.city.toLowerCase().includes(city.toLowerCase()));
    }
    if (hasAC !== undefined) {
      const hasACBool = hasAC === "true";
      flats = flats.filter(flat => flat.hasAC === hasACBool);
    }
    if (minPrice || maxPrice) {
      flats = flats.filter(flat => {
        return (!minPrice || flat.rentPrice >= Number(minPrice)) &&
               (!maxPrice || flat.rentPrice <= Number(maxPrice));
      });
    }
    if (minArea || maxArea) {
      flats = flats.filter(flat => {
        return (!minArea || flat.areaSize >= Number(minArea)) &&
               (!maxArea || flat.areaSize <= Number(maxArea));
      });
    }

    // 4. Ordenamiento
    flats.sort((a, b) => {
      const direction = order === "asc" ? 1 : -1;
      return (a[sortBy] - b[sortBy]) * direction;
    });

    // 5. Paginación
    const pageNumber = Number(page);
    const pageLimit = Number(limit);
    const start = (pageNumber - 1) * pageLimit;
    const paginated = flats.slice(start, start + pageLimit);

    // 6. Respuesta
    res.status(200).json({
      success: true,
      message: "Flats favoritos encontrados",
      data: paginated,
      pagination: {
        total: flats.length,
        page: pageNumber,
        totalPages: Math.ceil(flats.length / pageLimit),
        hasMore: start + pageLimit < flats.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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
