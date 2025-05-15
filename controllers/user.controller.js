import { FavoriteFlat } from "../models/favoriteflats.model.js"
import { Flat } from "../models/flat.model.js"
import { Message } from "../models/message.model.js"
import { User } from "../models/user.model.js"

const saveUser = async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    res.status(201).json({
      message: "User created succesfully",
      success: true,
      data: user
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: error.message,
      success: false
    })
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      deletedAt: null
    })
    res.status(201).json({
      success: true,
      data: users
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false
    })
  }
}

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).send({
        message: "User not found"
      })
    }
    res.send(user)
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false
    })
  }
}

const updateUser = async (req, res) => {
  try {
    const allowedFields = ["firstName", "lastName", "phone", "birthdate", "image"]
    const updates = {}

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field]
      }
    })

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado", success: false })
    }

    res.status(200).json({
      message: "Usuario actualizado correctamente",
      success: true,
      data: user,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    })
  }
}

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    const flats = await Flat.find({ ownerId: userId, deletedAt: null });
    const flatIds = flats.map(flat => flat._id);

    await Flat.updateMany(
      { _id: { $in: flatIds } },
      { $set: { deletedAt: new Date() } }
    );

    await Message.deleteMany({ flatId: { $in: flatIds } });
    await FavoriteFlat.deleteMany({
      $or: [{ flat: { $in: flatIds } }, { user: userId }]
    });

    res.status(200).json({
      success: true,
      message: "Usuario eliminado lógicamente y datos relacionados borrados"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado", success: false });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña actual incorrecta", success: false });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Contraseña actualizada con éxito", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const restoreUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user || user.deletedAt === null) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado o ya está activo"
      });
    }

    // Restaurar usuario
    user.deletedAt = null;
    await user.save();

    // Restaurar sus flats eliminados
    const restoredFlats = await Flat.updateMany(
      { ownerId: userId, deletedAt: { $ne: null } },
      { $set: { deletedAt: null } }
    );

    res.status(200).json({
      success: true,
      message: `Usuario y ${restoredFlats.modifiedCount} flat(s) restaurados correctamente`,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export {
  saveUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updatePassword,
  restoreUser
}