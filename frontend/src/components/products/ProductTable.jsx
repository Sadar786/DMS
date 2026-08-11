import { Badge, DataTable } from "../../ui";
import TableActions from "../common/TableActions";

export default function ProductTable({ products, loading,onView, onEdit, onDelete }) {
  const columns = [
    {
      key: "sku",
      title: "SKU",
    },
    {
      key: "name",
      title: "Product",
    },
    {
      key: "category",
      title: "Category",
    },
    {
      key: "brand",
      title: "Brand",
    },
    {
      key: "currentStock",
      title: "Stock",
    },
    {
      key: "defaultSellingPrice",
      title: "Price",
      render: (row) => `Rs ${row.defaultSellingPrice.toLocaleString()}`,
    },
    {
      key: "isActive",
      title: "Status",
      render: (row) =>
        row.isActive ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="danger">Inactive</Badge>
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
      data={products}
      loading={loading}
      emptyMessage="No products found."
    />
  );
}
