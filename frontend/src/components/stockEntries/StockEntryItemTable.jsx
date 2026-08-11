import { Button, Input } from "../../ui";
import SearchableSelect from "../common/SearchableSelect";

export default function StockEntryItemTable({
  items,
  products,
  onAdd,
  onRemove,
  onChange,
}) {
  return (
    <div className="space-y-4">

      {items.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-12 gap-3"
        >
          <div className="col-span-5">
            <SearchableSelect
              placeholder="Product"
              value={item.product}
              options={products}
              onChange={(value) =>
                onChange(index, "product", value)
              }
            />
          </div>

          <div className="col-span-2">
            <Input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                onChange(
                  index,
                  "quantity",
                  Number(e.target.value)
                )
              }
            />
          </div>

          <div className="col-span-3">
            <Input
              type="number"
              value={item.costPrice}
              onChange={(e) =>
                onChange(
                  index,
                  "costPrice",
                  Number(e.target.value)
                )
              }
            />
          </div>

          <div className="col-span-2 flex gap-2">
            <Button onClick={onAdd}>
              +
            </Button>

            {items.length > 1 && (
              <Button
                variant="danger"
                onClick={() => onRemove(index)}
              >
                -
              </Button>
            )}
          </div>
        </div>
      ))}

    </div>
  );
}