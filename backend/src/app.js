import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import customerRoutes from "./routes/customer.routes.js"
import stockEntryRoutes from "./routes/stockEntery.routes.js";
import saleRoutes from "./routes/sale.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import reportRoutes from "./routes/report.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";

const app = express();

// Security
app.use(helmet());

// CORS
app.use(cors());

// Logger
app.use(morgan("dev"));

// Body Parser
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Pepsi Distribution API is running.",
  });
});

// Routes

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/stock-entries", stockEntryRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/reports", reportRoutes);
app.use("/api/invoices", invoiceRoutes);

// 404
app.use(notFound);

// Global Error
app.use(errorHandler);

export default app;