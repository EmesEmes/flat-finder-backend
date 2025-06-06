import mongoose from "mongoose";
import { User } from "./user.model.js";

const flatSchema = new mongoose.Schema({
  city: {
    type: String,
    require: true,
  },
  streetName: {
    type: String,
    require: true,
  },
  streetNumber: {
    type: Number,
    require: true,
  },
  areaSize: {
    type: Number,
    require: true,
  },
  yearBuilt: {
    type: Number,
    require: true,
  },
  hasAC: {
    type: Boolean,
    require: true,
  },
  rentPrice: {
    type: Number,
    require: true,
  },
  images: [
    {
      type: String,
    },
  ],
  dateAvailable: {
    type: Date,
    require: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    require: true,
  },

  createAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

export const Flat = new mongoose.model("flats", flatSchema);
