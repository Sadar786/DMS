import Card from "../../ui/card/Card";

export default function ShortExpiry({
  items = [],
  loading = false,
}) {
  return (
    <Card>
      <div className="p-5">
        <h3 className="font-semibold mb-4">
          Recent Expiry / DeGas
        </h3>

        {loading ? (
          <p className="py-6 text-center text-sm text-slate-400">
            Loading records...
          </p>
        ) : items.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">
            No expiry records.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item._id}
              className="flex justify-between gap-3 py-2 border-b last:border-0"
            >
              <div>
                <p className="font-medium text-slate-800">
                  {item.product?.name || "Unknown Product"}
                </p>
                <p className="text-xs text-slate-400">
                  Qty: {item.quantity} {item.product?.unit || ""}
                </p>
              </div>

              <span className="text-orange-500">
                {item.reason}
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
