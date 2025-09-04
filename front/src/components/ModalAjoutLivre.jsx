import React, { useState } from "react";
import { useLibrairie } from "../context/LibrairieContext";
import { toast } from "react-toastify";

export default function ModalAjoutLivre({ onClose }) {
  const { addLivre } = useLibrairie();
  const [newBook, setNewBook] = useState({
    titre: "",
    auteur: "",
    genre: "",
    annee: "",
    sujet: "",
  });

  const validateLivre = (livre) => {
    if (!livre.titre?.trim()) return "Le titre est obligatoire.";
    if (!livre.auteur?.trim()) return "L'auteur est obligatoire.";
    if (!livre.genre?.trim()) return "Le genre est obligatoire.";
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errorMessage = validateLivre(newBook);
    if (errorMessage) {
      toast.error(errorMessage);
      return; // bloque si invalides
    }
    addLivre(newBook);
    console.log(newBook);
    onClose();
  };

  return (
    <div className="fixed z-50 flex items-center justify-center px-2">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-50 flex items-center w-full h-screen justify-center z-40 cursor-pointer"
      ></div>

      {/* Modal */}
      <div className="bg-white p-6 rounded-lg w-full max-w-md z-50 fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
        <h2 className="text-lg font-semibold mb-4">Ajouter un livre</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            {/* Titre */}
            <div>
              <label className="block text-sm font-medium mb-1">Titre</label>
              <input
                type="text"
                placeholder="Titre"
                value={newBook.titre}
                onChange={(e) =>
                  setNewBook({ ...newBook, titre: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Auteur */}
            <div>
              <label className="block text-sm font-medium mb-1">Auteur</label>
              <input
                type="text"
                placeholder="Auteur"
                value={newBook.auteur}
                onChange={(e) =>
                  setNewBook({ ...newBook, auteur: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-medium mb-1">Genre</label>
            <select
              value={newBook.genre}
              onChange={(e) =>
                setNewBook({ ...newBook, genre: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option key="choix" value="">
                Choisir un genre...
              </option>
              <option key={"manuel"} value="Manuel">
                Manuel
              </option>
              <option key={"Roman"} value="Roman">
                Roman
              </option>
              <option key={"Revue"} value="Revue">
                Revue
              </option>
              <option key={"Autre"} value="Autre">
                Autre
              </option>
            </select>
          </div>

          {/* Sujet */}
          <div>
            <label className="block text-sm font-medium mb-1">Sujet</label>
            <input
              type="text"
              placeholder="Sujet..."
              value={newBook.sujet}
              onChange={(e) =>
                setNewBook({ ...newBook, sujet: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Année */}
          <div>
            <label className="block text-sm font-medium mb-1">Année</label>
            <input
              type="number"
              placeholder="Année"
              value={newBook.annee}
              onChange={(e) =>
                setNewBook({ ...newBook, annee: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
