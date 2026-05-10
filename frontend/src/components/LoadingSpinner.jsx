export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="spinner-wrapper fade-in">
      <div
        className="spinner-border"
        role="status"
        style={{ width: "2.5rem", height: "2.5rem" }}
      >
        <span className="visually-hidden">Loading…</span>
      </div>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.78rem",
          fontWeight: 600,
          color: "var(--text-muted)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
  );
}
