/**
 * AlertMessage
 * Props:
 *  type    – "success" | "danger" | "info"
 *  message – string
 *  onClose – () => void  (optional — shows × button if provided)
 */
export default function AlertMessage({ type = "info", message, onClose }) {
  if (!message) return null;
  const cls = `cine-alert cine-alert-${type} d-flex align-items-start gap-2 fade-in`;
  const icon =
    type === "success" ? "bi-check-circle-fill"
    : type === "danger" ? "bi-exclamation-triangle-fill"
    : "bi-info-circle-fill";

  return (
    <div className={cls} role="alert">
      <i className={`bi ${icon} flex-shrink-0 mt-1`}></i>
      <span className="flex-grow-1">{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "inherit",
            cursor: "pointer",
            padding: 0,
            lineHeight: 1,
            opacity: 0.7,
          }}
          aria-label="Dismiss"
        >
          <i className="bi bi-x-lg"></i>
        </button>
      )}
    </div>
  );
}
