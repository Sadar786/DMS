import Modal from "../../ui/Modal";
import {
  Card,
  CardContent,
} from "../../ui";

export default function StockEntryViewModal({
  open,
  entry,
  onClose,
}) {
  if (!entry) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Stock Entry Details"
      size="xl"
    >
      <Card>
        <CardContent className="space-y-6">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">
                Invoice Number
              </p>

              <p className="font-medium">
                {entry.invoiceNumber}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Supplier
              </p>

              <p className="font-medium">
                {entry.supplier}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Entry Date
              </p>

              <p className="font-medium">
                {new Date(entry.entryDate).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Remarks
              </p>

              <p className="font-medium">
                {entry.remarks || "-"}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border px-3 py-2 text-left">
                    Product
                  </th>

                  <th className="border px-3 py-2">
                    Qty
                  </th>

                  <th className="border px-3 py-2">
                    Cost Price
                  </th>

                  <th className="border px-3 py-2">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {entry.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border px-3 py-2">
                      {item.product?.name}
                    </td>

                    <td className="border px-3 py-2 text-center">
                      {item.quantity}
                    </td>

                    <td className="border px-3 py-2 text-right">
                      Rs {item.costPrice.toLocaleString()}
                    </td>

                    <td className="border px-3 py-2 text-right">
                      Rs {(item.quantity * item.costPrice).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </CardContent>
      </Card>
    </Modal>
  );
}