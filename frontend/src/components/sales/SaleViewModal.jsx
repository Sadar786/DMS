import Modal from "../../ui/Modal";
import { Badge, Button } from "../../ui";

export default function SaleViewModal({
  open,
  sale,
  onClose,
}) {
  if (!sale) return null;

  const customer = sale.customer;

  const money = (value) =>
    `Rs ${Number(value || 0).toLocaleString()}`;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Sale ${sale.invoiceNumber || ""}`}
      size="xl"
    >
      <div className="max-h-[75vh] space-y-4 overflow-y-auto pr-1">

        {/* Sale + Customer Information */}
        <div className="grid gap-3 md:grid-cols-2">

          {/* Sale Information */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <h3 className="mb-2 text-sm font-semibold text-slate-800">
              Sale Information
            </h3>

            <div className="grid grid-cols-2 gap-3 text-sm">

              <div>
                <p className="text-xs text-slate-500">
                  Invoice
                </p>

                <p className="font-medium">
                  {sale.invoiceNumber || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Date
                </p>

                <p className="font-medium">
                  {sale.saleDate
                    ? new Date(
                        sale.saleDate
                      ).toLocaleDateString()
                    : "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Payment
                </p>

                <div className="mt-1">
                  {sale.paymentStatus === "PAID" && (
                    <Badge variant="success">
                      Paid
                    </Badge>
                  )}

                  {sale.paymentStatus === "PARTIAL" && (
                    <Badge variant="warning">
                      Partial
                    </Badge>
                  )}

                  {sale.paymentStatus === "UNPAID" && (
                    <Badge variant="danger">
                      Unpaid
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Method
                </p>

                <p className="font-medium">
                  {sale.paymentMethod || "—"}
                </p>
              </div>

            </div>
          </div>

          {/* Customer Information */}
          <div className="rounded-lg border border-slate-200 p-3">
            <h3 className="mb-2 text-sm font-semibold text-slate-800">
              Customer
            </h3>

            <div className="grid grid-cols-2 gap-3 text-sm">

              <div>
                <p className="text-xs text-slate-500">
                  Shop
                </p>

                <p className="font-medium">
                  {customer?.shopName || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Customer
                </p>

                <p className="font-medium">
                  {customer?.name || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Phone
                </p>

                <p className="font-medium">
                  {customer?.phone || "—"}
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Products */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-800">
            Products
          </h3>

          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="max-h-64 overflow-y-auto">

              <table className="w-full border-collapse text-sm">

                <thead className="sticky top-0 bg-slate-50">
                  <tr className="border-b text-left">
                    <th className="px-3 py-2">
                      Product
                    </th>

                    <th className="px-3 py-2 text-center">
                      Qty
                    </th>

                    <th className="px-3 py-2 text-right">
                      Price
                    </th>

                    <th className="px-3 py-2 text-right">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {sale.items?.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-3 py-2">
                        <div className="font-medium">
                          {item.product?.name ||
                            "Unknown Product"}
                        </div>

                        {item.product?.sku && (
                          <div className="text-xs text-slate-500">
                            SKU: {item.product.sku}
                          </div>
                        )}
                      </td>

                      <td className="px-3 py-2 text-center">
                        {item.quantity}
                      </td>

                      <td className="px-3 py-2 text-right">
                        {money(item.sellingPrice)}
                      </td>

                      <td className="px-3 py-2 text-right font-medium">
                        {money(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          </div>
        </div>

        {/* Summary + Payment Details */}
        <div className="grid gap-3 md:grid-cols-2">

          {/* Payment Summary */}
          <div className="rounded-lg border border-slate-200 p-3">

            <h3 className="mb-2 text-sm font-semibold text-slate-800">
              Payment Summary
            </h3>

            <div className="space-y-2 text-sm">

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Subtotal
                </span>

                <span>
                  {money(sale.subTotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Discount
                </span>

                <span>
                  {money(sale.discount)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Tax
                </span>

                <span>
                  {money(sale.tax)}
                </span>
              </div>

              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">
                  Grand Total
                </span>

                <span className="font-bold">
                  {money(sale.grandTotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Paid
                </span>

                <span className="font-medium text-green-600">
                  {money(sale.paidAmount)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">
                  Remaining
                </span>

                <span className="font-bold text-red-600">
                  {money(sale.remainingBalance)}
                </span>
              </div>

            </div>
          </div>

          {/* Extra Details */}
          <div className="rounded-lg border border-slate-200 p-3">

            <h3 className="mb-2 text-sm font-semibold text-slate-800">
              Details
            </h3>

            <div className="space-y-3 text-sm">

              <div>
                <p className="text-xs text-slate-500">
                  Payment Method
                </p>

                <p className="font-medium">
                  {sale.paymentMethod || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Remarks
                </p>

                <p className="font-medium">
                  {sale.remarks || "—"}
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end border-t pt-3">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Close
          </Button>
        </div>

      </div>
    </Modal>
  );
}