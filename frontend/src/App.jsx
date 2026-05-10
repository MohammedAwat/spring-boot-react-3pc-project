import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { setUserRole } from "./services/api";

import Navbar          from "./components/Navbar";
import Home            from "./pages/user/Home";
import MovieDetails    from "./pages/user/MovieDetails";
import BookTicket      from "./pages/user/BookTicket";
import ManageMovies    from "./pages/admin/ManageMovies";
import ManageShowtimes    from "./pages/admin/ManageShowtimes";
import ViewTickets        from "./pages/admin/ViewTickets";
import CursorBackground   from "./components/CursorBackground";

/* ─────────────────────────────────────────────────────────────
   Global Background
   Ambient colour glow — no poster images.
   Posters only appear in the Hero on the Home page.
───────────────────────────────────────────────────────────── */
function GlobalBackground() {
  return (
    <div className="global-bg" aria-hidden="true">
      <div className="global-bg-glow" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Footer
───────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="cine-footer">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div>
            <div className="footer-brand">CINE<span>VERSE</span></div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
              Cinema Ticketing System
            </div>
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
            &copy; {new Date().getFullYear()} CineVerse. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────
   App — auth state
   authUser = null                         → not logged in
   authUser = { name, role: "user"  }      → regular user
   authUser = { name, role: "admin" }      → administrator
───────────────────────────────────────────────────────────── */
export default function App() {
  const [authUser, setAuthUser] = useState(null);

  const isAdmin = authUser?.role === "admin";

  const handleLogin = (user) => {
    setAuthUser(user);
    setUserRole(user.role);
  };

  const handleLogout = () => {
    setAuthUser(null);
    setUserRole("");
  };

  return (
    <BrowserRouter>
      {/* Layer -2: ambient colour blobs */}
      <GlobalBackground />
      {/* Layer -1: live cursor-reactive particle canvas */}
      <CursorBackground />

      <Navbar
        authUser={authUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <Routes>
        {/* ── Public routes — accessible by anyone ── */}
        <Route path="/"                 element={<Home />} />
        <Route path="/movie/:id"        element={<MovieDetails />} />
        <Route path="/book/:showtimeId" element={<BookTicket />} />

        {/* ── Admin routes — redirect to home if not admin ── */}
        <Route
          path="/admin/movies"
          element={isAdmin ? <ManageMovies /> : <Navigate to="/" replace />}
        />
        <Route
          path="/admin/showtimes"
          element={isAdmin ? <ManageShowtimes /> : <Navigate to="/" replace />}
        />
        <Route
          path="/admin/tickets"
          element={isAdmin ? <ViewTickets /> : <Navigate to="/" replace />}
        />

        {/* ── Catch-all ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
