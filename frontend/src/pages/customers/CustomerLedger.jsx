import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaMoneyBillWave,
  FaReceipt,
  FaScaleBalanced,
  FaWallet,
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
} from "../../ui";
import SaleViewModal from "../../components/sales/SaleViewModal";
import PaymentModal from "../../components/payments/PaymentModal";
import { getCustomerLedger } from "../../services/customerLedgerService";

const money = (value = 0) =>
  `Rs ${Number(value || 0).toLocaleString()}`;

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "—";

function SummaryCard({
  title,
  value,
  helper,
  icon: Icon,
  color = "bg-primary-600",
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </h3>
          {helper && (
            <p className="mt-1 text-xs text-slate-400">
              {helper}
            </p>
          )}
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${color}`}
        >
          <Icon size={20} />
        </div>
      </CardContent>
    </Card>
  );
}

function PaymentStatusBadge({ status }) {
  if (status === "PAID") {
    return <Badge variant="success">Paid</Badge>;
  }

  if (status === "PARTIAL") {
    return <Badge variant="warning">Partial</Badge>;
  }

  if (status === "UNPAID") {
    return <Badge variant="danger">Unpaid</Badge>;
  }

  return <span className="text-slate-400">—</span>;
}

export default function CustomerLedger() {
  const { customerId } = useParams();
  const navigate = useNavigate();

  const [ledger, setLedger] = useState(null);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  async function loadLedger(options = {}) {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      const nextFrom = options.from ?? from;
      const nextTo = options.to ?? to;

      if (nextFrom) params.set("from", nextFrom);
      if (nextTo) params.set("to", nextTo);

      const response = await getCustomerLedger(
        customerId,
        params.toString() ? `?${params.toString()}` : ""
      );

      setLedger(response.data);
    } catch (error) {
      toast.error(error.message || "Failed to load customer ledger.");
      setLedger(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLedger({
      from: "",
      to: "",
    });
  }, [customerId]);

  function applyFilter() {
    loadLedger();
  }

  function resetFilter() {
    setFrom("");
    setTo("");
    loadLedger({
      from: "",
      to: "",
    });
  }

  const customer = ledger?.customer;
  const summary = ledger?.summary || {};

  const summaryCards = useMemo(
    () => [
      {
        title: "Current Outstanding",
        value: money(summary.currentOutstandingBalance),
        helper: "Customer's saved current balance",
        icon: FaWallet,
        color: "bg-orange-600",
      },
      {
        title: "Total Sales",
        value: money(summary.totalSales),
        helper: `${summary.totalInvoices || 0} invoices in view`,
        icon: FaReceipt,
        color: "bg-emerald-600",
      },
      {
        title: "Total Payments",
        value: money(summary.totalPayments),
        helper: `${summary.totalPaymentRecords || 0} payments in view`,
        icon: FaMoneyBillWave,
        color: "bg-blue-600",
      },
      {
        title: "Net Outstanding",
        value: money(summary.netOutstandingBalance),
        helper: "Ledger balance after selected transactions",
        icon: FaScaleBalanced,
        color: "bg-primary-600",
      },
    ],
    [summary]
  );

  const ledgerColumns = [
    {
      key: "date",
      title: "Date",
      render: (row) => formatDate(row.date),
    },
    {
      key: "type",
      title: "Type",
      render: (row) =>
        row.type === "SALE" ? (
          <Badge variant="primary">Sale</Badge>
        ) : (
          <Badge variant="success">Payment</Badge>
        ),
    },
    {
      key: "reference",
      title: "Reference",
    },
    {
      key: "debit",
      title: "Debit",
      render: (row) =>
        row.debit ? money(row.debit) : <span className="text-slate-400">—</span>,
    },
    {
      key: "credit",
      title: "Credit",
      render: (row) =>
        row.credit ? money(row.credit) : <span className="text-slate-400">—</span>,
    },
    {
      key: "balance",
      title: "Balance",
      render: (row) => (
        <span className="font-semibold">
          {money(row.balance)}
        </span>
      ),
    },
    {
      key: "remarks",
      title: "Remarks",
      render: (row) => row.remarks || "—",
    },
  ];

  const saleColumns = [
    {
      key: "invoiceNumber",
      title: "Invoice",
    },
    {
      key: "saleDate",
      title: "Date",
      render: (row) => formatDate(row.saleDate),
    },
    {
      key: "grandTotal",
      title: "Total",
      render: (row) => money(row.grandTotal),
    },
    {
      key: "paidAmount",
      title: "Paid",
      render: (row) => money(row.paidAmount),
    },
    {
      key: "remainingBalance",
      title: "Credit",
      render: (row) => money(row.remainingBalance),
    },
    {
      key: "paymentMethod",
      title: "Method",
      render: (row) => row.paymentMethod || "—",
    },
    {
      key: "paymentStatus",
      title: "Status",
      render: (row) => (
        <PaymentStatusBadge status={row.paymentStatus} />
      ),
    },
    {
      key: "actions",
      title: "Action",
      render: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={(event) => {
            event.stopPropagation();
            setSelectedSale(row);
          }}
        >
          View Details
        </Button>
      ),
    },
  ];

  const paymentColumns = [
    {
      key: "paymentDate",
      title: "Date",
      render: (row) => formatDate(row.paymentDate),
    },
    {
      key: "receiptNumber",
      title: "Receipt",
    },
    {
      key: "amount",
      title: "Amount",
      render: (row) => money(row.amount),
    },
    {
      key: "paymentMethod",
      title: "Method",
      render: (row) => row.paymentMethod || "—",
    },
    {
      key: "sale",
      title: "Invoice",
      render: (row) => row.sale?.invoiceNumber || "—",
    },
    {
      key: "remarks",
      title: "Remarks",
      render: (row) => row.remarks || "—",
    },
  ];

  if (!loading && !ledger) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            Customer not found
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            The customer may not exist or could not be loaded.
          </p>
          <Button
            className="mt-4"
            variant="secondary"
            onClick={() => navigate("/customers")}
          >
            Back to Customers
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <Button
            variant="ghost"
            leftIcon={<FaArrowLeft />}
            onClick={() => navigate("/customers")}
          >
            Back to Customers
          </Button>
          <h1 className="mt-3 text-2xl font-bold text-slate-900">
            Customer Ledger
          </h1>
          <p className="text-sm text-slate-500">
            Sales, payments, and running balance history.
          </p>
        </div>

        <Button
          leftIcon={<FaMoneyBillWave />}
          onClick={() => setPaymentModalOpen(true)}
        >
          Add Payment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && !customer ? (
            <div className="flex h-28 items-center justify-center text-slate-500">
              Loading customer...
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <p className="text-xs text-slate-500">
                  Customer
                </p>
                <p className="font-semibold text-slate-900">
                  {customer?.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Shop</p>
                <p className="font-semibold text-slate-900">
                  {customer?.shopName}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Phone</p>
                <p className="font-semibold text-slate-900">
                  {customer?.phone}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Address</p>
                <p className="font-semibold text-slate-900">
                  {customer?.address}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Date Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Input
              type="date"
              label="From Date"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
            />

            <Input
              type="date"
              label="To Date"
              value={to}
              onChange={(event) => setTo(event.target.value)}
            />

            <div className="flex items-end">
              <Button
                loading={loading}
                onClick={applyFilter}
                fullWidth
              >
                Apply Filter
              </Button>
            </div>

            <div className="flex items-end">
              <Button
                variant="secondary"
                disabled={loading}
                onClick={resetFilter}
                fullWidth
              >
                Clear / Reset
              </Button>
            </div>
          </div>

          {ledger?.ledgerOpeningBalance !== undefined && (
            <p className="mt-3 text-xs text-slate-500">
              Ledger opening balance for this view:{" "}
              <strong>{money(ledger.ledgerOpeningBalance)}</strong>
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Combined Customer Ledger</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={ledgerColumns}
            data={ledger?.transactions || []}
            loading={loading}
            emptyMessage="No ledger transactions found for this customer."
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales History</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={saleColumns}
              data={ledger?.sales || []}
              loading={loading}
              emptyMessage="No sales found for this customer."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={paymentColumns}
              data={ledger?.payments || []}
              loading={loading}
              emptyMessage="No payments found for this customer."
            />
          </CardContent>
        </Card>
      </div>

      <SaleViewModal
        open={!!selectedSale}
        sale={selectedSale}
        onClose={() => setSelectedSale(null)}
      />

      <PaymentModal
        open={paymentModalOpen}
        defaultCustomerId={customerId}
        onClose={() => setPaymentModalOpen(false)}
        onSuccess={() => loadLedger()}
      />
    </div>
  );
}
