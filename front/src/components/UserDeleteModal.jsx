import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";

export default function UserDeleteModal({ isOpen, onClose, user }) {
  const [isActive, setIsActive] = useState(user?.isActive || false);
  const { deleteUser } = useAuth();

  // Quand la prop user change, on met à jour l’état local
  useEffect(() => {
    if (user) {
      setIsActive(user.isActive);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    deleteUser(user.id);
    onClose();
  };

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
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <IoClose size={22} />
        </button>

        {/* Titre */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Supprimer l'utilisateur {user.nom}
        </h2>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>Voulez-vous vraiment Supprimer cet utilisateur ?</div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
