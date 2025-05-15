import { Flat } from "../models/flat.model.js";
import { User } from "../models/user.model.js";

const authorizationMiddleware = (roles) => (req, res, next) => {
  console.log(roles);
  if (!req.user || !req.user.role) {
    return res.status(403).json({ message: "Access denied, no role provided" });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied, invalid role" });
  }

  next();
};

const accountOwnerMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if(!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }
    if (req.params.id != req.user.userId && req.user.role != "admin")
      return res.status(403).json({ message: "Access denied for User" });
    next();
  } catch (error) {}
};

const flatOwnerMiddleware = async (req, res, next) => {
  const flat = await Flat.findById(req.params.id);
  if (!flat) {
    return res.status(404).json({ message: "Flat not found" });
  }

  if (flat.ownerId.toString() !== req.user.userId && req.user.role != "admin")
    return res.status(403).json({ message: "Access denied for flat" });
  next();
};

export { authorizationMiddleware, accountOwnerMiddleware, flatOwnerMiddleware }
