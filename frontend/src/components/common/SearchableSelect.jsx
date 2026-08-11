import { useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";

export default function SearchableSelect({
  label,
  placeholder = "Search...",
  options = [],
  value,
  onChange,
  error,
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    return options.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const selected = options.find((x) => x.value === value);

  return (
    <div className="relative">
      {label && (
        <label className="mb-2 block text-sm font-medium">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2"
      >
        <span>
          {selected?.label || placeholder}
        </span>

        <FaChevronDown />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border bg-white shadow-lg">
          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder={placeholder}
            className="w-full border-b p-3 outline-none"
          />

          <div className="max-h-60 overflow-y-auto">
            {filtered.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  onChange(item.value);
                  setOpen(false);
                  setSearch("");
                }}
                className="block w-full px-4 py-2 text-left hover:bg-slate-100"
              >
                {item.label}
              </button>
            ))}

            {!filtered.length && (
              <p className="p-3 text-center text-slate-500">
                No data found
              </p>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}