export default function KpiCard({
  title,
  value,
  icon: Icon,
  color = "bg-primary-500",
  loading = false,
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {loading ? "..." : value}
          </h2>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl text-white ${color}`}
        >
          {Icon && <Icon size={22} />}
        </div>
      </div>
    </div>
  );
}
