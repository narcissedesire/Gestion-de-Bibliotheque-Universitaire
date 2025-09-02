import React, { useEffect, useRef, useState } from "react";
import { useLibrairie } from "../../context/LibrairieContext"; // Pour utiliser updateLivre
import { toast } from "react-toastify";

export default function EditModal({ book, onClose }) {
  const [updatedBook, setUpdatedBook] = useState(book);
  console.log("updatedBook : ", updatedBook.id);
  const { updateLivre } = useLibrairie(); // Utilisation de la fonction centralisée

  const handleSubmit = (e) => {
    e.preventDefault();
    updateLivre(updatedBook.id, updatedBook);
    onClose();
    toast.success("Livre modifié avec succès !");
  };

  return (
    <div className="fixed z-50 flex items-center justify-center">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center w-full h-screen justify-center z-40 cursor-pointer"
      ></div>
      <div className="bg-white p-6 rounded-lg w-full max-w-md z-50 fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 ">
        <h2 className="text-lg font-semibold mb-4">Modifier le livre</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={updatedBook.titre}
            onChange={(e) =>
              setUpdatedBook({ ...updatedBook, titre: e.target.value })
            }
            className="w-full p-2 border rounded"
            placeholder="Titre"
          />
          <input
            type="text"
            value={updatedBook.auteur}
            onChange={(e) =>
              setUpdatedBook({ ...updatedBook, auteur: e.target.value })
            }
            className="w-full p-2 border rounded"
            placeholder="Auteur"
          />
          <select
            value={updatedBook.genre}
            onChange={(e) =>
              setUpdatedBook({ ...updatedBook, genre: e.target.value })
            }
            className="w-full p-2 border rounded"
          >
            <option value="Roman">Roman</option>
            <option value="Manuel">Manuel</option>
            <option value="Revue">Revue</option>
            <option value="Autre">Autre</option>
          </select>
          <input
            type="number"
            value={updatedBook.annee}
            onChange={(e) =>
              setUpdatedBook({ ...updatedBook, annee: e.target.value })
            }
            className="w-full p-2 border rounded"
            placeholder="Année"
          />
          <select
            value={updatedBook.disponible}
            onChange={(e) =>
              setUpdatedBook({
                ...updatedBook,
                disponible: e.target.value === "true",
              })
            }
            className="w-full p-2 border rounded"
          >
            <option value="true">Disponible</option>
            <option value="false">Indisponible</option>
          </select>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
            >
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
