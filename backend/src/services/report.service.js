import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import Payment from "../models/Payment.js";
import InventoryLog from "../models/InventoryLog.js";
import StockEntry from "../models/StockEntery.js";
import ExpiryRecord from "../models/ExpiryRecord.js";
import ApiError from "../utils/ApiError.js";

const getDateRange = (query = {}) => {
    const preset = query.preset || "today";
    const now = new Date();
    let from = new Date();
    let to = new Date();

    if (query.from || query.to) {
        from = query.from ? new Date(query.from) : new Date();
        to = query.to ? new Date(query.to) : new Date();
    } else if (preset === "weekly") {
        from.setDate(now.getDate() - 6);
    } else if (preset === "monthly") {
        from = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (preset === "yearly") {
        from = new Date(now.getFullYear(), 0, 1);
    }

    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);

    return {
        from,
        to,
        preset,
    };
};

const getSeriesFormat = (from, to) => {
    const diffInDays = Math.ceil(
        (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)
    );

    return diffInDays > 62
        ? {
            format: "%Y-%m",
            label: "month",
        }
        : {
            format: "%Y-%m-%d",
            label: "day",
        };
};

export const getBusinessAnalyticsService = async (query) => {
    const { from, to, preset } = getDateRange(query);
    const seriesFormat = getSeriesFormat(from, to);

    const saleMatch = {
        status: "COMPLETED",
        saleDate: {
            $gte: from,
            $lte: to,
        },
    };

    const stockMatch = {
        entryDate: {
            $gte: from,
            $lte: to,
        },
    };

    const paymentMatch = {
        paymentDate: {
            $gte: from,
            $lte: to,
        },
    };

    const expiryMatch = {
        recordDate: {
            $gte: from,
            $lte: to,
        },
    };

    const [
        salesSummary,
        profitSummary,
        stockInSummary,
        paymentSummary,
        lossSummary,
        topProducts,
        recentSales,
        salesSeries,
        stockSeries,
        lossSeries,
    ] = await Promise.all([
        Sale.aggregate([
            { $match: saleMatch },
            {
                $group: {
                    _id: null,
                    totalInvoices: { $sum: 1 },
                    totalSales: { $sum: "$grandTotal" },
                    totalPaid: { $sum: "$paidAmount" },
                    totalCredit: { $sum: "$remainingBalance" },
                },
            },
        ]),

        Sale.aggregate([
            { $match: saleMatch },
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "products",
                    localField: "items.product",
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
                $group: {
                    _id: null,
                    itemsSold: { $sum: "$items.quantity" },
                    salesValue: { $sum: "$items.total" },
                    costValue: {
                        $sum: {
                            $multiply: [
                                "$items.quantity",
                                { $ifNull: ["$product.costPrice", 0] },
                            ],
                        },
                    },
                },
            },
        ]),

        StockEntry.aggregate([
            { $match: stockMatch },
            { $unwind: "$items" },
            {
                $group: {
                    _id: null,
                    totalStockIn: { $sum: "$items.quantity" },
                    totalStockInValue: {
                        $sum: {
                            $multiply: ["$items.quantity", "$items.costPrice"],
                        },
                    },
                    totalStockEntries: { $addToSet: "$_id" },
                },
            },
            {
                $project: {
                    totalStockIn: 1,
                    totalStockInValue: 1,
                    totalStockEntries: { $size: "$totalStockEntries" },
                },
            },
        ]),

        Payment.aggregate([
            { $match: paymentMatch },
            {
                $group: {
                    _id: null,
                    totalPayments: { $sum: 1 },
                    totalPaymentsAmount: { $sum: "$amount" },
                },
            },
        ]),

        ExpiryRecord.aggregate([
            { $match: expiryMatch },
            {
                $lookup: {
                    from: "products",
                    localField: "product",
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
                $group: {
                    _id: null,
                    totalLossQuantity: { $sum: "$quantity" },
                    totalLossValue: {
                        $sum: {
                            $multiply: [
                                "$quantity",
                                { $ifNull: ["$product.costPrice", 0] },
                            ],
                        },
                    },
                    totalLossRecords: { $sum: 1 },
                },
            },
        ]),

        Sale.aggregate([
            { $match: saleMatch },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    quantity: { $sum: "$items.quantity" },
                    total: { $sum: "$items.total" },
                },
            },
            { $sort: { total: -1 } },
            { $limit: 8 },
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
                    name: { $ifNull: ["$product.name", "Unknown Product"] },
                    sku: "$product.sku",
                    quantity: 1,
                    total: 1,
                },
            },
        ]),

        Sale.find(saleMatch)
            .select("invoiceNumber customer saleDate grandTotal paidAmount remainingBalance paymentStatus")
            .populate("customer", "name shopName phone")
            .sort({ saleDate: -1, createdAt: -1 })
            .limit(10)
            .lean(),

        Sale.aggregate([
            { $match: saleMatch },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: seriesFormat.format,
                            date: "$saleDate",
                        },
                    },
                    sales: { $sum: "$grandTotal" },
                    invoices: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]),

        StockEntry.aggregate([
            { $match: stockMatch },
            { $unwind: "$items" },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: seriesFormat.format,
                            date: "$entryDate",
                        },
                    },
                    stockInValue: {
                        $sum: {
                            $multiply: ["$items.quantity", "$items.costPrice"],
                        },
                    },
                    stockInQuantity: { $sum: "$items.quantity" },
                },
            },
            { $sort: { _id: 1 } },
        ]),

        ExpiryRecord.aggregate([
            { $match: expiryMatch },
            {
                $lookup: {
                    from: "products",
                    localField: "product",
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
                $group: {
                    _id: {
                        $dateToString: {
                            format: seriesFormat.format,
                            date: "$recordDate",
                        },
                    },
                    lossValue: {
                        $sum: {
                            $multiply: [
                                "$quantity",
                                { $ifNull: ["$product.costPrice", 0] },
                            ],
                        },
                    },
                    lossQuantity: { $sum: "$quantity" },
                },
            },
            { $sort: { _id: 1 } },
        ]),
    ]);

    const sales = salesSummary[0] || {};
    const profit = profitSummary[0] || {};
    const stock = stockInSummary[0] || {};
    const payments = paymentSummary[0] || {};
    const losses = lossSummary[0] || {};

    const grossProfit = Number(
        ((profit.salesValue || 0) - (profit.costValue || 0)).toFixed(2)
    );
    const totalLossValue = Number((losses.totalLossValue || 0).toFixed(2));
    const netProfit = Number((grossProfit - totalLossValue).toFixed(2));

    const seriesMap = {};

    salesSeries.forEach((item) => {
        seriesMap[item._id] = {
            period: item._id,
            sales: item.sales,
            invoices: item.invoices,
            stockInValue: 0,
            stockInQuantity: 0,
            lossValue: 0,
            lossQuantity: 0,
        };
    });

    stockSeries.forEach((item) => {
        seriesMap[item._id] = {
            period: item._id,
            sales: seriesMap[item._id]?.sales || 0,
            invoices: seriesMap[item._id]?.invoices || 0,
            stockInValue: item.stockInValue,
            stockInQuantity: item.stockInQuantity,
            lossValue: seriesMap[item._id]?.lossValue || 0,
            lossQuantity: seriesMap[item._id]?.lossQuantity || 0,
        };
    });

    lossSeries.forEach((item) => {
        seriesMap[item._id] = {
            period: item._id,
            sales: seriesMap[item._id]?.sales || 0,
            invoices: seriesMap[item._id]?.invoices || 0,
            stockInValue: seriesMap[item._id]?.stockInValue || 0,
            stockInQuantity: seriesMap[item._id]?.stockInQuantity || 0,
            lossValue: item.lossValue,
            lossQuantity: item.lossQuantity,
        };
    });

    return {
        range: {
            preset,
            from,
            to,
            groupBy: seriesFormat.label,
        },
        summary: {
            totalInvoices: sales.totalInvoices || 0,
            totalSales: Number((sales.totalSales || 0).toFixed(2)),
            totalPaid: Number((sales.totalPaid || 0).toFixed(2)),
            totalCredit: Number((sales.totalCredit || 0).toFixed(2)),
            totalPayments: payments.totalPayments || 0,
            totalPaymentsAmount: Number((payments.totalPaymentsAmount || 0).toFixed(2)),
            itemsSold: profit.itemsSold || 0,
            costOfGoodsSold: Number((profit.costValue || 0).toFixed(2)),
            grossProfit,
            totalLossQuantity: losses.totalLossQuantity || 0,
            totalLossValue,
            netProfit,
            totalStockIn: stock.totalStockIn || 0,
            totalStockInValue: Number((stock.totalStockInValue || 0).toFixed(2)),
            totalStockEntries: stock.totalStockEntries || 0,
            averageInvoiceValue:
                sales.totalInvoices > 0
                    ? Number(((sales.totalSales || 0) / sales.totalInvoices).toFixed(2))
                    : 0,
        },
        series: Object.values(seriesMap).sort((a, b) =>
            a.period.localeCompare(b.period)
        ),
        topProducts,
        recentSales,
    };
};


export const getSalesReportService = async (query) => {

    const filter = {};

    // Date Filter
    if (query.from || query.to) {

        filter.saleDate = {};

        if (query.from) {
            filter.saleDate.$gte = new Date(query.from);
        }

        if (query.to) {
            const endDate = new Date(query.to);
            endDate.setHours(23, 59, 59, 999);
            filter.saleDate.$lte = endDate;
        }

    }

    // Customer Filter
    if (query.customer) {
        filter.customer = query.customer;
    }

    // Payment Status Filter
    if (query.paymentStatus) {
        filter.paymentStatus = query.paymentStatus;
    }

    const sales = await Sale.find(filter)
        .populate("customer", "name shopName phone")
        .populate("createdBy", "fullName")
        .sort({ saleDate: -1 });

    const summary = await Sale.aggregate([
        {
            $match: filter,
        },
        {
            $group: {
                _id: null,

                totalInvoices: {
                    $sum: 1,
                },

                totalSales: {
                    $sum: "$grandTotal",
                },

                totalPaid: {
                    $sum: "$paidAmount",
                },

                totalRemaining: {
                    $sum: "$remainingBalance",
                },
            },
        },
    ]);

    return {
        summary: summary[0] || {
            totalInvoices: 0,
            totalSales: 0,
            totalPaid: 0,
            totalRemaining: 0,
        },

        sales,
    };

};




export const getStockReportService = async () => {

    const products = await Product.find(
        { isActive: true },
        {
            name: 1,
            sku: 1,
            category: 1,
            brand: 1,
            currentStock: 1,
            minimumStock: 1,
            costPrice: 1,
            defaultSellingPrice: 1,
        }
    ).sort({ name: 1 });

    const stock = products.map((product) => ({

        _id: product._id,

        name: product.name,

        sku: product.sku,

        category: product.category,

        brand: product.brand,

        currentStock: product.currentStock,

        minimumStock: product.minimumStock,

        costPrice: product.costPrice,

        sellingPrice: product.defaultSellingPrice,

        stockValue: Number(
            (product.currentStock * product.costPrice).toFixed(2)
        ),

    }));


    const summary = {

        totalProducts: stock.length,

        totalStock: stock.reduce(
            (sum, item) => sum + item.currentStock,
            0
        ),

        totalStockValue: Number(
            stock
                .reduce(
                    (sum, item) => sum + item.stockValue,
                    0
                )
                .toFixed(2)
        ),

    };


    return {

        summary,

        stock,

    };

};

export const getLowStockReportService = async () => {

    const products = await Product.find({
        isActive: true,
        $expr: {
            $lte: ["$currentStock", "$minimumStock"],
        },
    })
        .select(
            "name sku category brand currentStock minimumStock"
        )
        .sort({ currentStock: 1 });

    return {
        totalLowStockProducts: products.length,
        products,
    };

};

export const getPaymentReportService = async (query) => {

    const filter = {};

    if (query.from || query.to) {

        filter.paymentDate = {};

        if (query.from) {
            filter.paymentDate.$gte = new Date(query.from);
        }

        if (query.to) {
            const endDate = new Date(query.to);
            endDate.setHours(23, 59, 59, 999);
            filter.paymentDate.$lte = endDate;
        }
    }

    if (query.customer) {
        filter.customer = query.customer;
    }

    if (query.paymentMethod) {
        filter.paymentMethod = query.paymentMethod;
    }

    const payments = await Payment.find(filter)
        .populate("customer", "name shopName phone")
        .populate("sale", "invoiceNumber grandTotal")
        .populate("createdBy", "fullName")
        .sort({ paymentDate: -1 });

    const summary = await Payment.aggregate([
        {
            $match: filter,
        },
        {
            $group: {
                _id: null,
                totalPayments: { $sum: 1 },
                totalAmount: { $sum: "$amount" },
            },
        },
    ]);

   return {
    summary: {
        totalPayments: summary[0]?.totalPayments || 0,
        totalAmount: summary[0]?.totalAmount || 0,
    },
    payments,
};

};

export const getCustomerLedgerService = async (customerId, query = {}) => {

    const customer = await Customer.findById(customerId);

    if (!customer) {
        throw new ApiError(404, "Customer not found.");
    }

    const saleFilter = {
        customer: customerId,
        status: "COMPLETED",
    };

    const paymentFilter = {
        customer: customerId,
    };

    const priorSaleFilter = {
        customer: customerId,
        status: "COMPLETED",
    };

    const priorPaymentFilter = {
        customer: customerId,
    };

    if (query.from || query.to) {
        saleFilter.saleDate = {};
        paymentFilter.paymentDate = {};

        if (query.from) {
            const startDate = new Date(query.from);
            startDate.setHours(0, 0, 0, 0);

            saleFilter.saleDate.$gte = startDate;
            paymentFilter.paymentDate.$gte = startDate;

            priorSaleFilter.saleDate = { $lt: startDate };
            priorPaymentFilter.paymentDate = { $lt: startDate };
        }

        if (query.to) {
            const endDate = new Date(query.to);
            endDate.setHours(23, 59, 59, 999);

            saleFilter.saleDate.$lte = endDate;
            paymentFilter.paymentDate.$lte = endDate;
        }
    }

    const [
        sales,
        payments,
        priorSalesSummary,
        priorPaymentsSummary,
    ] = await Promise.all([
        Sale.find(saleFilter)
        .select(
            "invoiceNumber saleDate items subTotal discount tax grandTotal paidAmount remainingBalance paymentMethod paymentStatus status remarks customer createdAt"
        )
            .populate("customer", "name shopName phone")
            .populate("items.product", "name sku")
            .sort({ saleDate: 1, createdAt: 1 })
            .lean(),

        Payment.find(paymentFilter)
        .select(
            "receiptNumber amount paymentMethod paymentDate remarks sale createdAt"
        )
            .populate("sale", "invoiceNumber grandTotal")
            .sort({ paymentDate: 1, createdAt: 1 })
            .lean(),

        query.from
            ? Sale.aggregate([
                { $match: priorSaleFilter },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$grandTotal" },
                    },
                },
            ])
            : Promise.resolve([]),

        query.from
            ? Payment.aggregate([
                { $match: priorPaymentFilter },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" },
                    },
                },
            ])
            : Promise.resolve([]),
    ]);

    const priorSales = priorSalesSummary[0]?.total || 0;
    const priorPayments = priorPaymentsSummary[0]?.total || 0;
    const ledgerOpeningBalance =
        (customer.openingBalance || 0) +
        priorSales -
        priorPayments;

    let transactions = [];

    // Add Sales
    sales.forEach((sale) => {
        transactions.push({
            _id: `sale-${sale._id}`,
            sourceId: sale._id,
            date: sale.saleDate,
            type: "SALE",
            reference: sale.invoiceNumber,
            debit: sale.grandTotal,
            credit: 0,
            paymentMethod: sale.paymentMethod,
            paymentStatus: sale.paymentStatus,
            remarks: sale.remarks,
        });
    });

    // Add Payments
    payments.forEach((payment) => {
        transactions.push({
            _id: `payment-${payment._id}`,
            sourceId: payment._id,
            date: payment.paymentDate,
            type: "PAYMENT",
            reference: payment.receiptNumber,
            debit: 0,
            credit: payment.amount,
            paymentMethod: payment.paymentMethod,
            paymentStatus: null,
            remarks: payment.remarks,
            sale: payment.sale,
        });
    });

    // Sort by Date
    transactions.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Running Balance
    let balance = ledgerOpeningBalance;

    transactions = transactions.map((transaction) => {

        balance =
            balance +
            transaction.debit -
            transaction.credit;

        return {
            ...transaction,
            balance,
        };

    });

    const totalSales = sales.reduce(
        (sum, sale) => sum + (sale.grandTotal || 0),
        0
    );

    const totalPaidFromSales = sales.reduce(
        (sum, sale) => sum + (sale.paidAmount || 0),
        0
    );

    const totalRemainingFromSales = sales.reduce(
        (sum, sale) => sum + (sale.remainingBalance || 0),
        0
    );

    const totalPayments = payments.reduce(
        (sum, payment) => sum + (payment.amount || 0),
        0
    );

    return {

        customer: {
            _id: customer._id,
            name: customer.name,
            shopName: customer.shopName,
            phone: customer.phone,
            address: customer.address,
            openingBalance: customer.openingBalance,
            currentBalance: customer.currentBalance,
            creditLimit: customer.creditLimit,
            isActive: customer.isActive,
        },

        openingBalance: customer.openingBalance,

        currentBalance: customer.currentBalance,

        ledgerOpeningBalance,

        summary: {
            totalSales,
            totalPaidFromSales,
            totalRemainingFromSales,
            totalPayments,
            netOutstandingBalance: balance,
            currentOutstandingBalance: customer.currentBalance,
            totalInvoices: sales.length,
            totalPaymentRecords: payments.length,
        },

        sales,

        payments,

        transactions,

    };

};

export const getInventoryReportService = async (query) => {

    const filter = {};

    // Product Filter
    if (query.product) {
        filter.product = query.product;
    }

    // Type Filter (IN / OUT / ADJUSTMENT)
    if (query.type) {
        filter.type = query.type;
    }

    // Date Filter
    if (query.from || query.to) {

        filter.createdAt = {};

        if (query.from) {
            filter.createdAt.$gte = new Date(query.from);
        }

        if (query.to) {
            const endDate = new Date(query.to);
            endDate.setHours(23, 59, 59, 999);
            filter.createdAt.$lte = endDate;
        }
    }

    const logs = await InventoryLog.find(filter)
        .populate("product", "name sku")
        .populate("createdBy", "fullName")
        .sort({ createdAt: -1 });

    const summary = await InventoryLog.aggregate([
        {
            $match: filter,
        },
        {
            $group: {
                _id: "$type",
                totalQuantity: {
                    $sum: "$quantity",
                },
                totalTransactions: {
                    $sum: 1,
                },
            },
        },
    ]);

    return {
        summary,
        logs,
    };

};
