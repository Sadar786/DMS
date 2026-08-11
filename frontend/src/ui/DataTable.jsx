export default function DataTable({
  columns,
  data,
  loading = false,
  emptyMessage = "No data found.",
  onRowClick,
  getRowClassName,
}) {
  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full">
        <thead className="bg-slate-100">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-10 text-center text-slate-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row._id}
                onClick={() => onRowClick?.(row)}
                className={[
                  "border-b border-slate-100 hover:bg-slate-50",
                  onRowClick ? "cursor-pointer" : "",
                  getRowClassName?.(row) || "",
                ].join(" ")}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-3 text-sm text-slate-700"
                  >
                    {column.render
                      ? column.render(row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
