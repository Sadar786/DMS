import {
  FaChartLine,
  FaBoxOpen,
  FaUsers,
  FaCartShopping,
  FaWarehouse,
  FaMoneyBill,
  FaTriangleExclamation,
  FaChartColumn,
} from "react-icons/fa6";

const navigation = [
  
  {
    title: "Dashboard",
    path: "/",
    icon: FaChartLine,
  },
  {
    title: "Products",
    path: "/products",
    icon: FaBoxOpen,
  },
  {
    title: "Customers",
    path: "/customers",
    icon: FaUsers,
  },
  {
    title: "Sales",
    path: "/sales",
    icon: FaCartShopping,
  },
  {
    title: "Stock In",
    path: "/stock-in",
    icon: FaWarehouse,
  },
  {
    title: "Payments",
    path: "/payments",
    icon: FaMoneyBill,
  },
  {
    title: "Expiry",
    path: "/expiry",
    icon: FaTriangleExclamation,
  },
  {
    title: "Reports",
    path: "/reports",
    icon: FaChartColumn,
  },
  
];

export default navigation;