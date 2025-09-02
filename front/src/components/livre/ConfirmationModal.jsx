import React from "react";

export default function ConfirmationModal({ onClose, onConfirm, message }) {
  return (
    <div className="fixed z-50 flex items-center justify-center">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center w-full h-screen justify-center z-40 cursor-pointer"
      ></div>
      <div className="bg-white p-6 rounded-lg w-full max-w-md z-50 fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
        <h2 className="text-lg font-semibold mb-4 ">Confirmation</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}
