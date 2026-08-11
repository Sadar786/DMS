import Card from "../../ui/card/Card";

const money = (value = 0) =>
  `Rs ${Number(value || 0).toLocaleString()}`;

export default function RecentSales({
  sales = [],
  loading = false,
}) {
  return (
    <Card>
      <div className="p-5">
        <h3 className="font-semibold mb-4">
          Recent Sales
        </h3>

        {loading ? (
          <p className="py-6 text-center text-sm text-slate-400">
            Loading sales...
          </p>
        ) : sales.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">
            No recent sales.
          </p>
        ) : (
          sales.map((sale) => (
            <div
              key={sale._id}
              className="flex justify-between gap-3 py-2 border-b last:border-0"
            >
              <div>
                <p className="font-medium text-slate-800">
                  {sale.customer?.shopName ||
                    sale.customer?.name ||
                    "Walk-in Customer"}
                </p>
                <p className="text-xs text-slate-400">
                  {sale.invoiceNumber} • {sale.paymentStatus}
                </p>
              </div>

              <strong>{money(sale.grandTotal)}</strong>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
