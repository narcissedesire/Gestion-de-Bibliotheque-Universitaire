import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";

export default function UserStatusModal({
  isOpen,
  onClose,
  user_id,
  fetchUsers,
}) {
  const [isActive, setIsActive] = useState(null);
  const { activeOrDesactiveUser } = useAuth();
  const [erreur, setErreur] = useState("");
  console.log(erreur);

  if (!isOpen || !user_id) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Is active : ", isActive);
    if (isActive === null) {
      setErreur(" Vous devez selectionner un status");
      return;
    }
    activeOrDesactiveUser(user_id, isActive);
    onClose();
    fetchUsers();
  };

  return (
    <div className="">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40 w-full h-screen backdrop-blur-[3px]"
      ></div>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <IoClose size={22} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Modifier le statut du compte
        </h2>
        {erreur && <p className="text-red-500 mb-2">{erreur}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Statut du compte :
            </label>
            <select
              value={isActive}
              onChange={(e) => setIsActive(e.target.value === "true")}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Selectionne le status</option>
              <option value="true">✅ Actif</option>
              <option value="false">❌ Inactif</option>
            </select>
          </div>

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
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
