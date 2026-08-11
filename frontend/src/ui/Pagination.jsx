import Button from "./button";

export default function Pagination({
  page = 1,
  pages = 1,
  total = 0,
  onPageChange,
}) {
  if (pages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-between">
      <p className="text-sm text-slate-500">
        Total Records: <strong>{total}</strong>
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>

        <span className="rounded-lg border border-slate-200 px-4 py-2 text-sm">
          {page} / {pages}
        </span>

        <Button
          variant="outline"
          disabled={page === pages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}