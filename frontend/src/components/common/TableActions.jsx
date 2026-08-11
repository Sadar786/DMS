import { FaPen, FaTrash, FaEye } from "react-icons/fa6";

export default function TableActions({
  onView,
  onEdit,
  onDelete,
}) {
  const handleAction = (event, action) => {
    event.stopPropagation();
    action?.();
  };

  return (
    <div className="flex items-center justify-center gap-2">

      <button
        type="button"
        onClick={(event) => handleAction(event, onView)}
        className="text-blue-600"
      
      >  <FaEye /> </button>
      <button
        type="button"
        onClick={(event) => handleAction(event, onEdit)}
        className="rounded-lg p-2 text-primary-600 transition hover:bg-primary-50"
      >
        <FaPen size={14} />
      </button>

      <button
        type="button"
        onClick={(event) => handleAction(event, onDelete)}
        className="rounded-lg p-2 text-danger-600 transition hover:bg-danger-50"
      >
        <FaTrash size={14} />
      </button>

    </div>
  );
}
