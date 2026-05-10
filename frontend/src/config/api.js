/**
 * src/config/api.js  — compatibility shim
 * ─────────────────────────────────────────
 * All page components import from this path:
 *   import api from "../../config/api"
 *
 * This file simply re-exports from the canonical service so
 * those imports keep working without modification.
 *
 * ✅ To change the server IP, edit src/services/api.js only.
 */
export { default, BASE_URL, setUserRole } from "../services/api";
