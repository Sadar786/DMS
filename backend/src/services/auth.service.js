import bcrypt from "bcryptjs";

import User from "../models/user.model.js";

import ApiError from "../utils/ApiError.js";

import generateToken from "../helpers/generateToken.js";

export const login = async ({ email, password }) => {

  const user = await User.findOne({
    email,
  }).select("+password");

  if (!user) {
    throw new ApiError(
      401,
      "Invalid email or password."
    );
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new ApiError(
      401,
      "Invalid email or password."
    );
  }

  if (!user.isActive) {
    throw new ApiError(
      403,
      "Your account has been deactivated."
    );
  }

  user.lastLogin = new Date();

  await user.save();

  const token = generateToken(user._id);

  user.password = undefined;

  return {
    user,
    token,
  };
};