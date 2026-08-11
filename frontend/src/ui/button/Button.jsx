import { forwardRef } from "react";
import { FaSpinner } from "react-icons/fa6";
import clsx from "clsx";

const variants = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-100",
  secondary:
    "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-200",
  outline:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-200",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-200",
  danger:
    "bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-100",
  success:
    "bg-success-600 text-white hover:bg-success-700 focus:ring-success-100",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

const Button = forwardRef(
  (
    {
      children,
      type = "button",
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-control font-semibold transition",
          "focus:outline-none focus:ring-4",
          "disabled:cursor-not-allowed disabled:opacity-60",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {loading ? (
          <FaSpinner className="animate-spin" aria-hidden="true" />
        ) : (
          leftIcon
        )}

        <span>{children}</span>

        {!loading && rightIcon}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;