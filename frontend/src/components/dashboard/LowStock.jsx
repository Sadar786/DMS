import Card from "../../ui/card/Card";

export default function LowStock({
  items = [],
  loading = false,
}) {
  return (
    <Card>
      <div className="p-5">
        <h3 className="font-semibold mb-4">
          Low Stock
        </h3>

        {loading ? (
          <p className="py-6 text-center text-sm text-slate-400">
            Loading stock...
          </p>
        ) : items.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">
            No low stock products.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item._id || item.sku}
              className="flex justify-between gap-3 py-2 border-b last:border-0"
            >
              <div>
                <p className="font-medium text-slate-800">
                  {item.name}
                </p>
                <p className="text-xs text-slate-400">
                  Min: {item.minimumStock} {item.unit}
                </p>
              </div>

              <span className="font-semibold text-red-600">
                {item.currentStock}
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
