import { Flat } from "../models/flat.model.js";
import { Message } from "../models/message.model.js";
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
    const paramUserId = req.params.id || req.params.userId;;
    const user = await User.findById(paramUserId);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (paramUserId != req.user._id && req.user.role != "admin") {
      return res.status(403).json({ message: "Access denied for User" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error in accountOwnerMiddleware" });
  }
};

const flatOwnerMiddleware = async (req, res, next) => {

  const flat = await Flat.findById(req.params.id);
  console.log(flat)
  if (!flat) {
    return res.status(404).json({ message: "Flat not found" });
  }

  if (flat.ownerId.toString() !== req.user.userId && req.user.role != "admin")
    return res.status(403).json({ message: "Access denied for flat" });
  next();
};

const messageOwner = async (req, res, next) => {
  
  try {
    const message = await Message.findById(req.params.messageId).populate("flatId")
    console.log(message.flatId.ownerId)
    console.log(req.user._id)
    if(message.flatId.ownerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({message: "unauthorized"})
    }
    
    next()
  } catch (error) {
    console.log(error)
  }
}

export { authorizationMiddleware, accountOwnerMiddleware, flatOwnerMiddleware, messageOwner };
