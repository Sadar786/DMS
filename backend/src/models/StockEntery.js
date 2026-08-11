import mongoose from "mongoose";



const stockItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be greater than 0"],
    },

    costPrice: {
      type: Number,
      required: true,
      min: [0, "Cost price cannot be negative"],
    },
    supplier: {
      type: String,
      trim: true,
      maxlength: [100, "Supplier name cannot exceed 100 characters"],
    },
  },
  {
    _id: false,
  }
);

const stockEntrySchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: [true, "Invoice number is required"],
      unique: true,
      trim: true,
    },

    entryDate: {
      type: Date,
      default: Date.now,
    },

    items: {
      type: [stockItemSchema],
      validate: [
        (items) => items.length > 0,
        "At least one product is required.",
      ],
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
stockEntrySchema.index({ entryDate: -1 });

const StockEntry = mongoose.model("StockEntry", stockEntrySchema);

export default StockEntry;