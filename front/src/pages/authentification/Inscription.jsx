import React, { useState } from "react";
import Loading from "../Loading/Loading";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Inscription() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState(""); // Keep local state as motDePasse
  const [confirme, setConfirme] = useState("");
  const [typeUtilisateur, setTypeUtilisateur] = useState("");
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState("");
  const { loading, inscription } = useAuth();

  const validateForm = () => {
    if (
      !nom.trim() ||
      !prenom.trim() ||
      !email.trim() ||
      !motDePasse.trim() ||
      !typeUtilisateur
    ) {
      return "Veuillez remplir tous les champs.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Veuillez entrer un email valide.";
    }
    if (motDePasse.length < 6) {
      return "Le mot de passe doit contenir au moins 6 caractères.";
    }
    if (motDePasse !== confirme) {
      return "Les mots de passe ne correspondent pas.";
    }
    return null;
  };

  async function inscriptionFunc(e) {
    e.preventDefault();
    setErreur("");
    setSucces("");

    const validationError = validateForm();
    if (validationError) {
      setErreur(validationError);
      return;
    }

    console.log("Données envoyées à inscription:", {
      nom,
      prenom,
      email,
      password: motDePasse, // Change motDePasse to password here
      type: typeUtilisateur,
    });

    try {
      const response = await inscription({
        nom,
        prenom,
        email,
        password: motDePasse, // Use password instead of motDePasse
        type: typeUtilisateur,
      });
      if (response.success) {
        setSucces(
          "Inscription réussie ! Vous pouvez maintenant vous connecter."
        );
        setNom("");
        setPrenom("");
        setEmail("");
        setMotDePasse("");
        setConfirme("");
        setTypeUtilisateur("");
      } else {
        setErreur(
          response.message || "Une erreur est survenue lors de l'inscription."
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      setErreur(
        error.message ||
          "Une erreur inattendue s'est produite. Veuillez réessayer."
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Loading />
        </div>
      )}
      <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:w-1/2 hidden md:block">
          <img
            src="images/authentification_inscrit.png"
            alt="Inscription"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="p-6 md:w-1/2 w-full">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
              Inscription
            </h1>
            <p className="text-gray-500 text-[12px] text-center mb-6">
              Système de gestion de bibliothèque
            </p>
            {erreur && (
              <p className="text-red-500 text-sm mb-4 text-center bg-red-100 p-2 rounded">
                {erreur}
              </p>
            )}
            {succes && (
              <p className="text-green-500 text-sm mb-4 text-center bg-green-100 p-2 rounded">
                {succes}
              </p>
            )}
          </div>
          <form onSubmit={inscriptionFunc} className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label
                  htmlFor="nom"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Nom
                </label>
                <input
                  className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral transition duration-200"
                  type="text"
                  placeholder="Nom..."
                  required
                  id="nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="prenom"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Prénom
                </label>
                <input
                  className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral transition duration-200"
                  type="text"
                  placeholder="Prénom..."
                  required
                  id="prenom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                Email
              </label>
              <input
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral transition duration-200"
                type="email"
                placeholder="Email..."
                required
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-1"
              >
                Mot de passe
              </label>
              <input
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral transition duration-200"
                type="password"
                placeholder="Mot de passe..."
                required
                id="password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-medium mb-1"
              >
                Confirmer le mot de passe
              </label>
              <input
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral transition duration-200"
                type="password"
                placeholder="Confirmer le mot de passe..."
                required
                id="confirmPassword"
                value={confirme}
                onChange={(e) => setConfirme(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="typeUtilisateur"
                className="block text-gray-700 font-medium mb-1"
              >
                Type d'utilisateur
              </label>
              <select
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral transition duration-200"
                id="typeUtilisateur"
                value={typeUtilisateur}
                onChange={(e) => setTypeUtilisateur(e.target.value)}
                required
              >
                <option value="">Sélectionner un type</option>
                <option value="Etudiant">Etudiant</option>
                <option value="Professeur">Professezur</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full cursor-pointer hover:bg-accent/70 bg-accent text-white py-2 rounded-md transition-colors duration-200 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Inscription en cours..." : "S'inscrire"}
            </button>
            <div className="flex flex-col items-center gap-2 mt-4">
              <p className="text-sm text-center text-gray-600">
                Vous avez déjà un compte ?
              </p>
              <Link
                to="/login"
                className="text-sm text-center text-blue-600 hover:underline font-medium"
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
