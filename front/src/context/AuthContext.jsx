import React, { createContext, useState, useContext, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useLibrairie } from "./LibrairieContext";
import { API_URL } from "../../API_URL";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // ✅ État initial basé sur le token stocké
  // const API_URL = "https://gestion-de-bibliotheque-universitaire.onrender.com";
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Vérifier si le token est expiré
        if (decoded.exp * 1000 > Date.now()) {
          return decoded;
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Token invalide :", error);
        localStorage.removeItem("token");
      }
    }
    return null;
  });

  // ✅ Fonction login : stocke le token et décode l'utilisateur
  function login(token) {
    try {
      const decoded = jwtDecode(token);
      // Vérifier si le token est valide et pas expiré
      if (decoded.exp * 1000 > Date.now()) {
        localStorage.setItem("token", token);
        setUser(decoded);
      } else {
        console.error("Token expiré, impossible de se connecter.");
      }
    } catch (error) {
      console.error("Erreur lors du décodage du token :", error);
    }
  }

  //Inscription
  const inscription = async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/users/inscription`, {
        // Ajustez l'URL de votre API
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      console.log("Response from inscription:", data); // Débogage

      if (!response.ok) {
        throw new Error(data.message || "Erreur serveur");
      }

      if (data.success) {
        setUser(data.user);
        window.location.href = "/login";
        return { success: true };
      } else {
        throw new Error(data.message || "Inscription échouée");
      }
    } catch (error) {
      console.error("Inscription error:", error);
      return { success: false, message: error.message };
    } finally {
    }
  };

  const updateUser = async (userData, id) => {
    try {
      const res = await fetch(`${API_URL}/users/update-user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      const data = await res.json();

      if (data.success) {
        // 🔹 Mettre à jour le contexte immédiatement
        setUser((prev) => ({ ...prev, ...userData }));
        toast.success("Profil mis à jour avec succès !");
        return { success: true };
      } else {
        toast.error(data.message || "Erreur lors de la mise à jour du profil.");
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
      return { success: false, message: error.message };
    }
  };

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  }

  // ✅ Méthodes supplémentaires
  const value = {
    user,
    login,
    logout,
    inscription,
    token,
    isAuthenticated: !!user,
    hasRole: (roles) => user && roles.includes(user.type),
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
