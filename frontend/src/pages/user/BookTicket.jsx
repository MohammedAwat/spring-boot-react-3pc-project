import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../config/api";
import SeatPicker from "../../components/SeatPicker";
import LoadingSpinner from "../../components/LoadingSpinner";
import AlertMessage from "../../components/AlertMessage";
import { demoShowtimes } from "../../data/demoData";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initForm = { name: "", email: "", phone: "" };
const initErrors = { name: "", email: "", phone: "", seats: "" };

export default function BookTicket() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();

  const [showtime, setShowtime]       = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [form, setForm]               = useState(initForm);
  const [errors, setErrors]           = useState(initErrors);
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [alert, setAlert]             = useState({ type: "", message: "" });
  const [pageError, setPageError]     = useState("");

  useEffect(() => {
    Promise.all([
      api.get(`/showtimes/${showtimeId}`).catch(() => null),
      api.get(`/tickets/showtime/${showtimeId}`).catch(() => ({ data: [] })),
    ])
      .then(([stRes, tkRes]) => {
        if (stRes) {
          setShowtime(stRes.data);
        } else {
          // Backend unreachable — find showtime from demo data
          const found = demoShowtimes.find((s) => String(s.id) === String(showtimeId));
          if (found) setShowtime(found);
        }
        const seats = Array.isArray(tkRes.data)
          ? tkRes.data.map((t) => t.seatNumber || t.seat)
          : [];
        setBookedSeats(seats.filter(Boolean));
      })
      .catch((err) => setPageError(err.message))
      .finally(() => setLoading(false));
  }, [showtimeId]);

  const toggleSeat = (id) => {
    setSelectedSeats((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
    setErrors((e) => ({ ...e, seats: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  };

  const validate = () => {
    const errs = { ...initErrors };
    let valid = true;

    if (!form.name.trim()) { errs.name = "Full name is required."; valid = false; }
    if (!form.email.trim()) { errs.email = "Email is required."; valid = false; }
    else if (!EMAIL_RE.test(form.email)) { errs.email = "Enter a valid email address."; valid = false; }
    if (!form.phone.trim()) { errs.phone = "Phone number is required."; valid = false; }
    if (selectedSeats.length === 0) { errs.seats = "Please select at least one seat."; valid = false; }

    // Check for already-booked seats (should not happen via UI but guard anyway)
    const conflict = selectedSeats.filter((s) => bookedSeats.includes(s));
    if (conflict.length > 0) {
      errs.seats = `Seat(s) ${conflict.join(", ")} are already booked. Please choose different seats.`;
      valid = false;
    }

    setErrors(errs);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setAlert({ type: "", message: "" });

    try {
      await api.post("/tickets", {
        showtimeId: Number(showtimeId),
        customerName: form.name.trim(),
        customerEmail: form.email.trim(),
        customerPhone: form.phone.trim(),
        seats: selectedSeats,
      });
      setAlert({ type: "success", message: `Booking confirmed! Seats: ${selectedSeats.join(", ")}` });
      setSelectedSeats([]);
      setForm(initForm);
      // Mark seats as booked locally
      setBookedSeats((prev) => [...prev, ...selectedSeats]);
      // Redirect after 2 s
      setTimeout(() => navigate("/"), 2500);
    } catch (err) {
      setAlert({ type: "danger", message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)    return <div className="page-wrapper"><LoadingSpinner text="Loading showtime…" /></div>;
  if (pageError)  return <div className="page-wrapper container"><AlertMessage type="danger" message={pageError} /></div>;

  return (
    <div className="page-wrapper">
      <div className="container fade-in">
        <Link to="/" className="btn-outline-cyan btn mb-4 d-inline-flex align-items-center gap-2">
          <i className="bi bi-arrow-left"></i>Back
        </Link>

        <div className="row g-4">
          {/* Left – Seat Picker */}
          <div className="col-lg-7">
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "1.5rem",
              }}
            >
              <h2 className="section-title">Select Your Seats</h2>
              {showtime && (
                <div className="detail-meta-row mb-3">
                  <span className="meta-pill meta-pill-cyan">
                    <i className="bi bi-calendar me-1"></i>{showtime.date || showtime.showDate}
                  </span>
                  <span className="meta-pill meta-pill-amber">
                    <i className="bi bi-clock me-1"></i>{showtime.time || showtime.showTime}
                  </span>
                  {showtime.hall && (
                    <span className="meta-pill meta-pill-purple">
                      <i className="bi bi-building me-1"></i>{showtime.hall}
                    </span>
                  )}
                </div>
              )}
              <SeatPicker
                bookedSeats={bookedSeats}
                selectedSeats={selectedSeats}
                onToggle={toggleSeat}
              />
              {errors.seats && (
                <div className="mt-2">
                  <AlertMessage type="danger" message={errors.seats} />
                </div>
              )}
            </div>
          </div>

          {/* Right – Booking Form */}
          <div className="col-lg-5">
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "1.5rem",
              }}
            >
              <h2 className="section-title">Your Details</h2>

              {alert.message && (
                <AlertMessage
                  type={alert.type}
                  message={alert.message}
                  onClose={() => setAlert({ type: "", message: "" })}
                />
              )}

              <form onSubmit={handleSubmit} className="cine-form mt-3" noValidate>
                {/* Name */}
                <div className="mb-3">
                  <label htmlFor="book-name" className="form-label">Full Name *</label>
                  <input
                    id="book-name"
                    type="text"
                    name="name"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    placeholder="e.g. John Doe"
                    value={form.name}
                    onChange={handleChange}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="book-email" className="form-label">Email Address *</label>
                  <input
                    id="book-email"
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    placeholder="e.g. john@example.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                {/* Phone */}
                <div className="mb-4">
                  <label htmlFor="book-phone" className="form-label">Phone Number *</label>
                  <input
                    id="book-phone"
                    type="tel"
                    name="phone"
                    className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                    placeholder="e.g. +1 555 000 0000"
                    value={form.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>

                {/* Summary */}
                {selectedSeats.length > 0 && showtime?.price && (
                  <div
                    style={{
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-sm)",
                      padding: "0.85rem 1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div className="d-flex justify-content-between">
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Seats</span>
                      <span style={{ color: "var(--cyan)", fontFamily: "var(--font-display)", fontSize: "0.85rem" }}>
                        {selectedSeats.length} × ${showtime.price}
                      </span>
                    </div>
                    <hr className="divider-glow my-2" />
                    <div className="d-flex justify-content-between">
                      <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Total</span>
                      <span style={{ color: "var(--amber)", fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700 }}>
                        ${(selectedSeats.length * showtime.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  id="book-submit-btn"
                  className="btn-cyan btn w-100 d-flex align-items-center justify-content-center gap-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      Processing…
                    </>
                  ) : (
                    <>
                      <i className="bi bi-ticket-perforated-fill"></i>
                      Confirm Booking
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
