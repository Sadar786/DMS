//src/ui/card/Card.jsx
import clsx from "clsx";

function Card({ children, className, ...props }) {
  return (
    <section
      className={clsx("card-surface", className)}
      {...props}
    >
      {children}
    </section>
  );
}

function CardHeader({ children, className, ...props }) {
  return (
    <div
      className={clsx(
        "flex items-center justify-between border-b border-slate-200 px-5 py-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CardTitle({ children, className, ...props }) {
  return (
    <h2
      className={clsx(
        "text-base font-semibold text-slate-900",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

function CardDescription({ children, className, ...props }) {
  return (
    <p
      className={clsx("mt-1 text-sm text-slate-500", className)}
      {...props}
    >
      {children}
    </p>
  );
}

function CardContent({ children, className, ...props }) {
  return (
    <div className={clsx("p-5", className)} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ children, className, ...props }) {
  return (
    <div
      className={clsx(
        "flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;

export {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};