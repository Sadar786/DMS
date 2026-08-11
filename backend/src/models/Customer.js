import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      minlength: [3, "Customer name must be at least 3 characters"],
      maxlength: [100, "Customer name cannot exceed 100 characters"],
    },

    shopName: {
      type: String,
      required: [true, "Shop name is required"],
      trim: true,
      maxlength: [100, "Shop name cannot exceed 100 characters"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    openingBalance: {
      type: Number,
      default: 0,
      min: [0, "Opening balance cannot be negative"],
    },

    currentBalance: {
      type: Number,
      default: 0,
    },

    creditLimit: {
      type: Number,
      default: 0,
      min: [0, "Credit limit cannot be negative"],
    },

    notes: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Notes cannot exceed 500 characters"],
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

customerSchema.index({ shopName: 1 });
customerSchema.index({ phone: 1 });

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;