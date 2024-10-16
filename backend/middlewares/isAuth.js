import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";


export const isAuth = async (req, res, next) => {
  try {
    
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

   
    if (!token) {
      return res.status(401).json({
        message: "Please login to access this resource.",
      });
    }

    // Verify the token
    const decodedData = jwt.verify(token, process.env.JWT_SEC);

    // Retrieve the user associated with the token
    req.user = await User.findById(decodedData.id).select("-password");

    // Check if the user exists
    if (!req.user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Proceed to the next middleware
    next();
  } catch (error) {
    // Handle specific JWT errors for better feedback
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: "Invalid token. Please log in again.",
      });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: "Token has expired. Please log in again.",
      });
    }

    // Log and handle unexpected errors
    console.error("Authentication error:", error);
    res.status(500).json({
      message: "An error occurred during authentication.",
    });
  }
};
