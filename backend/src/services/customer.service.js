import Customer from "../models/Customer.js";

import ApiError from "../utils/ApiError.js";

import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
} from "../constants/pagination.js";

// Create Customer
export const createCustomer = async (customerData, userId) => {
  const existingCustomer = await Customer.findOne({
    phone: customerData.phone,
  });

  if (existingCustomer) {
    throw new ApiError(
      409,
      "Customer with this phone number already exists."
    );
  }

  const customer = await Customer.create({
    ...customerData,

    currentBalance: customerData.openingBalance,

    createdBy: userId,
  });

  return customer;
};

// Get All Customers
export const getCustomers = async (query) => {
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
        name: {
          $regex: query.search,
          $options: "i",
        },
      },
      {
        shopName: {
          $regex: query.search,
          $options: "i",
        },
      },
      {
        phone: {
          $regex: query.search,
          $options: "i",
        },
      },
    ];
  }

  const total = await Customer.countDocuments(filter);

  const customers = await Customer.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    customers,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Get Customer By ID
export const getCustomerById = async (id) => {
  const customer = await Customer.findById(id);

  if (!customer) {
    throw new ApiError(404, "Customer not found.");
  }

  return customer;
};

// Update Customer
export const updateCustomer = async (
  id,
  customerData
) => {
  const customer = await Customer.findById(id);

  if (!customer) {
    throw new ApiError(404, "Customer not found.");
  }

  if (
    customerData.phone &&
    customerData.phone !== customer.phone
  ) {
    const phoneExists = await Customer.findOne({
      phone: customerData.phone,
      _id: {
        $ne: id,
      },
    });

    if (phoneExists) {
      throw new ApiError(
        409,
        "Phone number already exists."
      );
    }
  }

  // Never allow updating currentBalance directly
  delete customerData.currentBalance;

  Object.assign(customer, customerData);

  await customer.save();

  return customer;
};

// Update Status
export const updateCustomerStatus = async (
  id,
  isActive
) => {
  const customer = await Customer.findById(id);

  if (!customer) {
    throw new ApiError(404, "Customer not found.");
  }

  customer.isActive = isActive;

  await customer.save();

  return customer;
};

// Soft Delete
export const deleteCustomer = async (id) => {
  const customer = await Customer.findById(id);

  if (!customer) {
    throw new ApiError(404, "Customer not found.");
  }

  customer.isActive = false;

  await customer.save();
};