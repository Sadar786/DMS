import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import Modal from "../../ui/Modal";
import { Button, Input, Select } from "../../ui";
import SearchableSelect from "../common/SearchableSelect";

import { getCustomers } from "../../services/customerService";
import {
  createPayment,
  getSalesReport,
} from "../../services/paymentService";

const PAYMENT_METHODS = [
  { value: "Cash", label: "Cash" },
  { value: "Online", label: "Online" },
];

const money = (value = 0) =>
  `Rs ${Number(value || 0).toLocaleString()}`;

const dateOnly = (date) =>
  new Date(date).toISOString().slice(0, 10);

export default function PaymentModal({
  open,
  onClose,
  onSuccess,
  defaultCustomerId = "",
}) {
  const [customers, setCustomers] = useState([]);
  const [sales, setSales] = useState([]);

  const [customer, setCustomer] = useState(defaultCustomerId);
  const [sale, setSale] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentDate, setPaymentDate] = useState(dateOnly(new Date()));
  const [remarks, setRemarks] = useState("");

  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingSales, setLoadingSales] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setCustomer(defaultCustomerId || "");
    setSale("");
    setAmount("");
    setPaymentMethod("Cash");
    setPaymentDate(dateOnly(new Date()));
    setRemarks("");
    loadCustomers();
  }, [open, defaultCustomerId]);

  useEffect(() => {
    if (!open || !customer) {
      setSales([]);
      setSale("");
      return;
    }

    loadCustomerSales(customer);
  }, [open, customer]);

  async function loadCustomers() {
    try {
      setLoadingCustomers(true);
      const response = await getCustomers(
        "?limit=1000&isActive=true"
      );

      setCustomers(
        (response.data.customers || []).map((item) => ({
          value: item._id,
          label: `${item.shopName} - ${item.name}`,
          balance: item.currentBalance,
        }))
      );
    } catch (error) {
      toast.error(error.message || "Failed to load customers.");
    } finally {
      setLoadingCustomers(false);
    }
  }

  async function loadCustomerSales(customerId) {
    try {
      setLoadingSales(true);
      setSale("");

      const response = await getSalesReport(
        `?customer=${customerId}`
      );

      const unpaidSales = (response.data.sales || []).filter(
        (item) => Number(item.remainingBalance || 0) > 0
      );

      setSales(unpaidSales);
    } catch (error) {
      toast.error(error.message || "Failed to load invoices.");
      setSales([]);
    } finally {
      setLoadingSales(false);
    }
  }

  const saleOptions = useMemo(
    () => [
      { value: "", label: "Select invoice" },
      ...sales.map((item) => ({
        value: item._id,
        label: `${item.invoiceNumber} - Remaining ${money(
          item.remainingBalance
        )}`,
      })),
    ],
    [sales]
  );

  const selectedSale = sales.find((item) => item._id === sale);

  async function handleSubmit() {
    if (!customer) {
      return toast.error("Please select a customer.");
    }

    if (!sale) {
      return toast.error("Please select an unpaid invoice.");
    }

    if (Number(amount) <= 0) {
      return toast.error("Payment amount must be greater than zero.");
    }

    if (
      selectedSale &&
      Number(amount) > Number(selectedSale.remainingBalance || 0)
    ) {
      return toast.error(
        "Payment amount cannot exceed remaining balance."
      );
    }

    try {
      setSaving(true);

      await createPayment({
        sale,
        amount: Number(amount),
        paymentMethod,
        paymentDate,
        remarks,
      });

      toast.success("Payment recorded successfully.");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to record payment.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Record Payment"
      size="lg"
    >
      <div className="space-y-5">
        <SearchableSelect
          label="Customer"
          placeholder={
            loadingCustomers
              ? "Loading customers..."
              : "Select customer"
          }
          value={customer}
          onChange={setCustomer}
          options={customers}
        />

        <Select
          label="Invoice"
          value={sale}
          onChange={(event) => setSale(event.target.value)}
          options={saleOptions}
          disabled={!customer || loadingSales}
          helperText="Only invoices with remaining balance are shown."
        />

        {customer && !loadingSales && sales.length === 0 && (
          <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
            No unpaid or partial invoices found for this customer.
          </p>
        )}

        {selectedSale && (
          <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm md:grid-cols-3">
            <div>
              <p className="text-xs text-slate-500">Invoice Total</p>
              <p className="font-semibold">
                {money(selectedSale.grandTotal)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Already Paid</p>
              <p className="font-semibold text-emerald-600">
                {money(selectedSale.paidAmount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Remaining</p>
              <p className="font-semibold text-red-600">
                {money(selectedSale.remainingBalance)}
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Payment Amount"
            type="number"
            min="1"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />

          <Select
            label="Payment Method"
            value={paymentMethod}
            onChange={(event) =>
              setPaymentMethod(event.target.value)
            }
            options={PAYMENT_METHODS}
          />

          <Input
            label="Payment Date"
            type="date"
            value={paymentDate}
            onChange={(event) =>
              setPaymentDate(event.target.value)
            }
          />

          <Input
            label="Remarks / Reference"
            value={remarks}
            maxLength={300}
            onChange={(event) => setRemarks(event.target.value)}
            placeholder="Optional"
          />
        </div>

        <div className="flex justify-end gap-3 border-t pt-4">
          <Button
            variant="secondary"
            disabled={saving}
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button loading={saving} onClick={handleSubmit}>
            Save Payment
          </Button>
        </div>
      </div>
    </Modal>
  );
}
