const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * SeatPicker – Visual 10×10 seat grid.
 *
 * Props:
 *  bookedSeats  – string[]  e.g. ["A1","B3"] from the server
 *  selectedSeats – string[] controlled state from parent
 *  onToggle     – (seatId: string) => void
 */
export default function SeatPicker({ bookedSeats = [], selectedSeats = [], onToggle }) {
  const isBooked   = (id) => bookedSeats.includes(id);
  const isSelected = (id) => selectedSeats.includes(id);

  return (
    <div>
      {/* Screen indicator */}
      <p className="text-center mb-2" style={{ fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
        ▼ Screen ▼
      </p>
      <div className="seat-screen mb-3"></div>

      {/* Grid */}
      <div className="seat-grid mb-3">
        {ROWS.map((row) => (
          <div className="seat-row" key={row}>
            <span className="seat-row-label">{row}</span>
            {COLS.map((col) => {
              const id = `${row}${col}`;
              const booked   = isBooked(id);
              const selected = isSelected(id);
              return (
                <button
                  key={id}
                  type="button"
                  className={`seat ${booked ? "seat-booked" : ""} ${selected ? "seat-selected" : ""}`}
                  disabled={booked}
                  onClick={() => !booked && onToggle(id)}
                  title={booked ? `Seat ${id} — Booked` : `Seat ${id}`}
                  aria-label={`Seat ${id}${booked ? " (booked)" : selected ? " (selected)" : ""}`}
                >
                  {col}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="seat-legend mt-2">
        <div className="legend-item">
          <div className="legend-box" style={{ background: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}></div>
          Available
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: "var(--cyan)", borderColor: "var(--cyan)" }}></div>
          Selected
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: "rgba(255,56,96,0.12)", borderColor: "rgba(255,56,96,0.3)" }}></div>
          Booked
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="mt-3 text-center">
          <small style={{ color: "var(--cyan)", fontFamily: "var(--font-display)", fontSize: "0.78rem", letterSpacing: "0.08em" }}>
            SELECTED: {selectedSeats.join(", ")}
          </small>
        </div>
      )}
    </div>
  );
}
