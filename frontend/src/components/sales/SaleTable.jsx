import { Badge, DataTable } from "../../ui";
import TableActions from "../common/TableActions";

export default function SaleTable({
  sales = [],
  loading,
  onView,
  onEdit,
}) {
  const columns = [
    {
      key: "invoiceNumber",
      title: "Invoice",
    },

    {
      key: "customer",
      title: "Customer",
      render: (row) => (
        <div>
          <p className="font-medium text-slate-800">
            {row.customer?.shopName || "—"}
          </p>

          {row.customer?.name && (
            <p className="text-xs text-slate-500">
              {row.customer.name}
            </p>
          )}
        </div>
      ),
    },

    {
      key: "saleDate",
      title: "Date",
      render: (row) =>
        row.saleDate
          ? new Date(row.saleDate).toLocaleDateString()
          : "—",
    },

    {
      key: "items",
      title: "Items",
      render: (row) => row.items?.length || 0,
    },

    {
      key: "grandTotal",
      title: "Total",
      render: (row) =>
        `Rs ${Number(row.grandTotal || 0).toLocaleString()}`,
    },

    {
      key: "paidAmount",
      title: "Paid",
      render: (row) =>
        `Rs ${Number(row.paidAmount || 0).toLocaleString()}`,
    },

    {
      key: "remainingBalance",
      title: "Balance",
      render: (row) =>
        `Rs ${Number(row.remainingBalance || 0).toLocaleString()}`,
    },

    {
      key: "paymentStatus",
      title: "Status",
      render: (row) => {
        if (row.paymentStatus === "PAID") {
          return <Badge variant="success">Paid</Badge>;
        }

        if (row.paymentStatus === "PARTIAL") {
          return <Badge variant="warning">Partial</Badge>;
        }

        return <Badge variant="danger">Unpaid</Badge>;
      },
    },

    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <TableActions
          onView={() => onView(row)}
          onEdit={onEdit ? () => onEdit(row) : undefined}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={sales}
      loading={loading}
      emptyMessage="No sales found."
    />
  );
}