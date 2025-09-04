import React from "react";
import { FaTimes, FaEdit, FaTrash, FaBook } from "react-icons/fa";

export default function DetailModal({ book, onClose, onEdit, onDelete }) {
  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-2">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
      ></div>

      {/* Contenu */}
      <div className="relative bg-white p-6 rounded-2xl w-full max-w-lg z-50 shadow-2xl animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-600">
            <FaBook /> {book.titre}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Infos */}
        <ul className="space-y-2 text-gray-700">
          <li>
            <span className="font-medium">Auteur :</span> {book.auteur}
          </li>
          <li>
            <span className="font-medium">Année :</span> {book.annee}
          </li>
          <li>
            <span className="font-medium">Genre :</span> {book.genre}
          </li>
          <li>
            <span className="font-medium">Sujet :</span> {book.sujet}
          </li>
          <li>
            <span className="font-medium">Disponibilité :</span>{" "}
            <span
              className={`px-2 py-1 rounded-full text-sm font-semibold ${
                book.disponible
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {book.disponible ? "Disponible" : "Indisponible"}
            </span>
          </li>
        </ul>

        {/* Boutons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
          >
            Fermer
          </button>
          <button
            onClick={() => {
              onEdit(book);
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 font-medium transition"
          >
            <FaEdit /> Modifier
          </button>
          <button
            onClick={() => {
              onDelete(book.id);
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 font-medium transition"
          >
            <FaTrash /> Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
