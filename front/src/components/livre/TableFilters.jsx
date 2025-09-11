// TableFilters.jsx
import React from "react";
import { MdOutlineSettingsBackupRestore } from "react-icons/md";
import SearchBar from "./SearchBar";

export default function TableFilters({
  search,
  setSearch,
  genre,
  setGenre,
  disponibilite,
  setDisponibilite,
  handleReset,
  setPage,
}) {
  return (
    <div className="mt-7 mb-6 px-4 sm:px-6 lg:px-8">
      {/* Conteneur principal avec padding responsive */}
      <div className="grid grid-cols-1 gap-4">
        {/* SearchBar - Pleine largeur sur mobile, 7/12 sur md et plus */}
        <div className="w-full">
          <SearchBar search={search} setSearch={setSearch} setPage={setPage} />
        </div>

        {/* Filtres - Empilés sur mobile, grille sur sm et plus */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Genre */}
          <select
            className="w-full bg-gray-200 border text-sm p-2 rounded-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={genre}
            onChange={(e) => {
              setGenre(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Tous les genres</option>
            <option value="Roman">Roman</option>
            <option value="Manuel">Manuel</option>
            <option value="Revue">Revue</option>
            <option value="Autre">Autre</option>
          </select>

          {/* Disponibilité */}
          <select
            className="w-full bg-gray-200 border text-sm p-2 rounded-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={disponibilite}
            onChange={(e) => {
              setDisponibilite(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Disponibilité</option>
            <option value="true">Disponible</option>
            <option value="false">Indisponible</option>
          </select>

          {/* Bouton Reset */}
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 bg-gray-100 border rounded-sm hover:bg-gray-200 p-2 text-sm cursor-pointer w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <MdOutlineSettingsBackupRestore />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
