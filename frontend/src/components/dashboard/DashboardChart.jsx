import Card from "../../ui/card/Card";

const money = (value = 0) =>
  `Rs ${Number(value || 0).toLocaleString()}`;

export default function DashboardChart({
  data = [],
  loading = false,
}) {
  const maxValue = Math.max(
    ...data.map((item) => item.total || 0),
    1
  );

  return (
    <Card className="h-80 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">
            Sales Statistics
          </h3>
          <p className="text-sm text-slate-500">
            Last 7 days completed sales
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex h-56 items-center justify-center text-slate-400">
          Loading chart...
        </div>
      ) : (
        <div className="flex h-56 items-end gap-3">
          {data.map((item) => {
            const height = Math.max(
              (item.total / maxValue) * 100,
              item.total > 0 ? 8 : 2
            );

            return (
              <div
                key={item.date}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div className="flex h-40 w-full items-end rounded-lg bg-slate-100 px-2">
                  <div
                    className="w-full rounded-t-lg bg-blue-500 transition-all"
                    style={{ height: `${height}%` }}
                    title={money(item.total)}
                  />
                </div>

                <div className="text-center">
                  <p className="text-xs font-medium text-slate-700">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {item.invoices} inv
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
