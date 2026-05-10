import { useState, useEffect, useRef } from "react";
import api from "../../config/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import AlertMessage from "../../components/AlertMessage";

const EMPTY_FORM = { movieId: "", date: "", time: "", hall: "", price: "", totalSeats: "" };

export default function ManageShowtimes() {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [alert, setAlert]         = useState({ type: "", message: "" });
  const [form, setForm]           = useState(EMPTY_FORM);
  const [errors, setErrors]       = useState({});
  const [saving, setSaving]       = useState(false);
  const [deleteId, setDeleteId]   = useState(null);
  const modalRef = useRef(null);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 4000);
  };

  const fetchAll = () => {
    setLoading(true);
    Promise.all([api.get("/showtimes"), api.get("/movies")])
      .then(([stRes, mRes]) => {
        setShowtimes(Array.isArray(stRes.data) ? stRes.data : stRes.data?.content ?? []);
        setMovies(Array.isArray(mRes.data) ? mRes.data : mRes.data?.content ?? []);
      })
      .catch((e) => showAlert("danger", e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const openModal = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    window.bootstrap?.Modal.getOrCreateInstance(modalRef.current)?.show();
  };

  const validate = () => {
    const e = {};
    if (!form.movieId)   e.movieId = "Please select a movie.";
    if (!form.date)      e.date    = "Date is required.";
    if (!form.time)      e.time    = "Time is required.";
    if (!form.hall.trim()) e.hall  = "Hall is required.";
    if (!form.price)     e.price   = "Price is required.";
    else if (isNaN(form.price) || Number(form.price) < 0) e.price = "Enter a valid price.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await api.post("/showtimes", {
        movieId: Number(form.movieId),
        date: form.date,
        time: form.time,
        hall: form.hall.trim(),
        price: Number(form.price),
        totalSeats: form.totalSeats ? Number(form.totalSeats) : 100,
      });
      showAlert("success", "Showtime added successfully.");
      fetchAll();
      window.bootstrap?.Modal.getInstance(modalRef.current)?.hide();
    } catch (err) {
      showAlert("danger", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/showtimes/${deleteId}`);
      showAlert("success", "Showtime deleted.");
      fetchAll();
    } catch (err) {
      showAlert("danger", err.message);
    } finally {
      setDeleteId(null);
    }
  };

  const fc = (name) => ({
    value: form[name],
    onChange: (e) => { setForm((f) => ({ ...f, [name]: e.target.value })); setErrors((er) => ({ ...er, [name]: "" })); },
    className: `form-control ${errors[name] ? "is-invalid" : ""}`,
  });

  const movieTitle = (id) => movies.find((m) => m.id === id || m.id === Number(id))?.title ?? id;

  return (
    <div className="page-wrapper">
      <div className="container fade-in">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
          <h1 className="section-title mb-0"><i className="bi bi-calendar3 me-2"></i>Manage Showtimes</h1>
          <button id="add-showtime-btn" className="btn-cyan btn d-inline-flex align-items-center gap-2" onClick={openModal}>
            <i className="bi bi-plus-lg"></i>Add Showtime
          </button>
        </div>

        {alert.message && <AlertMessage type={alert.type} message={alert.message} onClose={() => setAlert({ type: "", message: "" })} />}
        {loading && <LoadingSpinner />}

        {!loading && (
          <div className="table-responsive cine-table">
            <table className="table table-borderless table-hover mb-0">
              <thead>
                <tr>
                  <th>#</th><th>Movie</th><th>Date</th><th>Time</th>
                  <th>Hall</th><th>Price</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {showtimes.length === 0 && (
                  <tr><td colSpan="7" className="text-center py-4" style={{ color: "var(--text-muted)" }}>No showtimes found.</td></tr>
                )}
                {showtimes.map((st, i) => (
                  <tr key={st.id}>
                    <td style={{ color: "var(--text-muted)" }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{st.movieTitle || movieTitle(st.movieId)}</td>
                    <td>{st.date || st.showDate}</td>
                    <td>{st.time || st.showTime}</td>
                    <td>{st.hall}</td>
                    <td style={{ color: "var(--amber)" }}>${st.price}</td>
                    <td>
                      <button
                        className="btn-danger-glow btn btn-sm"
                        onClick={() => setDeleteId(st.id)}
                        data-bs-toggle="modal"
                        data-bs-target="#deleteSTModal"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <div className="modal fade" id="showtimeModal" tabIndex="-1" ref={modalRef} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Showtime</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form id="showtime-form" onSubmit={handleSubmit} className="cine-form" noValidate>
                <div className="row g-3">
                  <div className="col-12">
                    <label htmlFor="st-movie" className="form-label">Movie *</label>
                    <select id="st-movie" {...fc("movieId")} style={{ background: "var(--bg-elevated)", color: "var(--text-primary)", border: "1px solid var(--border-subtle)" }}>
                      <option value="">— Select movie —</option>
                      {movies.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
                    </select>
                    {errors.movieId && <div className="invalid-feedback">{errors.movieId}</div>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="st-date" className="form-label">Date *</label>
                    <input id="st-date" type="date" {...fc("date")} />
                    {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="st-time" className="form-label">Time *</label>
                    <input id="st-time" type="time" {...fc("time")} />
                    {errors.time && <div className="invalid-feedback">{errors.time}</div>}
                  </div>
                  <div className="col-md-8">
                    <label htmlFor="st-hall" className="form-label">Hall *</label>
                    <input id="st-hall" type="text" placeholder="e.g. Hall A" {...fc("hall")} />
                    {errors.hall && <div className="invalid-feedback">{errors.hall}</div>}
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="st-price" className="form-label">Price ($) *</label>
                    <input id="st-price" type="number" min="0" step="0.01" placeholder="12.50" {...fc("price")} />
                    {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                  </div>
                  <div className="col-12">
                    <label htmlFor="st-seats" className="form-label">Total Seats</label>
                    <input id="st-seats" type="number" min="1" placeholder="100" {...fc("totalSeats")} />
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-outline-cyan btn" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" form="showtime-form" className="btn-cyan btn" disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirm */}
      <div className="modal fade" id="deleteSTModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" style={{ color: "var(--red-danger)" }}>
                <i className="bi bi-exclamation-triangle me-2"></i>Confirm Delete
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body" style={{ color: "var(--text-secondary)" }}>
              Delete this showtime? Existing ticket data may be affected.
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-outline-cyan btn" data-bs-dismiss="modal" onClick={() => setDeleteId(null)}>Cancel</button>
              <button type="button" className="btn-danger-glow btn" data-bs-dismiss="modal" onClick={handleDelete}>
                <i className="bi bi-trash me-1"></i>Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
