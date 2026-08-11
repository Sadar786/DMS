import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import Modal from "../../ui/Modal";
import { Button, Input } from "../../ui";

import SearchableSelect from "../common/SearchableSelect";
import StockEntryItemTable from "./StockEntryItemTable";

import { getProducts } from "../../services/productService";
import { createStockEntry } from "../../services/stockEntryService";

export default function StockEntryModal({ open, onClose }) {
  const [supplier, setSupplier] = useState("");

  const [products, setProducts] = useState([]);

  const [items, setItems] = useState([
    {
      product: "",
      quantity: 1,
      costPrice: 0,
    },
  ]);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const response = await getProducts("?limit=1000&isActive=true");

      setProducts(
        response.data.products.map((p) => ({
          value: p._id,
          label: p.name,
          price: p.costPrice,
        })),
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
        costPrice: 0,
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
      const selected = products.find((p) => p.value === value);

      if (selected) {
        updated[index].costPrice = selected.price;
      }
    }

    setItems(updated);
  }

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity * item.costPrice, 0);
  }, [items]);

  return (
    <Modal open={open} onClose={onClose} title="New Stock Entry" size="xl">
      <div className="space-y-6">
        <Input
          label="Supplier"
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
        />

        <StockEntryItemTable
          items={items}
          products={products}
          onAdd={addItem}
          onRemove={removeItem}
          onChange={updateItem}
        />

        <Input label="Total Amount" value={totalAmount} disabled />

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            onClick={async () => {
              if (!items.length) {
                toast.error("Add at least one product.");
                return;
              }

              const invalidItem = items.find(
                (item) =>
                  !item.product ||
                  Number(item.quantity) <= 0 ||
                  Number(item.costPrice) < 0,
              );

              if (invalidItem) {
                toast.error("Please complete all product items.");
                return;
              }

              try {
                await createStockEntry({
                  supplier: supplier.trim(),
                  items: items.map((item) => ({
                    product: item.product,
                    quantity: Number(item.quantity),
                    costPrice: Number(item.costPrice),
                  })),
                });

                toast.success("Stock entry created successfully.");

                onClose();
              } catch (error) {
                toast.error(error.message);
              }
            }}
          >
            Save Stock Entry
          </Button>
        </div>
      </div>
    </Modal>
  );
}
