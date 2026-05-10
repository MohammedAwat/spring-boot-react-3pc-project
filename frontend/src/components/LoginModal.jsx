import { useState } from "react";
import api from "../services/api";

export default function LoginModal({ onClose, onLogin }) {
  const [isSignUp, setIsSignUp]   = useState(false);
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignUp && !name.trim()) return setError("Please enter your name.");
    if (!email.trim())    return setError("Please enter your email.");
    if (!password)        return setError("Please enter a password.");

    setLoading(true);

    try {
      if (isSignUp) {
        // ── Sign Up ──
        const res = await api.post("/users/register", {
          name: name.trim(),
          email: email.trim(),
          password: password,
          role: "USER",
        });
        // Auto-login after signup
        onLogin({ id: res.data.id, name: res.data.name, email: res.data.email, role: res.data.role?.toLowerCase() || "user" });
      } else {
        // ── Login ──
        const res = await api.post("/users/login", {
          email: email.trim(),
          password: password,
        });
        onLogin({ id: res.data.id, name: res.data.name, email: res.data.email, role: res.data.role });
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="login-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={isSignUp ? "Sign Up" : "Sign In"}
    >
      {/* Modal box — stop click from bubbling to backdrop */}
      <div className="login-box" onClick={(e) => e.stopPropagation()}>

        {/* Close button */}
        <button className="login-close" onClick={onClose} aria-label="Close">
          <i className="bi bi-x-lg"></i>
        </button>

        {/* Header */}
        <div className="login-header">
          <div className="login-icon">
            <i className="bi bi-film"></i>
          </div>
          <h2 className="login-title">{isSignUp ? "Create Account" : "Welcome Back"}</h2>
          <p className="login-sub">
            {isSignUp
              ? "Sign up for your CineVerse account"
              : "Sign in to your CineVerse account"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="cine-form">
          {/* Name — only for sign up */}
          {isSignUp && (
            <div className="mb-3">
              <label className="form-label" htmlFor="login-name">
                Full Name
              </label>
              <div style={{ position: "relative" }}>
                <i
                  className="bi bi-person-badge"
                  style={{
                    position: "absolute", left: "0.85rem", top: "50%",
                    transform: "translateY(-50%)", color: "var(--text-muted)",
                    fontSize: "0.9rem", pointerEvents: "none",
                  }}
                />
                <input
                  id="login-name"
                  type="text"
                  className="form-control"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  style={{ paddingLeft: "2.5rem" }}
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="mb-3">
            <label className="form-label" htmlFor="login-email">
              Email
            </label>
            <div style={{ position: "relative" }}>
              <i
                className="bi bi-envelope"
                style={{
                  position: "absolute", left: "0.85rem", top: "50%",
                  transform: "translateY(-50%)", color: "var(--text-muted)",
                  fontSize: "0.9rem", pointerEvents: "none",
                }}
              />
              <input
                id="login-email"
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                style={{ paddingLeft: "2.5rem" }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <div style={{ position: "relative" }}>
              <i
                className="bi bi-lock"
                style={{
                  position: "absolute", left: "0.85rem", top: "50%",
                  transform: "translateY(-50%)", color: "var(--text-muted)",
                  fontSize: "0.9rem", pointerEvents: "none",
                }}
              />
              <input
                id="login-password"
                type={showPass ? "text" : "password"}
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                style={{ paddingLeft: "2.5rem", paddingRight: "2.8rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                aria-label={showPass ? "Hide password" : "Show password"}
                style={{
                  position: "absolute", right: "0.85rem", top: "50%",
                  transform: "translateY(-50%)", background: "none",
                  border: "none", color: "var(--text-muted)", cursor: "pointer",
                  fontSize: "0.9rem", padding: 0,
                }}
              >
                <i className={`bi bi-eye${showPass ? "-slash" : ""}`}></i>
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="cine-alert cine-alert-danger d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-exclamation-triangle-fill flex-shrink-0"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn-cyan btn w-100"
            disabled={loading}
            style={{ height: 44, fontSize: "0.88rem", letterSpacing: "0.04em" }}
          >
            {loading
              ? <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />{isSignUp ? "Creating account…" : "Signing in…"}</>
              : <><i className={`bi ${isSignUp ? "bi-person-plus" : "bi-box-arrow-in-right"} me-2`}></i>{isSignUp ? "Sign Up" : "Sign In"}</>
            }
          </button>
        </form>

        {/* Toggle between Sign In / Sign Up */}
        <div className="login-hint">
          <div className="login-hint__line" />
          <span>{isSignUp ? "Already have an account?" : "Don't have an account?"}</span>
          <div className="login-hint__line" />
        </div>
        <div className="login-hint__body" style={{ textAlign: "center" }}>
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--cyan)", fontWeight: 600, fontSize: "0.85rem",
              textDecoration: "underline", padding: 0,
            }}
          >
            {isSignUp ? "Sign In instead" : "Create an account"}
          </button>
        </div>

      </div>
    </div>
  );
}
