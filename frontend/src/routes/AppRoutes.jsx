//src/routes/AppRouter.jsx

import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
//import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Products from "../pages/products/Products";
import Customers from "../pages/customers/Customers";
import CustomerLedger from "../pages/customers/CustomerLedger";
 import Sales from "../pages/sales/Sales"
import StockEntery from "../pages/stockentries/StockEntries";
import Reports from "../pages/reports/Reports";
import Payments from "../pages/payments/Payments";
//import Payments from "../pages/Payments";
//import Expiry from "../pages/Expiry";
//import Reports from "../pages/Reports";
//import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:customerId" element={<CustomerLedger />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/stock-in" element={<StockEntery />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>

      {/* <Routes>
      
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
         
          <Route path="/payments" element={<Payments />} />
          <Route path="/expiry" element={<Expiry />} />
          <Route path="/reports" element={<Reports />} />
        </Route>

      <Route path="*" element={<NotFound />} />
      </Routes> */}
    </BrowserRouter>
  );
}
