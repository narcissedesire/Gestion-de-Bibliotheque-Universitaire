/** @type {import('tailwindcss').Config} */
export default {
  compatibility: "v3",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // C'est bon
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A", // Bleu nuit : Header, Sidebar
        secondary: "#047857", // Vert sapin : Boutons principaux
        accent: "#F59E0B", // Orange doré : Boutons secondaires, notifications
        neutral: "#F3F4F6", // Gris clair : Background
        white: "#FFFFFF", // Blanc pur : Cartes, sections
        textPrimary: "#1F2937", // Gris foncé pour textes
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        serif: ["Merriweather", "ui-serif", "Georgia"],
      },
      borderRadius: {
        lg: "0.75rem",
      },
      boxShadow: {
        card: "0 4px 6px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};
