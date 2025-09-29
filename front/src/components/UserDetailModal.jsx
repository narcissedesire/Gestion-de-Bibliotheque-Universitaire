import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

export default function UserDetailModal({
  isOpen,
  onClose,
  user,
  handleEdit,
  handleDelete,
}) {
  if (!isOpen || !user) return null;

  return (
    <div className="">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40 w-full h-screen backdrop-blur-[3px]"
      ></div>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          <IoClose size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Détails de l'utilisateur</h2>

        {/* Infos utilisateur */}
        <div className="space-y-2">
          <p>
            <strong>Nom :</strong> {user.nom}
          </p>
          <p>
            <strong>Prénom :</strong> {user.prenom}
          </p>
          <p>
            <strong>Email :</strong> {user.email}
          </p>
          <p>
            <strong>Type :</strong> {user.type}
          </p>
          <p>
            <strong>Date d'inscription :</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Statut :</strong>{" "}
            {user.isActive ? (
              <span className="text-green-600 font-semibold">Actif</span>
            ) : (
              <span className="text-red-600 font-semibold">Inactif</span>
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => handleEdit(user)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <FaEdit /> Modifier
          </button>
          <button
            onClick={() => handleDelete(user.id)}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            <FaTrash /> Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
