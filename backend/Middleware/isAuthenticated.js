import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
     
    if (!token) {
      return res.status(401).json({
        message: "Please login first",
        success: false,
      });
    }
  
    // Verifying the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
  
    next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
              message: "Token has expired, please login again",
              success: false,
            });
          } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
              message: "Invalid token",
              success: false,
            });
          }
          console.log(error);
          res.status(500).json({ message: "Internal server error in isAuthenticated middlewarew", success: false });
        
    }
}