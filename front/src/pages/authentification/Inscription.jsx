import React, { useState } from "react";
import Loading from "../Loading/Loading";
import { Link } from "react-router-dom";

export default function Inscription() {
  const [loading, setLoading] = useState(false);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirme, setConfirme] = useState("");
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState("");

  // Fonction d'inscription avec validation
  async function inscription(e) {
    e.preventDefault(); // Empêche le rechargement de la page
    setLoading(true);
    setErreur("");
    setSucces("");

    // Vérification de la correspondance des mots de passe
    if (motDePasse !== confirme) {
      setLoading(false);
      setErreur("Les mots de passe ne correspondent pas.");
      return;
    }

    // Validation des champs
    if (!nom || !prenom || !email || !motDePasse) {
      setErreur("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/inscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom,
          prenom,
          email,
          motDePasse,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSucces("Inscription réussie !");
        // Réinitialiser le formulaire
        setNom("");
        setPrenom("");
        setEmail("");
        setMotDePasse("");
        setConfirme("");
      } else {
        setErreur(
          data.message || "Une erreur s'est produite lors de l'inscription."
        );
      }
    } catch (error) {
      setErreur("Erreur réseau. Veuillez réessayer plus tard.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      {loading && <Loading />}
      <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Section image */}
        <div className="md:w-1/2 hidden md:block">
          <img
            src="images/authentification_inscrit.png"
            alt="Inscription"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Section formulaire */}
        <div className="p-8 md:w-1/2 w-full">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 text-center">
              Inscription
            </h1>
            <p className="text-gray-500 text-[12px] text-center text-sm mb-4">
              Système de gestion de bibliothèque
            </p>
            {erreur && (
              <p className="text-red-500 text-sm mb-4 text-center">{erreur}</p>
            )}
            {succes && (
              <p className="text-green-500 text-sm mb-4 text-center">
                {succes}
              </p>
            )}
          </div>
          <form onSubmit={inscription} className="flex flex-col gap-4">
            <div className="flex gap-5">
              <div className="flex flex-col gap-1">
                <label htmlFor="nom" className="text-gray-700 font-medium">
                  Nom
                </label>
                <input
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral"
                  type="text"
                  placeholder="Nom..."
                  required
                  id="nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="prenom" className="text-gray-700 font-medium">
                  Prénom
                </label>
                <input
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral"
                  type="text"
                  placeholder="Prénom..."
                  required
                  id="prenom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </label>
              <input
                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral"
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
                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral"
                type="password"
                placeholder="Mot de passe..."
                required
                id="password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="confirmPassword"
                className="text-gray-700 font-medium"
              >
                Confirmer le mot de passe
              </label>
              <input
                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral"
                type="password"
                placeholder="Confirmer le mot de passe..."
                required
                id="confirmPassword"
                value={confirme}
                onChange={(e) => setConfirme(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-accent text-white py-2 cursor-pointer rounded-md hover:bg-[#dc8b00] transition-colors duration-200"
            >
              S'inscrire
            </button>
            <div className="flex flex-col items-center gap-2 mt-4">
              <p className="text-sm text-center text-gray-600">
                Vous avez déjà un compte ?
              </p>
              <Link
                to="/login"
                className="text-sm text-center text-blue-600 hover:underline"
              >
                Connectez-vous
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
