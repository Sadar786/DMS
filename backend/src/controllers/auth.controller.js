import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import * as authService from "../services/auth.service.js";

export const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Login successful.",
      data
    )
  );
});

export const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      "User fetched successfully.",
      req.user
    )
  );
});

export const logout = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      "Logout successful."
    )
  );
});