import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";

export default function Navbar({ authUser, onLogin, onLogout }) {
  const navigate               = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const navRef                 = useRef(null);

  const isAdmin = authUser?.role === "admin";
  const isUser  = !!authUser;

  /* ── Mouse-position reactive glow ─────────────────────────── */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onMove = (e) => {
      const rect = nav.getBoundingClientRect();
      const pct  = (((e.clientX - rect.left) / rect.width) * 100).toFixed(1);
      nav.style.setProperty("--nav-x", `${pct}%`);
    };
    const onLeave = () => nav.style.setProperty("--nav-x", "-200%");
    nav.addEventListener("mousemove", onMove, { passive: true });
    nav.addEventListener("mouseleave", onLeave);
    return () => {
      nav.removeEventListener("mousemove", onMove);
      nav.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const handleLogin = (user) => {
    setShowLogin(false);
    onLogin(user);
    navigate(user.role === "admin" ? "/admin/movies" : "/");
  };

  const handleLogout = () => { onLogout(); navigate("/"); };

  return (
    <>
      <nav ref={navRef} className="navbar navbar-expand-lg cine-navbar">
        <div className="container">

          {/* ── Brand ──────────────────────────────────── */}
          <Link className="navbar-brand" to="/">
            <i className="bi bi-film nav-brand-icon me-2" />
            <span className="nav-brand-text">CINE</span>
            <span className="brand-dot nav-brand-dot">VERSE</span>
          </Link>

          {/* ── Mobile toggle ───────────────────────────── */}
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMain"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{ filter: "invert(1) opacity(0.45)" }}
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* ── Links ───────────────────────────────────── */}
          <div className="collapse navbar-collapse" id="navbarMain">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link nav-link-glow" to="/" end>
                  <i className="bi bi-house me-1" />Home
                </NavLink>
              </li>
              {isAdmin && (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link nav-link-glow" to="/admin/movies">
                      <i className="bi bi-camera-reels me-1" />Movies
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link nav-link-glow" to="/admin/showtimes">
                      <i className="bi bi-calendar3 me-1" />Showtimes
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link nav-link-glow" to="/admin/tickets">
                      <i className="bi bi-ticket-perforated me-1" />Tickets
                    </NavLink>
                  </li>
                </>
              )}
            </ul>

            {/* ── Right ───────────────────────────────── */}
            <div className="d-flex align-items-center gap-3">
              {!isUser && (
                <button
                  className="btn-cyan btn nav-login-btn"
                  onClick={() => setShowLogin(true)}
                  id="navbar-login-btn"
                >
                  <i className="bi bi-box-arrow-in-right me-1" />Login
                </button>
              )}
              {isUser && (
                <>
                  {isAdmin && (
                    <span className="admin-badge">
                      <i className="bi bi-shield-lock me-1" />Admin
                    </span>
                  )}
                  <div className="user-chip">
                    <div className="user-chip__avatar">
                      {authUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="user-chip__name">{authUser.name}</span>
                  </div>
                  <button
                    className="btn-outline-cyan btn"
                    onClick={handleLogout}
                    id="navbar-logout-btn"
                    style={{ fontSize: "0.78rem", padding: "0.38rem 0.9rem" }}
                  >
                    <i className="bi bi-box-arrow-right me-1" />Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />
      )}
    </>
  );
}
