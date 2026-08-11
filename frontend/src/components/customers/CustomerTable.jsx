import { Badge, DataTable } from "../../ui";
import TableActions from "../common/TableActions";

export default function CustomerTable({
  customers,
  loading,
  onView,
  onEdit,
  onDelete,
  onOpenLedger,
}) {
  const columns = [
    {
      key: "name",
      title: "Customer",
      render: (row) => (
        <div>
          <p className="font-medium text-slate-800">
            {row.name}
          </p>
          <p className="text-xs text-primary-600">
            Click to open ledger
          </p>
        </div>
      ),
    },
    {
      key: "shopName",
      title: "Shop",
    },
    {
      key: "phone",
      title: "Phone",
    },
    {
      key: "currentBalance",
      title: "Balance",
      render: (row) =>
        `Rs ${row.currentBalance.toLocaleString()}`,
    },
    {
      key: "isActive",
      title: "Status",
      render: (row) =>
        row.isActive ? (
          <Badge variant="success">
            Active
          </Badge>
        ) : (
          <Badge variant="danger">
            Inactive
          </Badge>
        ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <TableActions
          onView={() => onView(row)}
          onEdit={() => onEdit(row)}
          onDelete={() => onDelete(row)}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={customers}
      loading={loading}
      emptyMessage="No customers found."
      onRowClick={onOpenLedger}
      getRowClassName={() =>
        "transition hover:bg-primary-50"
      }
    />
  );
}
