import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import Sale from "../models/Sale.js";
import Payment from "../models/Payment.js";
import ExpiryRecord from "../models/ExpiryRecord.js";

export const getDashboardData = async () => {

    // Today's date range
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const last7Days = new Date(startOfToday);
    last7Days.setDate(last7Days.getDate() - 6);

    // Run independent queries in parallel
    const [
        totalProducts,
        totalCustomers,
        todaySales,
        todayPayments,
        creditSummary,
        lowStock,
        outOfStock,
        lowStockProducts,
        recentSales,
        topProducts,
        salesTrend,
        recentExpiryRecords,
    ] = await Promise.all([

        Product.countDocuments({
            isActive: true,
        }),

        Customer.countDocuments({
            isActive: true,
        }),

        Sale.aggregate([
            {
                $match: {
                    status: "COMPLETED",
                    saleDate: {
                        $gte: startOfToday,
                        $lte: endOfToday,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$grandTotal",
                    },
                },
            },
        ]),

        Payment.aggregate([
            {
                $match: {
                    paymentDate: {
                        $gte: startOfToday,
                        $lte: endOfToday,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$amount",
                    },
                },
            },
        ]),

        Customer.aggregate([
            {
                $match: {
                    isActive: true,
                },
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$currentBalance",
                    },
                },
            },
        ]),

        Product.countDocuments({
            isActive: true,
            currentStock: {
                $gt: 0,
            },
            $expr: {
                $lte: ["$currentStock", "$minimumStock"],
            },
        }),

        Product.countDocuments({
            isActive: true,
            currentStock: {
                $lte: 0,
            },
        }),

        Product.find({
            isActive: true,
            currentStock: {
                $gt: 0,
            },
            $expr: {
                $lte: ["$currentStock", "$minimumStock"],
            },
        })
            .select("name sku currentStock minimumStock unit")
            .sort({
                currentStock: 1,
                name: 1,
            })
            .limit(5)
            .lean(),

        Sale.find({
            status: "COMPLETED",
        })
            .select("invoiceNumber customer grandTotal paidAmount remainingBalance paymentStatus saleDate")
            .populate("customer", "name shopName")
            .sort({
                saleDate: -1,
                createdAt: -1,
            })
            .limit(5)
            .lean(),

        Sale.aggregate([
            {
                $match: {
                    status: "COMPLETED",
                    saleDate: {
                        $gte: last7Days,
                        $lte: endOfToday,
                    },
                },
            },
            {
                $unwind: "$items",
            },
            {
                $group: {
                    _id: "$items.product",
                    quantity: {
                        $sum: "$items.quantity",
                    },
                    total: {
                        $sum: "$items.total",
                    },
                },
            },
            {
                $sort: {
                    total: -1,
                },
            },
            {
                $limit: 5,
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product",
                },
            },
            {
                $unwind: {
                    path: "$product",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 0,
                    productId: "$_id",
                    name: {
                        $ifNull: ["$product.name", "Unknown Product"],
                    },
                    quantity: 1,
                    total: 1,
                },
            },
        ]),

        Sale.aggregate([
            {
                $match: {
                    status: "COMPLETED",
                    saleDate: {
                        $gte: last7Days,
                        $lte: endOfToday,
                    },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$saleDate",
                        },
                    },
                    total: {
                        $sum: "$grandTotal",
                    },
                    invoices: {
                        $sum: 1,
                    },
                },
            },
            {
                $sort: {
                    _id: 1,
                },
            },
        ]),

        ExpiryRecord.find({})
            .select("product quantity reason recordDate")
            .populate("product", "name sku unit")
            .sort({
                recordDate: -1,
                createdAt: -1,
            })
            .limit(5)
            .lean(),

    ]);

    const totalSalesToday =
        todaySales.length > 0
            ? todaySales[0].total
            : 0;

    const totalPaymentsToday =
        todayPayments.length > 0
            ? todayPayments[0].total
            : 0;

    const totalCredit =
        creditSummary.length > 0
            ? creditSummary[0].total
            : 0;

    const trendByDate = salesTrend.reduce((acc, item) => {
        acc[item._id] = {
            total: item.total,
            invoices: item.invoices,
        };

        return acc;
    }, {});

    const chartData = Array.from({ length: 7 }).map((_, index) => {
        const date = new Date(last7Days);
        date.setDate(last7Days.getDate() + index);

        const key = date.toISOString().slice(0, 10);

        return {
            date: key,
            label: date.toLocaleDateString("en-US", {
                weekday: "short",
            }),
            total: trendByDate[key]?.total || 0,
            invoices: trendByDate[key]?.invoices || 0,
        };
    });

    return {
        totalProducts,
        totalCustomers,
        totalSalesToday,

        totalPaymentsToday,

        totalCredit,

        lowStock,

        outOfStock,

        lowStockProducts,

        recentSales,

        topProducts,

        chartData,

        recentExpiryRecords,
    };

};
