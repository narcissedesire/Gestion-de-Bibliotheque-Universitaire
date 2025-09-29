import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          Oups ! La page que vous cherchez n'existe pas.
        </p>
        <p className="text-gray-500 mb-8">
          Il semble que vous vous soyez perdu. Retournez à l'accueil pour
          continuer votre exploration.
        </p>
        <Link
          to="/"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
