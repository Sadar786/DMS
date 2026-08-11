//src/controllers/invoice.controller.js
import asyncHandler from "../utils/asyncHandler.js";
import { generateInvoiceService } from "../services/invoice.service.js";

export const generateInvoice = asyncHandler(async (req, res) => {

    await generateInvoiceService(
        req.params.saleId,
        res
    );

});