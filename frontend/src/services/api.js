/**
 * src/services/api.js
 * ───────────────────
 * Centralised Axios instance for the cinema application.
 */

import axios from "axios";

// ── Single source of truth for the backend address ────────────
export const BASE_URL = "http://localhost:8080/api";

// ── Global Axios instance ──────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── Helper to set the user role header for admin operations ────
let currentUserRole = "";
export function setUserRole(role) {
  currentUserRole = role || "";
}

// ── Request interceptor — attach role header + dev logging ─────
api.interceptors.request.use(
  (config) => {
    // Attach role header if set
    if (currentUserRole) {
      config.headers["X-User-Role"] = currentUserRole.toUpperCase();
    }

    if (import.meta.env.DEV) {
      console.log(
        `[API →] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
      );
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor — normalise error messages ───────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (typeof error.response?.data === "string" ? error.response.data : null) ||
      error.message ||
      "An unexpected error occurred.";

    if (import.meta.env.DEV) {
      console.error(
        `[API ✗] ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        `→ ${error.response?.status ?? "NO_RESPONSE"}:`, message
      );
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
