import { FaPlus, FaTrash } from "react-icons/fa6";

import { Button, Input } from "../../ui";
import SearchableSelect from "../common/SearchableSelect";

export default function SaleItemTable({
  items,
  products,
  onAdd,
  onRemove,
  onChange,
}) {
  return (
    <div className="space-y-4">

      <div className="flex justify-end">
        <Button onClick={onAdd}>
          <FaPlus />
          Add Product
        </Button>
      </div>

      <table className="w-full border-collapse">

        <thead>

          <tr className="border-b bg-slate-100">

            <th className="p-3 text-left">
              Product
            </th>

            <th className="w-28 p-3">
              Qty
            </th>

            <th className="w-36 p-3">
              Price
            </th>

            <th className="w-36 p-3">
              Total
            </th>

            <th className="w-20 p-3">
            </th>

          </tr>

        </thead>

        <tbody>

          {items.map((item, index) => (

            <tr key={index} className="border-b">

              <td className="p-2">

                <SearchableSelect
                  placeholder="Select Product"
                  value={item.product}
                  options={products}
                  onChange={(value) =>
                    onChange(index, "product", value)
                  }
                />

              </td>

              <td className="p-2">

                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    onChange(
                      index,
                      "quantity",
                      Number(e.target.value)
                    )
                  }
                />

              </td>

              <td className="p-2">

                <Input
                  type="number"
                  value={item.sellingPrice}
                  onChange={(e) =>
                    onChange(
                      index,
                      "sellingPrice",
                      Number(e.target.value)
                    )
                  }
                />

              </td>

              <td className="text-center font-semibold">

                Rs {(Number(item.quantity || 0) * Number(item.sellingPrice || 0)).toLocaleString()}

              </td>

              <td>

                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="text-red-600"
                >
                  <FaTrash />
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}
