//src/services/invoice.service.js

import Sale from "../models/Sale.js";
import ApiError from "../utils/ApiError.js";
import generateInvoicePDF from "../pdf/invoice.generator.js";

export const generateInvoiceService = async (saleId, res) => {

    const sale = await Sale.findById(saleId)
        .populate("customer")
        .populate("items.product")
        .populate("createdBy", "fullName");

    if (!sale) {
        throw new ApiError(404, "Sale not found.");
    }

    generateInvoicePDF(sale, res);

};