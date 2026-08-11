import { DataTable } from "../../ui";
import TableActions from "../common/TableActions";

export default function StockEntryTable({
  entries = [],
  loading,
  onView,
}) {
  const columns = [
    {
      key: "invoiceNumber",
      title: "Invoice",
    },

    {
      key: "entryDate",
      title: "Date",
      render: (row) =>
        row.entryDate
          ? new Date(row.entryDate).toLocaleDateString()
          : "—",
    },

    {
      key: "products",
      title: "Products",
      render: (row) => (
        <div className="space-y-1">
          {row.items?.map((item, index) => (
            <div
              key={index}
              className="font-medium text-slate-700"
            >
              {item.product?.name || "Unknown Product"}
            </div>
          ))}
        </div>
      ),
    },

    {
      key: "quantities",
      title: "Qty",
      render: (row) => (
        <div className="space-y-1">
          {row.items?.map((item, index) => (
            <div key={index}>
              {item.quantity} cartons
            </div>
          ))}
        </div>
      ),
    },

    {
      key: "costPrices",
      title: "Cost Price",
      render: (row) => (
        <div className="space-y-1">
          {row.items?.map((item, index) => (
            <div key={index}>
              Rs {Number(item.costPrice || 0).toLocaleString()}
            </div>
          ))}
        </div>
      ),
    },

    {
      key: "total",
      title: "Total",
      render: (row) => {
        const total =
          row.items?.reduce(
            (sum, item) =>
              sum +
              Number(item.quantity || 0) *
                Number(item.costPrice || 0),
            0
          ) || 0;

        return (
          <span className="font-semibold">
            Rs {total.toLocaleString()}
          </span>
        );
      },
    },

    {
      key: "items",
      title: "Items",
      render: (row) => row.items?.length || 0,
    },

    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <TableActions
          onView={() => onView(row)}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={entries}
      loading={loading}
      emptyMessage="No stock entries found."
    />
  );
}