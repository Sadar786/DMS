import clsx from "clsx";

const variants = {
  default: "bg-slate-100 text-slate-700",
  primary: "bg-primary-100 text-primary-700",
  success: "bg-success-100 text-success-700",
  warning: "bg-warning-100 text-warning-700",
  danger: "bg-danger-100 text-danger-700",
};

const sizes = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
};

function Badge({
  children,
  variant = "default",
  size = "md",
  dot = false,
  className,
  ...props
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className="h-1.5 w-1.5 rounded-full bg-current"
          aria-hidden="true"
        />
      )}

      {children}
    </span>
  );
}

export default Badge;