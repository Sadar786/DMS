import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FaMagnifyingGlass,
  FaMoneyBillWave,
  FaPlus,
} from "react-icons/fa6";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  Input,
  Select,
} from "../../ui";
import SearchableSelect from "../../components/common/SearchableSelect";
import PaymentModal from "../../components/payments/PaymentModal";
import PaymentViewModal from "../../components/payments/PaymentViewModal";
import { getCustomers } from "../../services/customerService";
import { getPaymentReport } from "../../services/paymentService";

const PAYMENT_METHODS = [
  { value: "", label: "All Methods" },
  { value: "Cash", label: "Cash" },
  { value: "Online", label: "Online" },
];

const money = (value = 0) =>
  `Rs ${Number(value || 0).toLocaleString()}`;

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "—";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({
    totalPayments: 0,
    totalAmount: 0,
  });
  const [customers, setCustomers] = useState([]);

  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [customer, setCustomer] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewPayment, setViewPayment] = useState(null);

  async function loadCustomers() {
    try {
      const response = await getCustomers(
        "?limit=1000&isActive=true"
      );

      setCustomers([
        { value: "", label: "All Customers" },
        ...(response.data.customers || []).map((item) => ({
          value: item._id,
          label: `${item.shopName} - ${item.name}`,
        })),
      ]);
    } catch (error) {
      toast.error(error.message || "Failed to load customers.");
    }
  }

  async function loadPayments(overrides = {}) {
    try {
      setLoading(true);

      const nextFrom = overrides.from ?? from;
      const nextTo = overrides.to ?? to;
      const nextCustomer = overrides.customer ?? customer;
      const nextPaymentMethod =
        overrides.paymentMethod ?? paymentMethod;

      const params = new URLSearchParams();
      if (nextFrom) params.set("from", nextFrom);
      if (nextTo) params.set("to", nextTo);
      if (nextCustomer) params.set("customer", nextCustomer);
      if (nextPaymentMethod) {
        params.set("paymentMethod", nextPaymentMethod);
      }

      const response = await getPaymentReport(
        params.toString() ? `?${params.toString()}` : ""
      );

      setPayments(response.data.payments || []);
      setSummary(
        response.data.summary || {
          totalPayments: 0,
          totalAmount: 0,
        }
      );
    } catch (error) {
      toast.error(error.message || "Failed to load payments.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
    loadPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return payments;

    return payments.filter((payment) => {
      const text = [
        payment.receiptNumber,
        payment.customer?.name,
        payment.customer?.shopName,
        payment.customer?.phone,
        payment.sale?.invoiceNumber,
        payment.paymentMethod,
        payment.remarks,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(keyword);
    });
  }, [payments, search]);

  function resetFilters() {
    setSearch("");
    setFrom("");
    setTo("");
    setCustomer("");
    setPaymentMethod("");

    loadPayments({
      from: "",
      to: "",
      customer: "",
      paymentMethod: "",
    });
  }

  function handlePaymentSuccess() {
    loadPayments();
  }

  const columns = [
    {
      key: "paymentDate",
      title: "Date",
      render: (row) => formatDate(row.paymentDate),
    },
    {
      key: "customer",
      title: "Customer",
      render: (row) => (
        <div>
          <p className="font-medium text-slate-800">
            {row.customer?.name || "—"}
          </p>
          <p className="text-xs text-slate-400">
            {row.customer?.phone || ""}
          </p>
        </div>
      ),
    },
    {
      key: "shopName",
      title: "Shop",
      render: (row) => row.customer?.shopName || "—",
    },
    {
      key: "receiptNumber",
      title: "Reference",
      render: (row) => (
        <div>
          <p className="font-medium">
            {row.receiptNumber || "—"}
          </p>
          <p className="text-xs text-slate-400">
            {row.sale?.invoiceNumber || ""}
          </p>
        </div>
      ),
    },
    {
      key: "amount",
      title: "Amount",
      render: (row) => (
        <span className="font-semibold text-emerald-600">
          {money(row.amount)}
        </span>
      ),
    },
    {
      key: "paymentMethod",
      title: "Method",
      render: (row) => (
        <Badge variant="primary">
          {row.paymentMethod || "—"}
        </Badge>
      ),
    },
    {
      key: "remarks",
      title: "Remarks",
      render: (row) => row.remarks || "—",
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={(event) => {
            event.stopPropagation();
            setViewPayment(row);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Payments</CardTitle>
              <p className="mt-1 text-sm text-slate-500">
                View customer payments and record invoice payments.
              </p>
            </div>

            <Button
              leftIcon={<FaPlus />}
              onClick={() => setModalOpen(true)}
            >
              Add Payment
            </Button>
          </CardHeader>

          <CardContent>
            <div className="mb-5 grid gap-4 lg:grid-cols-6">
              <div className="lg:col-span-2">
                <Input
                  label="Search"
                  placeholder="Search receipt, customer, shop, invoice..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  leftIcon={<FaMagnifyingGlass />}
                />
              </div>

              <Input
                type="date"
                label="From"
                value={from}
                onChange={(event) => setFrom(event.target.value)}
              />

              <Input
                type="date"
                label="To"
                value={to}
                onChange={(event) => setTo(event.target.value)}
              />

              <SearchableSelect
                label="Customer"
                placeholder="All Customers"
                value={customer}
                onChange={setCustomer}
                options={customers}
              />

              <Select
                label="Method"
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(event.target.value)
                }
                options={PAYMENT_METHODS}
              />
            </div>

            <div className="mb-5 flex flex-col gap-3 rounded-lg bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
                  <FaMoneyBillWave />
                </div>
                <div>
                  <p className="text-sm text-slate-500">
                    Total Payments
                  </p>
                  <p className="text-xl font-bold text-slate-900">
                    {money(summary.totalAmount)}
                  </p>
                  <p className="text-xs text-slate-400">
                    {summary.totalPayments || 0} records from backend
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  loading={loading}
                  onClick={loadPayments}
                >
                  Apply Filters
                </Button>
                <Button
                  variant="secondary"
                  disabled={loading}
                  onClick={resetFilters}
                >
                  Reset
                </Button>
              </div>
            </div>

            <DataTable
              columns={columns}
              data={filteredPayments}
              loading={loading}
              emptyMessage="No payments found."
              onRowClick={setViewPayment}
            />
          </CardContent>
        </Card>
      </div>

      <PaymentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />

      <PaymentViewModal
        open={!!viewPayment}
        payment={viewPayment}
        onClose={() => setViewPayment(null)}
      />
    </>
  );
}
