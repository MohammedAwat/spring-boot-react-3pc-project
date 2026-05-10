import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../config/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import AlertMessage from "../../components/AlertMessage";
import { demoMovies, demoShowtimes } from "../../data/demoData";

function StarRating({ rating }) {
  const stars = Math.round((rating / 10) * 5);
  return (
    <span className="rating-stars">
      {Array.from({ length: 5 }, (_, i) => (
        <i key={i} className={`bi bi-star${i < stars ? "-fill" : ""}`}></i>
      ))}
      <span className="ms-2" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
        {rating} / 10
      </span>
    </span>
  );
}

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie]         = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/movies/${id}`),
      api.get(`/showtimes/${id}`).catch(() => ({ data: [] })),
    ])
      .then(([movieRes, stRes]) => {
        // Real API data available
        setMovie(movieRes.data);
        const times = Array.isArray(stRes.data) ? stRes.data : stRes.data?.content ?? [];
        setShowtimes(times);
      })
      .catch(() => {
        // Backend unreachable — fall back to demo data
        const found = demoMovies.find((m) => String(m.id) === String(id));
        if (found) {
          setMovie(found);
          setShowtimes(demoShowtimes.filter((s) => String(s.movieId) === String(id)));
        } else {
          setError("Movie not found.");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-wrapper"><LoadingSpinner text="Loading movie…" /></div>;
  if (error)   return <div className="page-wrapper container pt-4"><AlertMessage type="danger" message={error} /></div>;
  if (!movie)  return null;

  const posterUrl = movie.posterUrl || movie.poster_url || `https://picsum.photos/seed/${movie.id}/400/560`;

  return (
    <div className="page-wrapper">
      <div className="container fade-in">
        {/* Back */}
        <Link to="/" className="btn-outline-cyan btn mb-4 d-inline-flex align-items-center gap-2">
          <i className="bi bi-arrow-left"></i>Back to Movies
        </Link>

        <div className="row g-5">
          {/* Poster */}
          <div className="col-md-4 col-lg-3">
            <img
              src={posterUrl}
              alt={`${movie.title} poster`}
              className="detail-poster"
              onError={(e) => {
                e.target.src = `https://picsum.photos/seed/${encodeURIComponent(movie.title)}/400/560`;
              }}
            />
          </div>

          {/* Info */}
          <div className="col-md-8 col-lg-9">
            <h1
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                color: "var(--text-primary)",
                letterSpacing: "-0.025em",
                marginBottom: "1.25rem",
                fontWeight: 800,
                lineHeight: 1.15,
              }}
            >
              {movie.title}
            </h1>

            <div className="detail-meta-row">
              {movie.genre      && <span className="meta-pill meta-pill-purple"><i className="bi bi-tag me-1"></i>{movie.genre}</span>}
              {movie.duration   && <span className="meta-pill meta-pill-cyan"><i className="bi bi-clock me-1"></i>{movie.duration} min</span>}
              {movie.language   && <span className="meta-pill meta-pill-amber"><i className="bi bi-translate me-1"></i>{movie.language}</span>}
              {movie.releaseDate && <span className="meta-pill meta-pill-amber"><i className="bi bi-calendar me-1"></i>{movie.releaseDate}</span>}
            </div>

            {movie.rating && (
              <div className="mb-3">
                <StarRating rating={movie.rating} />
              </div>
            )}

            <hr className="divider-glow my-3" />

            <p style={{ color: "var(--text-secondary)", lineHeight: 1.85, fontSize: "0.96rem" }}>
              {movie.description || movie.synopsis || "No description available."}
            </p>

            <hr className="divider-glow my-4" />

            {/* Showtimes */}
            <h2 className="section-title">Available Showtimes</h2>
            {showtimes.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", letterSpacing: "0.05em" }}>
                No showtimes available for this title.
              </p>
            ) : (
              <div className="table-responsive cine-table">
                <table className="table table-borderless table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Hall</th>
                      <th>Price</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showtimes.map((st) => (
                      <tr key={st.id}>
                        <td>{st.date || st.showDate || "—"}</td>
                        <td>{st.time || st.showTime || "—"}</td>
                        <td>{st.hall || st.hallName || "—"}</td>
                        <td style={{ color: "var(--cyan)", fontWeight: 600 }}>
                          {st.price != null ? `$${st.price.toFixed(2)}` : "—"}
                        </td>
                        <td>
                          <Link to={`/book/${st.id}`} className="btn-cyan btn btn-sm">
                            <i className="bi bi-ticket-perforated me-1"></i>Book
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
