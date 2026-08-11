import mongoose from "mongoose";

import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import InventoryLog from "../models/InventoryLog.js";

import {
    INVENTORY_TYPE,
    INVENTORY_REASON,
} from "../constants/inventory.js";

import ApiError from "../utils/ApiError.js";

export const createSale = async (saleData, userId) => {

    const session = await mongoose.startSession();

    session.startTransaction();

    try {

        const customer = await Customer.findById(
            saleData.customer
        ).session(session);

        if (!customer) {
            throw new ApiError(
                404,
                "Customer not found."
            );
        }

        if (!customer.isActive) {
            throw new ApiError(
                400,
                "Customer is inactive."
            );
        }

        let subTotal = 0;

        const saleItems = [];

        for (const item of saleData.items) {

            const product = await Product.findById(
                item.product
            ).session(session);

            if (!product) {
                throw new ApiError(
                    404,
                    `Product not found: ${item.product}`
                );
            }

            if (product.currentStock < item.quantity) {

                throw new ApiError(
                    400,
                    `${product.name} has only ${product.currentStock} cartons available.`
                );

            }

            const total = Number(
                (item.quantity * item.sellingPrice).toFixed(2)
            );

            subTotal += total;

            saleItems.push({
                product: product._id,
                quantity: item.quantity,
                sellingPrice: item.sellingPrice,
                total,
            });

        }

        const grandTotal = Number(
            (subTotal - saleData.discount + saleData.tax).toFixed(2)
        );

        const remainingBalance = Number(
            (grandTotal - saleData.paidAmount).toFixed(2)
        );

        if (saleData.paidAmount > grandTotal) {
            throw new ApiError(
                400,
                "Paid amount cannot be greater than the grand total."
            );
        }

        let paymentStatus = "UNPAID";

        if (remainingBalance === 0) {
            paymentStatus = "PAID";
        }
        else if (saleData.paidAmount > 0) {
            paymentStatus = "PARTIAL";
        }

        const invoiceNumber = `SAL-${Date.now()}`;

        const sale = await Sale.create(
            [
                {
                    invoiceNumber,
                    customer: customer._id,
                    saleDate: saleData.saleDate,
                    items: saleItems,
                    subTotal,
                    discount: saleData.discount,
                    tax: saleData.tax,
                    grandTotal,
                    paidAmount: saleData.paidAmount,
                    remainingBalance,
                    paymentStatus,
                    paymentMethod: saleData.paymentMethod,
                    remarks: saleData.remarks,
                    createdBy: userId,
                },
            ],
            { session }
        );

        const savedSale = sale[0];

        // Reduce stock and create inventory log
        for (const item of saleItems) {

            const product = await Product.findById(
                item.product
            ).session(session);

            const stockBefore = product.currentStock;

            product.currentStock -= item.quantity;

            const stockAfter = product.currentStock;

            await product.save({ session });

            await InventoryLog.create(
                [
                    {
                        product: product._id,
                        type: INVENTORY_TYPE.OUT,
                        reason: INVENTORY_REASON.SALE,
                        quantity: item.quantity,
                        stockBefore,
                        stockAfter,
                        referenceId: savedSale._id,
                        referenceModel: "Sale",
                        remarks: saleData.remarks,
                        createdBy: userId,
                    },
                ],
                { session }
            );

        }

        // Update customer balance
        customer.currentBalance += remainingBalance;

        await customer.save({ session });

        // Commit transaction
        await session.commitTransaction();

        // Get complete sale with customer and product details
        const populatedSale = await Sale.findById(savedSale._id)
            .populate("customer")
            .populate("items.product");

        return populatedSale;

    }
    catch (error) {

        await session.abortTransaction();

        throw error;

    }
    finally {

        session.endSession();

    }

};


export const getAllSales = async (query) => {
    const {
        search = "",
        page = 1,
        limit = 10,
        sortBy = "saleDate",
        order = "desc",
    } = query;

    const currentPage = Number(page);
    const perPage = Number(limit);

    const filter = {};

    if (search.trim()) {
        const searchRegex = {
            $regex: search.trim(),
            $options: "i",
        };

        // Search customers by shop name, customer name or phone
        const matchingCustomers = await Customer.find({
            $or: [
                { shopName: searchRegex },
                { name: searchRegex },
                { phone: searchRegex },
            ],
        }).select("_id");

        const customerIds = matchingCustomers.map(
            (customer) => customer._id
        );

        filter.$or = [
            {
                invoiceNumber: searchRegex,
            },
            {
                customer: {
                    $in: customerIds,
                },
            },
        ];
    }

    const totalSales = await Sale.countDocuments(filter);

    const sales = await Sale.find(filter)
        .populate("customer")
        .populate("items.product")
        .sort({
            [sortBy]: order === "asc" ? 1 : -1,
        })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);

    const totalPages = Math.ceil(totalSales / perPage);

    return {
        sales,
        pagination: {
            totalSales,
            totalPages,
            currentPage,
            limit: perPage,
        },
    };
};