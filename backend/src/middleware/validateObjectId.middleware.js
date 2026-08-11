import mongoose from "mongoose";

import ApiError from "../utils/ApiError.js";

const validateObjectId = (paramName = "id") => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(
        new ApiError(400, `Invalid ${paramName}.`)
      );
    }

    next();
  };
};

export default validateObjectId;