import React from "react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-6xl font-extrabold text-red-600 mb-4">403</h1>
          <h2 className="text-3xl font-bold text-gray-900">Accès Interdit</h2>
          <p className="mt-4 text-lg text-gray-600">
            Désolé, vous n'avez pas les autorisations nécessaires pour accéder à
            cette page. Veuillez vérifier vos identifiants ou contacter un
            administrateur si vous pensez qu'il s'agit d'une erreur.
          </p>
        </div>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
