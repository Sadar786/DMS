import mongoose from "mongoose";

import StockEntry from "../models/StockEntery.js";
import Product from "../models/Product.js";

import ApiError from "../utils/ApiError.js";

import { createInventoryLog } from "../helpers/inventory.helper.js";
import { increaseStock } from "../helpers/stock.helper.js";

import {
  INVENTORY_TYPE,
  INVENTORY_REASON,
} from "../constants/inventory.js";


// ======================================================
// CREATE STOCK ENTRY
// ======================================================

export const createStockEntry = async (stockEntryData, userId) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    // Generate invoice number automatically
    const invoiceNumber = `STK-${Date.now()}`;

    // Create Stock Entry
    const stockEntry = await StockEntry.create(
      [
        {
          ...stockEntryData,
          invoiceNumber,
          createdBy: userId,
        },
      ],
      { session }
    );

    const savedEntry = stockEntry[0];

    // Get product IDs
    const productIds = stockEntryData.items.map(
      (item) => item.product
    );

    // Get products
    const products = await Product.find({
      _id: {
        $in: productIds,
      },
    }).session(session);

    const productMap = new Map();

    products.forEach((product) => {
      productMap.set(
        product._id.toString(),
        product
      );
    });

    // Process every item
    for (const item of stockEntryData.items) {
      const product = productMap.get(
        item.product.toString()
      );

      if (!product) {
        throw new ApiError(
          404,
          `Product not found: ${item.product}`
        );
      }

      const { stockBefore, stockAfter } = increaseStock({
        product,
        quantity: item.quantity,
        costPrice: item.costPrice,
      });

      await product.save({ session });

      await createInventoryLog({
        session,
        product: product._id,
        type: INVENTORY_TYPE.IN,
        reason: INVENTORY_REASON.STOCK_ENTRY,
        quantity: item.quantity,
        stockBefore,
        stockAfter,
        referenceId: savedEntry._id,
        referenceModel: "StockEntry",
        remarks: stockEntryData.remarks,
        createdBy: userId,
      });
    }

    // Commit transaction
    await session.commitTransaction();

    return savedEntry;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
};


// ======================================================
// GET ALL STOCK ENTRIES
// ======================================================

export const getStockEntries = async (query) => {
  const page = Number(query.page) || 1;

  const limit = Math.min(
    Number(query.limit) || 10,
    100
  );

  const skip = (page - 1) * limit;

  const filter = {};

  if (query.search) {
    filter.$or = [
      {
        invoiceNumber: {
          $regex: query.search,
          $options: "i",
        },
      },
      {
        remarks: {
          $regex: query.search,
          $options: "i",
        },
      },
    ];
  }

  const total = await StockEntry.countDocuments(filter);

  const stockEntries = await StockEntry.find(filter)
    .populate("items.product", "name sku costPrice")
    .populate("createdBy", "fullName")
    .sort({ entryDate: -1 })
    .skip(skip)
    .limit(limit);

  return {
    stockEntries,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// ======================================================
// GET SINGLE STOCK ENTRY
// ======================================================

export const getStockEntryById = async (id) => {
  const stockEntry = await StockEntry.findById(id)
    .populate(
      "items.product",
      "name sku costPrice defaultSellingPrice currentStock"
    )
    .populate(
      "createdBy",
      "fullName email"
    );

  if (!stockEntry) {
    throw new ApiError(
      404,
      "Stock entry not found."
    );
  }

  return stockEntry;
};