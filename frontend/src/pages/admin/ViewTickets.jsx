import { useState, useEffect } from "react";
import api from "../../config/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import AlertMessage from "../../components/AlertMessage";

export default function ViewTickets() {
  const [tickets, setTickets]   = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [search, setSearch]     = useState("");

  useEffect(() => {
    api.get("/tickets")
      .then((r) => {
        const data = Array.isArray(r.data) ? r.data : r.data?.content ?? [];
        setTickets(data);
        setFiltered(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase().trim();
    setFiltered(
      q
        ? tickets.filter(
            (t) =>
              t.customerName?.toLowerCase().includes(q) ||
              t.customerEmail?.toLowerCase().includes(q) ||
              t.movieTitle?.toLowerCase().includes(q) ||
              String(t.id).includes(q)
          )
        : tickets
    );
  }, [search, tickets]);

  const statusColor = (status) => {
    if (!status) return "var(--text-muted)";
    const s = status.toLowerCase();
    if (s === "confirmed" || s === "paid") return "var(--green-ok)";
    if (s === "cancelled") return "var(--red-danger)";
    return "var(--cyan)";
  };

  const stats = [
    {
      label: "Total Tickets",
      value: tickets.length,
      icon: "bi-ticket-perforated-fill",
      color: "var(--cyan)",
    },
    {
      label: "Confirmed",
      value: tickets.filter(
        (t) => t.status?.toLowerCase() === "confirmed" || t.status?.toLowerCase() === "paid"
      ).length,
      icon: "bi-check-circle-fill",
      color: "var(--green-ok)",
    },
    {
      label: "Cancelled",
      value: tickets.filter((t) => t.status?.toLowerCase() === "cancelled").length,
      icon: "bi-x-circle-fill",
      color: "var(--red-danger)",
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="container fade-in">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
          <h1 className="section-title mb-0">
            <i className="bi bi-ticket-perforated me-2"></i>View Tickets
          </h1>
          <div className="search-wrapper">
            <i className="bi bi-search search-icon"></i>
            <input
              id="ticket-search"
              type="text"
              className="form-control"
              placeholder="Search by name, email or movie…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search tickets"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-4">
          {stats.map((s) => (
            <div className="col-sm-4" key={s.label}>
              <div className="stat-card">
                <i
                  className={`bi ${s.icon} stat-card__icon`}
                  style={{ color: s.color }}
                ></i>
                <div>
                  <div
                    className="stat-card__value"
                    style={{ color: s.color }}
                  >
                    {s.value}
                  </div>
                  <div className="stat-card__label">{s.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <AlertMessage type="danger" message={error} />
        )}
        {loading && <LoadingSpinner />}

        {!loading && !error && (
          <div className="table-responsive cine-table">
            <table className="table table-borderless table-hover mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Movie</th>
                  <th>Showtime</th>
                  <th>Seats</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center py-5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      No tickets found.
                    </td>
                  </tr>
                )}
                {filtered.map((t, i) => (
                  <tr key={t.id}>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                      {i + 1}
                    </td>
                    <td
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.78rem",
                        color: "var(--cyan)",
                        fontWeight: 600,
                      }}
                    >
                      #{String(t.id).padStart(5, "0")}
                    </td>
                    <td style={{ fontWeight: 600 }}>{t.customerName || "—"}</td>
                    <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                      {t.customerEmail || "—"}
                    </td>
                    <td>{t.movieTitle || "—"}</td>
                    <td style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                      {t.showDate || t.date || "—"} {t.showTime || t.time || ""}
                    </td>
                    <td style={{ fontSize: "0.85rem" }}>
                      {Array.isArray(t.seats)
                        ? t.seats.join(", ")
                        : t.seatNumber || t.seat || "—"}
                    </td>
                    <td style={{ color: "var(--cyan)", fontWeight: 600 }}>
                      {t.totalPrice != null
                        ? `$${t.totalPrice}`
                        : t.price != null
                        ? `$${t.price}`
                        : "—"}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: statusColor(t.status),
                          border: `1px solid ${statusColor(t.status)}`,
                          borderRadius: "100px",
                          padding: "0.18rem 0.65rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          background: "transparent",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {t.status || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
