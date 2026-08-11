import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be greater than zero"],
    },

    sellingPrice: {
      type: Number,
      required: [true, "Selling price is required"],
      min: [0, "Price cannot be negative"],
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const saleSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: [true, "Invoice number is required"],
      unique: true,
      trim: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    saleDate: {
      type: Date,
      default: Date.now,
    },

    items: {
      type: [saleItemSchema],
      validate: [
        (items) => items.length > 0,
        "At least one product is required.",
      ],
    },

    subTotal: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    tax: {
      type: Number,
      default: 0,
      min: 0,
    },

    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    remainingBalance: {
      type: Number,
      default: 0,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: {
        values: ["PAID", "PARTIAL", "UNPAID"],
        message: "Invalid payment status",
      },
      default: "UNPAID",
    },

    paymentMethod: {
      type: String,
      enum: {
        values: [ "Cash", "Bank", "Online", "Cheque"],
        message: "Invalid payment method",
      },
      default: "Cash",
    },

    status: {
      type: String,
      enum: [
        "COMPLETED",
        "CANCELLED"
      ],
      default: "COMPLETED"
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

saleSchema.index({ customer: 1 });
saleSchema.index({ saleDate: -1 });

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;