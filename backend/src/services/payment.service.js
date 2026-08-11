import mongoose from "mongoose";

import Payment from "../models/Payment.js";
import Sale from "../models/Sale.js";
import Customer from "../models/Customer.js";

import ApiError from "../utils/ApiError.js";

import {
    PAYMENT_STATUS,
} from "../constants/payment.js";


export const createPayment = async (paymentData, userId) => {
    const session = await mongoose.startSession();

    session.startTransaction();

    try {

        const sale = await Sale.findById(
            paymentData.sale
        ).session(session);

        if (!sale) {
            throw new ApiError(
                404,
                "Sale not found."
            );
        }


        const customer = await Customer.findById(
            sale.customer
        ).session(session);

        if (!customer) {
            throw new ApiError(
                404,
                "Customer not found."
            );
        }

        if (paymentData.amount > sale.remainingBalance) {
            throw new ApiError(
                400,
                "Payment amount cannot exceed the remaining balance."
            );
        }

        if (sale.remainingBalance === 0) {
            throw new ApiError(
                400,
                "This invoice is already paid."
            );
        }

        const receiptNumber = `PAY-${Date.now()}`;
        
        const payment = await Payment.create(
            [
                {
                    receiptNumber,
                    sale: sale._id,
                    customer: customer._id,
                    amount: paymentData.amount,
                    paymentMethod: paymentData.paymentMethod,
                    paymentDate: paymentData.paymentDate,
                    remarks: paymentData.remarks,
                    createdBy: userId,
                },
            ],
            { session }
        );

        const savedPayment = payment[0];

        sale.paidAmount += paymentData.amount;
        sale.remainingBalance =
            Number((sale.grandTotal - sale.paidAmount).toFixed(2));


        //update payment status based on remaining balance and paid amount
        if (sale.remainingBalance === 0) {
            sale.paymentStatus = PAYMENT_STATUS.PAID;
        }
        else if (sale.paidAmount > 0) {
            sale.paymentStatus = PAYMENT_STATUS.PARTIAL;
        }
        else {
            sale.paymentStatus = PAYMENT_STATUS.UNPAID;
        }

        // Save the updated sale document
        await sale.save({ session });

        //update customer current balance 
        customer.currentBalance -= paymentData.amount;
        await customer.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        return savedPayment;


    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }

};