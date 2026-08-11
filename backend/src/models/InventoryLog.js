import mongoose from "mongoose";
import {
  INVENTORY_TYPE,
  INVENTORY_REASON,
} from "../constants/inventory.js";


const inventoryLogSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },


    type: {
      type: String,
      enum: Object.values(INVENTORY_TYPE),
      required: true,
    },

    reason: {
      type: String,
      enum: Object.values(INVENTORY_REASON),
      required: true,
    },


    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be greater than zero"],
    },

    stockBefore: {
      type: Number,
      required: true,
      min: 0,
    },

    stockAfter: {
      type: Number,
      required: true,
      min: 0,
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    referenceModel: {
      type: String,
      enum: {
        values: ["StockEntry", "Sale", "ExpiryRecord"],
        message: "Invalid reference model",
      },
      required: true,
    },

    remarks: {
      type: String,
      trim: true,
      maxlength: [300, "Remarks cannot exceed 300 characters"],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
inventoryLogSchema.index({ product: 1 });
inventoryLogSchema.index({ createdAt: -1 });
inventoryLogSchema.index({ type: 1 });

const InventoryLog = mongoose.model(
  "InventoryLog",
  inventoryLogSchema
);

export default InventoryLog;