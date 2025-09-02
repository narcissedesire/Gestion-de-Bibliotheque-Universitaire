import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    API_URL: JSON.stringify("http://localhost:3000"),
  },
});
