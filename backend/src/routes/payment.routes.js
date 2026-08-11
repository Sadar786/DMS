import express from "express";

import { protect } from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
    createPaymentSchema,
} from "../validations/payment.validation.js";

import {
    create,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post(
    "/",
    protect,
    validate(createPaymentSchema),
    create
);

export default router;