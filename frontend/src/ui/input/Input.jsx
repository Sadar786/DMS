//src/ui/Input/Input.js

import { forwardRef, useId } from "react";
import clsx from "clsx";

const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      required = false,
      leftIcon,
      rightIcon,
      className,
      inputClassName,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    return (
      <div className={clsx("w-full", className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            {label}

            {required && (
              <span className="ml-1 text-danger-600" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={clsx(
              "h-10 w-full rounded-control border bg-white px-3 text-sm text-slate-900 outline-none transition",
              "placeholder:text-slate-400",
              "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error
                ? "border-danger-500 focus:border-danger-500 focus:ring-4 focus:ring-danger-100"
                : "border-slate-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100",
              inputClassName,
            )}
            {...props}
          />

          {rightIcon && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              {rightIcon}
            </span>
          )}
        </div>

        {error ? (
          <p id={errorId} className="mt-1.5 text-xs text-danger-600">
            {error}
          </p>
        ) : (
          helperText && (
            <p id={helperId} className="mt-1.5 text-xs text-slate-500">
              {helperText}
            </p>
          )
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;