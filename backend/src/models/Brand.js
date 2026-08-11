import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
      unique: true,
      maxlength: [50, "Brand name cannot exceed 50 characters"],
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [250, "Description cannot exceed 250 characters"],
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

brandSchema.index({ name: 1 });

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;