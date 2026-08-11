import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },

    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },

    costPrice: {
      type: Number,
      required: [true, "Cost price is required"],
      min: [0, "Cost price cannot be negative"],
    },

    // Default selling price
    defaultSellingPrice: {
      type: Number,
      required: [true, "Default selling price is required"],
      min: [0, "Selling price cannot be negative"],
    },

    currentStock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },

    minimumStock: {
      type: Number,
      default: 10,
      min: [0, "Minimum stock cannot be negative"],
    },

    unit: {
      type: String,
      enum: {
        values: ["Bottle", "Can", "Pack", "Carton", "Case"],
        message: "Invalid unit",
      },
      default: "Bottle",
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    isActive: {
      type: Boolean,
      default: true,
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

productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;