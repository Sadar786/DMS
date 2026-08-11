import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import Modal from "../../ui/Modal";
import { Button, Input, Select } from "../../ui";
import SearchableSelect from "../common/SearchableSelect";
import SaleItemTable from "./SaleItemTable";

import { getProducts } from "../../services/productService";
import { getCustomers } from "../../services/customerService";
import { createSale } from "../../services/saleService";
import { createPayment } from "../../services/paymentService";

const PAYMENT_METHODS = [
  { value: "Cash", label: "Cash" },
  { value: "Online", label: "Online" },
];

const money = (value = 0) =>
  `Rs ${Number(value || 0).toLocaleString()}`;

const dateOnly = (date) =>
  new Date(date).toISOString().slice(0, 10);

export default function SaleModal({
  open,
  onClose,
  onSuccess,
}) {
  const [customer, setCustomer] = useState("");
  const [customers, setCustomers] = useState([]);

  const [items, setItems] = useState([
    {
      product: "",
      quantity: 1,
      sellingPrice: 0,
    },
  ]);

  const [products, setProducts] = useState([]);

  const [paymentReceived, setPaymentReceived] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentDate, setPaymentDate] = useState(dateOnly(new Date()));
  const [paymentRemarks, setPaymentRemarks] = useState("");
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      loadProducts();
      loadCustomers();

      setCustomer("");
      setDiscount(0);
      setTax(0);
      setPaymentReceived(0);
      setPaymentMethod("Cash");
      setPaymentDate(dateOnly(new Date()));
      setPaymentRemarks("");

      setItems([
        {
          product: "",
          quantity: 1,
          sellingPrice: 0,
        },
      ]);
    }
  }, [open]);

  async function loadProducts() {
    try {
      const response = await getProducts(
        "?limit=1000&isActive=true"
      );

      setProducts(
        response.data.products.map((product) => ({
          value: product._id,
          label: product.name,
          sellingPrice: product.defaultSellingPrice,
          stock: product.currentStock,
        }))
      );
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function loadCustomers() {
    try {
      const response = await getCustomers(
        "?limit=1000&isActive=true"
      );

      setCustomers(
        response.data.customers.map((customer) => ({
          value: customer._id,
          label: customer.shopName,
        }))
      );
    } catch (error) {
      toast.error(error.message);
    }
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        product: "",
        quantity: 1,
        sellingPrice: 0,
      },
    ]);
  }

  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index, field, value) {
    const updated = [...items];

    updated[index][field] = value;

    if (field === "product") {
      const selected = products.find(
        (p) => p.value === value
      );

      if (selected) {
        updated[index].sellingPrice =
          selected.sellingPrice;
      }
    }

    setItems(updated);
  }

  const subTotal = useMemo(() => {
    return items.reduce(
      (sum, item) =>
        sum +
        Number(item.quantity || 0) *
          Number(item.sellingPrice || 0),
      0
    );
  }, [items]);

  const finalTotal =
    subTotal -
    Number(discount || 0) +
    Number(tax || 0);

  const remainingBalance =
    finalTotal - Number(paymentReceived || 0);

  const paymentMessage = (() => {
    if (Number(paymentReceived || 0) === 0) {
      return "This sale will be recorded as customer credit.";
    }

    if (Number(paymentReceived || 0) === Number(finalTotal || 0)) {
      return "This sale will be fully paid.";
    }

    if (Number(paymentReceived || 0) > 0) {
      return "This sale will be partially paid.";
    }

    return "";
  })();

  async function handleSave() {
    if (!customer) {
      return toast.error("Please select customer.");
    }

    if (items.length === 0) {
      return toast.error("Please add products.");
    }

    if (
      items.some(
        (item) =>
          !item.product ||
          Number(item.quantity) <= 0 ||
          Number(item.sellingPrice) <= 0
      )
    ) {
      return toast.error(
        "Please complete all product rows."
      );
    }

    if (Number(paymentReceived || 0) < 0) {
      return toast.error(
        "Payment amount cannot be negative."
      );
    }

    if (Number(paymentReceived || 0) > finalTotal) {
      return toast.error(
        "Paid amount cannot exceed total."
      );
    }

    try {
      setSaving(true);

      const saleResponse = await createSale({
        customer,
        items,
        discount: Number(discount),
        tax: Number(tax),
        paidAmount: 0,
        paymentMethod,
      });

      const createdSale = saleResponse.data;
      const receivedAmount = Number(paymentReceived || 0);

      if (receivedAmount > 0) {
        try {
          await createPayment({
            sale: createdSale._id,
            amount: receivedAmount,
            paymentMethod,
            paymentDate,
            remarks: paymentRemarks,
          });

          toast.success(
            "Sale created and payment recorded successfully."
          );
        } catch (paymentError) {
          toast.error(
            paymentError.message ||
              "Sale created, but payment could not be recorded."
          );
        }
      } else {
        toast.success("Credit sale created successfully.");
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Sale"
      size="xl"
    >
      <div className="space-y-6">
        <SearchableSelect
          label="Customer"
          placeholder="Select customer"
          value={customer}
          onChange={setCustomer}
          options={customers}
        />

        <div className="rounded-lg border border-slate-200">
          <div className="border-b bg-slate-50 px-4 py-3 font-semibold">
            Products
          </div>

          <div className="p-4">
            <SaleItemTable
              items={items}
              products={products}
              onAdd={addItem}
              onRemove={removeItem}
              onChange={updateItem}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-4">
            <h3 className="mb-4 font-semibold text-slate-800">
              Sale Totals
            </h3>

            <div className="grid gap-4">
              <Input
                label="Discount"
                type="number"
                min="0"
                value={discount}
                onChange={(e) =>
                  setDiscount(Number(e.target.value))
                }
              />

              <Input
                label="Tax / Other Charges"
                type="number"
                min="0"
                value={tax}
                onChange={(e) =>
                  setTax(Number(e.target.value))
                }
              />

              <div className="space-y-2 rounded-lg bg-slate-50 p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Subtotal
                  </span>
                  <span className="font-medium">
                    {money(subTotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Discount
                  </span>
                  <span>{money(discount)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Tax / Charges
                  </span>
                  <span>{money(tax)}</span>
                </div>

                <div className="flex justify-between border-t pt-2 text-base font-bold">
                  <span>Grand Total</span>
                  <span>{money(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-primary-100 bg-primary-50/40 p-4">
            <h3 className="mb-1 font-semibold text-slate-800">
              Payment Received
            </h3>
            <p className="mb-4 text-sm text-slate-500">
              Optional. Leave 0 for full credit sale.
            </p>

            <div className="grid gap-4">
              <Input
                label="Payment Amount"
                type="number"
                min="0"
                value={paymentReceived}
                onChange={(e) =>
                  setPaymentReceived(Number(e.target.value))
                }
              />

              <Select
                label="Payment Method"
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
                options={PAYMENT_METHODS}
              />

              <Input
                label="Payment Date"
                type="date"
                value={paymentDate}
                onChange={(e) =>
                  setPaymentDate(e.target.value)
                }
              />

              <Input
                label="Reference / Remarks"
                value={paymentRemarks}
                maxLength={300}
                placeholder="Optional"
                onChange={(e) =>
                  setPaymentRemarks(e.target.value)
                }
              />

              <div className="space-y-2 rounded-lg bg-white p-3 text-sm shadow-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Sale Total
                  </span>
                  <span className="font-medium">
                    {money(finalTotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Payment Received
                  </span>
                  <span className="font-medium text-emerald-600">
                    {money(paymentReceived)}
                  </span>
                </div>

                <div className="flex justify-between border-t pt-2 text-base font-bold">
                  <span>Remaining Credit</span>
                  <span
                    className={
                      remainingBalance > 0
                        ? "text-red-600"
                        : "text-emerald-600"
                    }
                  >
                    {money(Math.max(remainingBalance, 0))}
                  </span>
                </div>
              </div>

              {paymentMessage && (
                <p className="rounded-lg bg-white p-3 text-sm text-slate-600">
                  {paymentMessage}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            loading={saving}
            onClick={handleSave}
          >
            Save Sale
          </Button>
        </div>
      </div>
    </Modal>
  );
}
