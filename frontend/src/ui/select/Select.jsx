import clsx from "clsx";
import { forwardRef, useId } from "react";

const Select = forwardRef(
  (
    {
      label,
      options = [],
      error,
      className,
      selectClassName,
      id,
      required = false,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className={clsx("w-full", className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            {label}
            {required && (
              <span className="ml-1 text-red-600">*</span>
            )}
          </label>
        )}

        <select
          ref={ref}
          id={inputId}
          className={clsx(
            "h-10 w-full rounded-control border border-slate-300 bg-white px-3 text-sm",
            "focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none",
            selectClassName
          )}
          {...props}
        >
          {options.map((item) => (
            <option
              key={item.value}
              value={item.value}
            >
              {item.label}
            </option>
          ))}
        </select>

        {error && (
          <p className="mt-1 text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;