import { Link } from "react-router-dom";
import { usePosterColor } from "../hooks/usePosterColor";

export default function MovieCard({ movie }) {
  const posterUrl =
    movie.posterUrl ||
    movie.poster_url ||
    `https://picsum.photos/seed/${movie.id || movie.title}/400/560`;

  const year = movie.releaseDate ? movie.releaseDate.slice(0, 4) : null;

  /* ── Extract dominant colour from this poster ─────────────── */
  const { r, g, b } = usePosterColor(posterUrl);

  // Derived colour tokens
  const accent       = `rgb(${r},${g},${b})`;
  const accentBg     = `rgba(${r},${g},${b}, 0.12)`;
  const accentBorder = `rgba(${r},${g},${b}, 0.32)`;
  const accentGlow   = `rgba(${r},${g},${b}, 0.38)`;
  const accentFaint  = `rgba(${r},${g},${b}, 0.07)`;

  return (
    <div
      className="movie-card h-100"
      /* Pass colour as CSS custom property so :hover in CSS can use it */
      style={{ "--mc-glow": accentGlow }}
    >
      {/* ── Poster ─────────────────────────────────────────── */}
      <div className="movie-card__poster-wrap">
        <img
          src={posterUrl}
          className="movie-card__poster"
          alt={`${movie.title} poster`}
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://picsum.photos/seed/${encodeURIComponent(
              movie.title
            )}/400/560`;
          }}
        />

        {/* Year badge — top left */}
        {year && <div className="movie-card__year">{year}</div>}

        {/* Rating badge — top right, coloured by poster */}
        {movie.rating && (
          <div
            className="movie-card__rating"
            style={{ color: accent, borderColor: accentBorder }}
          >
            <i className="bi bi-star-fill" style={{ fontSize: "0.6rem" }} />
            {Number(movie.rating).toFixed(1)}
          </div>
        )}

        {/* Hover overlay */}
        <div className="movie-card__overlay">
          <Link
            to={`/movie/${movie.id}`}
            className="movie-card__play"
            aria-label={`View details for ${movie.title}`}
            style={{ borderColor: accent, background: accentBg }}
          >
            <i className="bi bi-play-fill" />
          </Link>
        </div>
      </div>

      {/* ── Info — tinted by poster colour ─────────────────── */}
      <div
        className="movie-card__info"
        style={{
          background: `linear-gradient(160deg, var(--bg-card) 40%, ${accentFaint} 100%)`,
          borderTop: `1px solid ${accentBorder}`,
        }}
      >
        {/* Genre badge + duration */}
        <div className="movie-card__top-row">
          {movie.genre && (
            <span
              className="genre-badge"
              style={{
                background: accentBg,
                color: accent,
                borderColor: accentBorder,
              }}
            >
              {movie.genre}
            </span>
          )}
          {movie.duration && (
            <span
              style={{
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                fontWeight: 500,
                flexShrink: 0,
              }}
            >
              {movie.duration} min
            </span>
          )}
        </div>

        {/* Title */}
        <h5 className="movie-card__title">{movie.title}</h5>

        {/* Meta */}
        <div className="movie-card__meta">
          {movie.language && <span>{movie.language}</span>}
          {movie.language && movie.releaseDate && (
            <div className="movie-card__dot" />
          )}
          {movie.releaseDate && <span>{movie.releaseDate}</span>}
        </div>

        {/* Colour accent bar at the bottom */}
        <div
          style={{
            height: 2,
            marginTop: "auto",
            paddingTop: "0.6rem",
            background: `linear-gradient(to right, ${accentBorder}, transparent)`,
            borderRadius: 1,
          }}
        />
      </div>
    </div>
  );
}
