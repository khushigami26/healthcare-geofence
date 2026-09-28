import { useEffect } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import ActionButton from "./ActionButton";

function ConfirmDialog({
  open,
  title = "Confirm delete",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !loading) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, loading, onCancel]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="confirm-dialog-overlay"
      role="presentation"
      onClick={() => {
        if (!loading) {
          onCancel();
        }
      }}
    >
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        onClick={(event) => event.stopPropagation()}
      >
        <ActionButton
          variant="ghost"
          size="icon"
          icon={X}
          className="confirm-dialog-close"
          onClick={onCancel}
          disabled={loading}
          aria-label="Close"
        />

        <div className="confirm-dialog-icon">
          <AlertTriangle size={26} />
        </div>

        <h3 id="confirm-dialog-title">{title}</h3>

        <p id="confirm-dialog-message">{message}</p>

        <div className="confirm-dialog-actions">
          <ActionButton
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </ActionButton>

          <ActionButton
            variant="danger"
            icon={Trash2}
            loading={loading}
            className="confirm-dialog-delete"
            onClick={onConfirm}
          >
            {confirmLabel}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
