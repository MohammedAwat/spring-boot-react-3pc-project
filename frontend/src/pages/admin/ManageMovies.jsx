import { useState, useEffect, useRef } from "react";
import api from "../../config/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import AlertMessage from "../../components/AlertMessage";

const EMPTY = {
  title: "", genre: "", duration: "", language: "",
  rating: "", releaseDate: "", posterUrl: "", description: "",
};

export default function ManageMovies() {
  const [movies, setMovies]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert]     = useState({ type: "", message: "" });
  const [form, setForm]       = useState(EMPTY);
  const [errors, setErrors]   = useState({});
  const [editId, setEditId]   = useState(null);
  const [saving, setSaving]   = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const modalRef = useRef(null);

  const fetchMovies = () => {
    setLoading(true);
    api.get("/movies")
      .then((r) => setMovies(Array.isArray(r.data) ? r.data : r.data?.content ?? []))
      .catch((e) => showAlert("danger", e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMovies(); }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 4000);
  };

  const openModal = (movie = null) => {
    setErrors({});
    if (movie) {
      setEditId(movie.id);
      setForm({
        title: movie.title || "", genre: movie.genre || "",
        duration: movie.duration || "", language: movie.language || "",
        rating: movie.rating || "", releaseDate: movie.releaseDate || "",
        posterUrl: movie.posterUrl || movie.poster_url || "",
        description: movie.description || movie.synopsis || "",
      });
    } else {
      setEditId(null);
      setForm(EMPTY);
    }
    const m = window.bootstrap?.Modal.getOrCreateInstance(modalRef.current);
    m?.show();
  };

  const closeModal = () => {
    const m = window.bootstrap?.Modal.getInstance(modalRef.current);
    m?.hide();
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())    e.title    = "Title is required.";
    if (!form.genre.trim())    e.genre    = "Genre is required.";
    if (!form.duration)        e.duration = "Duration is required.";
    else if (isNaN(form.duration) || Number(form.duration) <= 0) e.duration = "Must be a positive number.";
    if (form.rating && (isNaN(form.rating) || form.rating < 0 || form.rating > 10))
      e.rating = "Rating must be between 0 and 10.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload = {
      ...form,
      duration: Number(form.duration),
      rating: form.rating ? Number(form.rating) : undefined,
    };
    try {
      if (editId) {
        await api.put(`/movies/${editId}`, payload);
        showAlert("success", "Movie updated successfully.");
      } else {
        await api.post("/movies", payload);
        showAlert("success", "Movie added successfully.");
      }
      fetchMovies();
      closeModal();
    } catch (err) {
      showAlert("danger", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/movies/${deleteId}`);
      showAlert("success", "Movie deleted.");
      fetchMovies();
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

  return (
    <div className="page-wrapper">
      <div className="container fade-in">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
          <h1 className="section-title mb-0"><i className="bi bi-camera-reels me-2"></i>Manage Movies</h1>
          <button id="add-movie-btn" className="btn-cyan btn d-inline-flex align-items-center gap-2" onClick={() => openModal()}>
            <i className="bi bi-plus-lg"></i>Add Movie
          </button>
        </div>

        {alert.message && <AlertMessage type={alert.type} message={alert.message} onClose={() => setAlert({ type: "", message: "" })} />}
        {loading && <LoadingSpinner />}

        {!loading && (
          <div className="table-responsive cine-table">
            <table className="table table-borderless table-hover mb-0">
              <thead>
                <tr>
                  <th>#</th><th>Title</th><th>Genre</th>
                  <th>Duration</th><th>Rating</th><th>Release</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.length === 0 && (
                  <tr><td colSpan="7" className="text-center py-4" style={{ color: "var(--text-muted)" }}>No movies found.</td></tr>
                )}
                {movies.map((m, i) => (
                  <tr key={m.id}>
                    <td style={{ color: "var(--text-muted)" }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{m.title}</td>
                    <td><span className="genre-badge">{m.genre}</span></td>
                    <td>{m.duration} min</td>
                    <td style={{ color: "var(--amber)" }}>{m.rating ?? "—"}</td>
                    <td>{m.releaseDate || "—"}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn-outline-cyan btn btn-sm" onClick={() => openModal(m)} title="Edit">
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn-danger-glow btn btn-sm"
                          onClick={() => setDeleteId(m.id)}
                          data-bs-toggle="modal"
                          data-bs-target="#deleteMovieModal"
                          title="Delete"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <div className="modal fade" id="movieModal" tabIndex="-1" ref={modalRef} aria-labelledby="movieModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="movieModalLabel">
                {editId ? "Edit Movie" : "Add New Movie"}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form id="movie-form" onSubmit={handleSubmit} className="cine-form" noValidate>
                <div className="row g-3">
                  <div className="col-12">
                    <label htmlFor="m-title" className="form-label">Title *</label>
                    <input id="m-title" type="text" placeholder="Movie title" {...fc("title")} />
                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="m-genre" className="form-label">Genre *</label>
                    <input id="m-genre" type="text" placeholder="e.g. Sci-Fi" {...fc("genre")} />
                    {errors.genre && <div className="invalid-feedback">{errors.genre}</div>}
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="m-duration" className="form-label">Duration (min) *</label>
                    <input id="m-duration" type="number" min="1" placeholder="120" {...fc("duration")} />
                    {errors.duration && <div className="invalid-feedback">{errors.duration}</div>}
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="m-rating" className="form-label">Rating (0-10)</label>
                    <input id="m-rating" type="number" min="0" max="10" step="0.1" placeholder="7.5" {...fc("rating")} />
                    {errors.rating && <div className="invalid-feedback">{errors.rating}</div>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="m-lang" className="form-label">Language</label>
                    <input id="m-lang" type="text" placeholder="e.g. English" {...fc("language")} />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="m-release" className="form-label">Release Date</label>
                    <input id="m-release" type="date" {...fc("releaseDate")} />
                  </div>
                  <div className="col-12">
                    <label htmlFor="m-poster" className="form-label">Poster URL</label>
                    <input id="m-poster" type="url" placeholder="https://…" {...fc("posterUrl")} />
                  </div>
                  <div className="col-12">
                    <label htmlFor="m-desc" className="form-label">Description</label>
                    <textarea id="m-desc" rows="3" placeholder="Movie synopsis…" {...fc("description")}></textarea>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-outline-cyan btn" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" form="movie-form" className="btn-cyan btn d-flex align-items-center gap-2" disabled={saving}>
                {saving ? <><span className="spinner-border spinner-border-sm"></span>Saving…</> : <><i className="bi bi-check-lg"></i>Save</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      <div className="modal fade" id="deleteMovieModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" style={{ color: "var(--red-danger)" }}>
                <i className="bi bi-exclamation-triangle me-2"></i>Confirm Delete
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body" style={{ color: "var(--text-secondary)" }}>
              Are you sure you want to delete this movie? This action cannot be undone.
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-outline-cyan btn" data-bs-dismiss="modal" onClick={() => setDeleteId(null)}>Cancel</button>
              <button
                type="button"
                className="btn-danger-glow btn"
                data-bs-dismiss="modal"
                onClick={handleDelete}
              >
                <i className="bi bi-trash me-1"></i>Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
