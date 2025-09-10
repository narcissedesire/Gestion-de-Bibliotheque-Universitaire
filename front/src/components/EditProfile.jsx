import React, { useState, useEffect } from "react";
import { FiSave } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";

export default function EditProfile({ onClose, file, user }) {
  const { updateUser } = useAuth();
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
  });

  // 🔹 Initialisation au montage du composant avec logs pour débogage
  useEffect(() => {
    console.log("Prop user reçu :", user); // Log pour vérifier user
    if (user && typeof user === "object") {
      setForm({
        nom: user.nom ?? "",
        prenom: user.prenom ?? "",
        email: user.email ?? "",
      });
      console.log("Form mis à jour :", {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
      }); // Log pour vérifier la mise à jour
    } else {
      console.warn(
        "User est undefined ou invalide ! Vérifiez les props parentes."
      );
    }
  }, [user]); // Dépendance sur user pour re-exécuter si user change

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    console.log("Nom : ", form.nom);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Données soumises :", form); // Log pour vérifier avant envoi

    // const formData = new FormData();
    // formData.append("nom", form.nom);
    // formData.append("prenom", form.prenom);
    // formData.append("email", form.email);
    // if (file) {
    //   formData.append("photo", file);
    // }

    try {
      await updateUser(form, user.id);
      console.log("Mise à jour réussie !");
      onClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      // Vous pouvez ajouter un toast ou un message d'erreur ici si nécessaire
    }
  };

  return (
    <div className="mt-5 shadow-2xl border border-gray-300 rounded-xl w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium">Nom :</label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Entrez votre nom"
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium">Prénom :</label>
            <input
              type="text"
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Entrez votre prénom"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm font-medium">Adresse email :</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Entrez votre email"
          />
        </div>

        <div className="flex gap-4 items-center text-xs">
          <button
            type="submit"
            className="bg-black text-white gap-2 flex items-center px-4 py-2 rounded hover:bg-black/70 cursor-pointer whitespace-nowrap"
          >
            <FiSave /> Sauvegarder
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-white border border-gray-300 text-black gap-2 flex items-center px-4 py-2 rounded hover:bg-gray-200 cursor-pointer"
          >
            <IoClose /> Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
