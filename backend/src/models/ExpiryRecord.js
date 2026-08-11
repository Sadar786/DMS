import mongoose from "mongoose";

const expiryRecordSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be greater than zero"],
    },

    reason: {
      type: String,
      enum: {
        values: ["Expired", "DeGas"],
        message: "Invalid expiry reason",
      },
      required: [true, "Reason is required"],
    },

    recordDate: {
      type: Date,
      default: Date.now,
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
expiryRecordSchema.index({ product: 1 });
expiryRecordSchema.index({ recordDate: -1 });

const ExpiryRecord = mongoose.model(
  "ExpiryRecord",
  expiryRecordSchema
);

export default ExpiryRecord;