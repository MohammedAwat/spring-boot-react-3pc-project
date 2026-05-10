import { useState, useEffect, useMemo } from "react";
import api from "../../config/api";
import MovieCard from "../../components/MovieCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import AlertMessage from "../../components/AlertMessage";
import { demoMovies } from "../../data/demoData";

export default function Home() {
  const [movies, setMovies]         = useState([]);
  const [search, setSearch]         = useState("");
  const [activeGenre, setActiveGenre] = useState("");
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [isDemo, setIsDemo]         = useState(false);

  /* ── Fetch ─────────────────────────────────────────────────── */
  useEffect(() => {
    api.get("/movies")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.content ?? [];
        setMovies(data);
        setIsDemo(false);
      })
      .catch(() => {
        setMovies(demoMovies);
        setIsDemo(true);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ── Derived state ──────────────────────────────────────────── */
  const genres = useMemo(() => {
    const g = [...new Set(movies.map((m) => m.genre).filter(Boolean))].sort();
    return g;
  }, [movies]);

  const filtered = useMemo(() => {
    let result = movies;
    if (activeGenre) result = result.filter((m) => m.genre === activeGenre);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.title?.toLowerCase().includes(q) ||
          m.genre?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [movies, activeGenre, search]);

  const posterBg = isDemo ? demoMovies : movies.slice(0, 8);

  return (
    <>
      {/* ══════════════════════════════════════════
          HERO — Poster Mosaic
      ══════════════════════════════════════════ */}
      <div className="hero-banner">
        {/* Poster tiles */}
        <div className="hero-poster-bg" aria-hidden="true">
          {posterBg.map((m) => (
            <div
              key={m.id}
              className="hero-poster-item"
              style={{
                backgroundImage: `url(${m.posterUrl || m.poster_url || ""})`,
              }}
            />
          ))}
        </div>

        {/* Dark overlay */}
        <div className="hero-overlay" aria-hidden="true" />

        {/* Ambient colour bloom */}
        <div className="hero-glow-overlay" aria-hidden="true" />

        {/* Content */}
        <div className="hero-content">
          <div className="container text-center">
            {/* Eyebrow */}
            <div className="hero-eyebrow">Now Showing</div>

            {/* Headline */}
            <h1 className="display-title">
              The Ultimate <span>Cinema</span>
              <br />Experience
            </h1>

            {/* Sub */}
            <p className="hero-sub">
              Browse the latest films, choose your seats, and book tickets —
              all in one place.
            </p>

            {/* Search */}
            <div className="search-wrapper mx-auto">
              <i className="bi bi-search search-icon"></i>
              <input
                id="movie-search"
                type="text"
                className="form-control"
                placeholder="Search by title or genre…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setActiveGenre(""); }}
                aria-label="Search movies"
              />
            </div>

            {/* Stats strip */}
            {!loading && (
              <div className="hero-stats">
                <div>
                  <span className="hero-stat__value">{movies.length}</span>
                  <span className="hero-stat__label">Movies</span>
                </div>
                <div>
                  <span className="hero-stat__value">{genres.length}</span>
                  <span className="hero-stat__label">Genres</span>
                </div>
                <div>
                  <span className="hero-stat__value">
                    {movies.length > 0
                      ? Math.max(...movies.map((m) => m.rating || 0)).toFixed(1)
                      : "—"}
                  </span>
                  <span className="hero-stat__label">Top Rating</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MOVIES SECTION
      ══════════════════════════════════════════ */}
      <div className="page-wrapper">
        <div className="container fade-in">

          {/* Demo notice */}
          {isDemo && !loading && (
            <AlertMessage
              type="info"
              message="Demo Mode — Backend not connected. Showing sample data. Set your server IP in src/config/api.js."
            />
          )}

          {error && (
            <AlertMessage
              type="danger"
              message={error}
              onClose={() => setError("")}
            />
          )}

          {/* Section header */}
          <div className="movies-section-header mt-4">
            <div>
              <h2 className="section-title mb-2">
                {activeGenre ? activeGenre : search ? `Results for "${search}"` : "All Movies"}
              </h2>

              {/* Genre filter pills */}
              {!loading && genres.length > 0 && (
                <div className="genre-filters">
                  <button
                    className={`genre-filter-btn ${!activeGenre ? "active" : ""}`}
                    onClick={() => setActiveGenre("")}
                  >
                    All
                  </button>
                  {genres.map((g) => (
                    <button
                      key={g}
                      className={`genre-filter-btn ${activeGenre === g ? "active" : ""}`}
                      onClick={() => { setActiveGenre(g); setSearch(""); }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="movies-count-badge">
              {filtered.length} {filtered.length === 1 ? "Title" : "Titles"}
            </span>
          </div>

          {/* Loading */}
          {loading && <LoadingSpinner text="Fetching movies…" />}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-state__icon">
                <i className="bi bi-film"></i>
              </div>
              <p className="empty-state__title">No movies found</p>
              <p className="empty-state__sub">Try adjusting your search or filter</p>
            </div>
          )}

          {/* Movie grid */}
          <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-xl-5 g-3 mt-1">
            {filtered.map((movie) => (
              <div className="col" key={movie.id}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
