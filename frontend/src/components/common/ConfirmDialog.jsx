import { Button, Modal } from "../../ui";

export default function ConfirmDialog({
  open,
  title = "Confirm",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
  variant = "danger",
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      size="sm"
    >
      <div className="space-y-6">
        <p className="text-sm text-slate-600">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            {cancelText}
          </Button>

          <Button
            variant={variant}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}