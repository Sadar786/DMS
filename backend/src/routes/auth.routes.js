import express from "express";

import { login, getMe, logout } from "../controllers/auth.controller.js";

import validate from "../middleware/validate.middleware.js";
import { protect } from "../middleware/auth.middleware.js";

import { loginSchema } from "../validations/auth.validation.js"

const router = express.Router();

router.post("/login",  validate(loginSchema),  login);

router.get(
  "/me",
  protect,
  getMe
);

router.post(
  "/logout",
  protect,
  logout
);

export default router;