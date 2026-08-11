import Product from "../models/Product.js";

import ApiError from "../utils/ApiError.js";

import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
} from "../constants/pagination.js";

export const createProduct = async (productData, userId) => {
  const existingProduct = await Product.findOne({
    sku: productData.sku,
  });

  if (existingProduct) {
    throw new ApiError(409, "SKU already exists.");
  }

  const product = await Product.create({
    ...productData,
    createdBy: userId,
  });

  return product;
};

export const getProducts = async (query) => {
  const page = Number(query.page) || DEFAULT_PAGE;

  const limit = Math.min(
    Number(query.limit) || DEFAULT_LIMIT,
    MAX_LIMIT
  );

  const skip = (page - 1) * limit;

  const filter = {};

  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === "true";
  }

  if (query.search) {
    filter.$or = [
      {
        sku: {
          $regex: query.search,
          $options: "i",
        },
      },
      {
        name: {
          $regex: query.search,
          $options: "i",
        },
      },
      {
        category: {
          $regex: query.search,
          $options: "i",
        },
      },
    ];
  }

  const total = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .populate("unit", "name shortName")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getProductById = async (id) => {
  const product = await Product.findById(id).populate(
    "unit",
    "name shortName"
  );

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  return product;
};

export const updateProduct = async (
  id,
  productData
) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  if (
    productData.sku &&
    productData.sku !== product.sku
  ) {
    const skuExists = await Product.findOne({
      sku: productData.sku,
      _id: {
        $ne: id,
      },
    });

    if (skuExists) {
      throw new ApiError(409, "SKU already exists.");
    }
  }

  Object.assign(product, productData);

  await product.save();

  return product;
};

export const updateProductStatus = async (
  id,
  isActive
) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  product.isActive = isActive;

  await product.save();

  return product;
};

export const deleteProduct = async (id) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  product.isActive = false;

  await product.save();

  return;
};
