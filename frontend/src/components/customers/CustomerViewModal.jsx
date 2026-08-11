import Modal from "../../ui/Modal";
import { Badge } from "../../ui";

export default function CustomerViewModal({
  open,
  customer,
  onClose,
}) {
  if (!customer) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Customer Details"
      size="md"
    >
      <div className="grid grid-cols-2 gap-4 text-sm">

        <div>
          <p className="text-slate-500">Customer</p>
          <p className="font-medium">{customer.name}</p>
        </div>

        <div>
          <p className="text-slate-500">Shop</p>
          <p className="font-medium">{customer.shopName}</p>
        </div>

        <div>
          <p className="text-slate-500">Phone</p>
          <p className="font-medium">{customer.phone}</p>
        </div>

        <div>
          <p className="text-slate-500">Address</p>
          <p className="font-medium">{customer.address}</p>
        </div>

        <div>
          <p className="text-slate-500">Opening Balance</p>
          <p className="font-medium">
            Rs {customer.openingBalance?.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-slate-500">Current Balance</p>
          <p className="font-medium">
            Rs {customer.currentBalance?.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-slate-500">Status</p>

          {customer.isActive ? (
            <Badge variant="success">Active</Badge>
          ) : (
            <Badge variant="danger">Inactive</Badge>
          )}
        </div>

      </div>
    </Modal>
  );
}