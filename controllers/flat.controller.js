import { FavoriteFlat } from "../models/favoriteflats.model.js";
import { Flat } from "../models/flat.model.js";
import { Message } from "../models/message.model.js";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (fileBuffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const base64 = fileBuffer.toString("base64");
    const dataURI = `data:${mimetype};base64,${base64}`;

    cloudinary.uploader.upload(
      dataURI,
      { folder: "k_home/flats" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
  });
};

const addFlat = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "At least one image is required",
        success: false,
      });
    }

    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer, file.mimetype)
    );
    const uploadedUrls = await Promise.all(uploadPromises);

    const flatData = {
      ...req.body,
      images: uploadedUrls,
    };

    const flat = new Flat(flatData);
    await flat.save();

    return res.status(201).json({
      message: "Flat created successfully",
      success: true,
      data: flat,
    });
  } catch (error) {
    console.error("Error en addFlat:", error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

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
      limit = 10,
    } = req.query;

    const query = {
      deletedAt: null,
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

    const allowedSortFields = [
      "rentPrice",
      "createdAt",
      "areaSize",
      "yearBuilt",
    ];
    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({ message: "invalid field" });
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
        hasMore: pageNumber * pageLimit < total,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const getFlatById = async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id);
    if (!flat) {
      return res.status(404).send({
        message: "Flat not found",
      });
    }
    res.status(200).json({
      success: true,
      data: flat,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const deleteFlat = async (req, res) => {
  const flatId = req.params.id;

  try {
    const flat = await Flat.findById(flatId);
    if (!flat || flat.deletedAt) {
      return res.status(404).json({
        success: false,
        message: "Flat not found, or alredy deleted",
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
      message: "Flat deleted logically",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateFlat = async (req, res) => {
  console.log(req.params.flatId);
  try {
    const flat = await Flat.findByIdAndUpdate(req.params.flatId, req.body, {
      new: true,
      runValidators: true,
    });
    console.log(flat);
    res.status(200).json({
      message: "Update done",
      success: true,
      data: flat,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const restoreFlat = async (req, res) => {
  try {
    const flatId = req.params.id;

    const flat = await Flat.findById(flatId);

    if (!flat) {
      return res.status(404).json({
        success: false,
        message: "Flat not found",
      });
    }

    if (flat.deletedAt === null) {
      return res.status(400).json({
        success: false,
        message: "Flat is alredy active",
      });
    }

    flat.deletedAt = null;
    await flat.save();

    res.status(200).json({
      success: true,
      message: "Flat restored succesfully",
      data: flat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyFlats = async (req, res) => {
  try {
    const flats = await Flat.find({ ownerId: req.params.userId });
    res.status(200).json({
      data: flats,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export {
  addFlat,
  getAllFlats,
  deleteFlat,
  getFlatById,
  updateFlat,
  restoreFlat,
  getMyFlats,
};
