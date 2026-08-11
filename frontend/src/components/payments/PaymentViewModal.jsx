import Modal from "../../ui/Modal";
import { Badge, Button } from "../../ui";

const money = (value = 0) =>
  `Rs ${Number(value || 0).toLocaleString()}`;

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "—";

export default function PaymentViewModal({
  open,
  payment,
  onClose,
}) {
  if (!payment) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Payment ${payment.receiptNumber || ""}`}
      size="md"
    >
      <div className="space-y-4">
        <div className="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <p className="text-xs text-slate-500">Receipt</p>
            <p className="font-semibold">
              {payment.receiptNumber || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Date</p>
            <p className="font-semibold">
              {formatDate(payment.paymentDate)}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Customer</p>
            <p className="font-semibold">
              {payment.customer?.name || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Shop</p>
            <p className="font-semibold">
              {payment.customer?.shopName || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Invoice</p>
            <p className="font-semibold">
              {payment.sale?.invoiceNumber || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Method</p>
            <Badge variant="primary">
              {payment.paymentMethod || "—"}
            </Badge>
          </div>

          <div>
            <p className="text-xs text-slate-500">Amount</p>
            <p className="text-lg font-bold text-emerald-600">
              {money(payment.amount)}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Remarks</p>
            <p className="font-semibold">
              {payment.remarks || "—"}
            </p>
          </div>
        </div>

        <div className="flex justify-end border-t pt-4">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
