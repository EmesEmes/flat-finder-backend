import cloudinary from "../config/cloudinary.js"
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      birthdate
    } = req.body;

    let imageUrl = null;

    if (req.file) {
  const uploadFromBuffer = (fileBuffer) =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "flatfinder/users",
          public_id: `profile_${email}`,
          overwrite: true
        },
        (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        }
      );

      stream.end(fileBuffer);
    });

  const result = await uploadFromBuffer(req.file.buffer);
  imageUrl = result.secure_url;
}

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      birthdate,
      image: imageUrl
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered succesfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials", success: false });
    }
    const userObj = user.toObject()
    delete userObj.password

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "180d",
      }
    );
    res.json({ token, success: true, message: "Loged In succesfully", user: userObj });
  } catch (error) {
    res.status(500).json({ message: "error", success: false });
  }
};

export { login, register };
