import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Utiliser un port différent
    host: "0.0.0.0", // Force l'utilisation d'IPv4 pour éviter les problèmes IPv6
  },
  define: {
    API_URL: JSON.stringify("http://localhost:5432"),
  },
});
