import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify"; // Importer ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Importer le CSS de react-toastify

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <ToastContainer
      position="top-right" // Position du toast
      autoClose={5000} // Temps avant fermeture automatique (5 secondes)
      hideProgressBar={false} // Afficher la barre de progression
      newestOnTop={false} // Nouveaux toasts en bas
      closeOnClick // Fermer en cliquant
      rtl={false} // Pas de texte de droite à gauche
      pauseOnFocusLoss // Pause si la fenêtre perd le focus
      draggable // Permettre de déplacer les toasts
      pauseOnHover // Pause au survol
      theme="light" // Thème clair (peut être "dark" ou "colored")
    />
  </StrictMode>
);
