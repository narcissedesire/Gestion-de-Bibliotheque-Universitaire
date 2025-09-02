import React, { createContext, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // ✅ État initial basé sur le token stocké
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

  // ✅ Fonction logout
  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  // ✅ Méthodes supplémentaires
  const value = {
    user,
    login,
    logout,
    token,
    isAuthenticated: !!user,
    hasRole: (roles) => user && roles.includes(user.type),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
