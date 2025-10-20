import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]; // Bearer token
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) return res.status(401).json({ message: "Invalid token" });

    // Attach user info to request
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Critical: use _id.toString() for comparison later
    req.user = { id: user._id.toString(), name: user.name, email: user.email };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({ message: "Not authorized", error: error.message });
  }
};
