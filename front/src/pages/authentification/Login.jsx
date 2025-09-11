import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Loading from "../Loading/Loading";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  // Validation côté client
  const validateForm = () => {
    if (!email || !motDePasse) {
      setErreur("Tous les champs sont requis.");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErreur("Veuillez entrer un email valide.");
      return false;
    }
    return true;
  };

  async function handleLogin(e) {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErreur("");
    setSucces("");

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, motDePasse }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.accessToken; // Infos utiles du JWT

        login(token); // Sauvegarde dans contexte + localStorage
        setSucces("Connexion réussie ! Redirection...");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setErreur(data.message || "Erreur de connexion");
      }
    } catch (error) {
      setErreur("Erreur réseau ou serveur indisponible.");
      console.error(error);
    }

    setLoading(false);
  }

  // Effacer les messages après 3 secondes
  useEffect(() => {
    if (erreur || succes) {
      const timer = setTimeout(() => {
        setErreur("");
        setSucces("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [erreur, succes]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      {loading && <Loading />}
      <div className="flex flex-col-reverse md:flex-row-reverse max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        {/* Section image */}
        <div className="md:w-1/2 hidden md:block">
          <img
            src="images/authentification_inscrit.png"
            alt="Inscription"
            className="object-cover w-full h-full transition-opacity duration-500"
          />
        </div>

        {/* Section formulaire */}
        <div className="p-8 md:w-1/2 w-full animate-slide-in">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Connexion
          </h1>
          {erreur && (
            <p className="text-red-500 text-sm mb-4 text-center animate-pulse">
              {erreur}
            </p>
          )}
          {succes && (
            <p className="text-green-500 text-sm mb-4 text-center animate-pulse">
              {succes}
            </p>
          )}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </label>
              <input
                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                type="email"
                placeholder="Email..."
                required
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-gray-700 font-medium">
                Mot de passe
              </label>
              <input
                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                type="password"
                placeholder="Mot de passe..."
                required
                id="password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 cursor-pointer rounded-md hover:bg-blue-700 transition-colors duration-300 disabled:bg-blue-400"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
            <div className="flex flex-col items-center gap-2 mt-4">
              <p className="text-sm text-center text-gray-600">
                Vous n'avez pas de compte ?
              </p>
              <Link
                to="/inscription"
                className="text-sm text-center text-blue-600 hover:underline transition-colors duration-200"
              >
                Inscrivez-vous
              </Link>
              <Link
                to="/forgot-password"
                className="text-sm text-center text-blue-600 hover:underline transition-colors duration-200"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
