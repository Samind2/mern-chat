import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // get the token from the cookies
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify token
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
    const user = await User.findById(decoded.userid).select("-password"); // find the user in the database
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error While Checking token" });
  }
};
