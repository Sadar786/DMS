import { useEffect } from "react";
import { FaXmark } from "react-icons/fa6";

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
}) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    // Prevent background page scrolling
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-5xl",
    "2xl": "max-w-7xl",
  };

  function handleBackdropClick(e) {
    // Only close if the actual backdrop was clicked
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={handleBackdropClick}
    >
      <div
        className={`relative flex max-h-[90vh] w-full ${sizeClasses[size] || sizeClasses.md} flex-col overflow-hidden rounded-xl bg-white shadow-xl`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-800">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            aria-label="Close modal"
          >
            <FaXmark />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {children}
        </div>
      </div>
    </div>
  );
}