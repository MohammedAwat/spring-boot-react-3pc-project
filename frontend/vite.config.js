import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: "/cinema/",  // ← Uncomment this when deploying to Tomcat at /cinema/
  server: {
    host: true, // Listens on all local IPs, so PC3 can connect to it.
    port: 5173,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 600,
  },
});
