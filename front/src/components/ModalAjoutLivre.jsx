import React, { useState } from "react";
import { useLibrairie } from "../context/LibrairieContext";
import { toast } from "react-toastify";

export default function ModalAjoutLivre({ onClose, onSave, genres }) {
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
      return;
    }
    onSave(newBook);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
      ></div>
      <div className="bg-white p-6 rounded-lg w-full max-w-md z-50">
        <h2 className="text-lg font-semibold mb-4">Ajouter un livre</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="w-full">
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
            <div className="w-full">
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
          <div>
            <label className="block text-sm font-medium mb-1">Genre</label>
            <select
              value={newBook.genre}
              onChange={(e) =>
                setNewBook({ ...newBook, genre: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="">Choisir un genre...</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
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
