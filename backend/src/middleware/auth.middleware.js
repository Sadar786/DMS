import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import env from "../config/env.js";

import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const protect = asyncHandler(async (req, res, next) => {

  console.log("========== AUTH MIDDLEWARE ==========");
  console.log("Headers:", req.headers);
  console.log("Authorization Header:", req.headers.authorization);

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  console.log("Extracted Token:", token);

  if (!token) {
    throw new ApiError(401, "Unauthorized. No token provided.");
  }

  const decoded = jwt.verify(token, env.JWT_SECRET);

  console.log("Decoded JWT:", decoded);

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new ApiError(401, "User not found.");
  }

  if (!user.isActive) {
    throw new ApiError(403, "User account is inactive.");
  }

  req.user = user;

  next();
});

export { protect };