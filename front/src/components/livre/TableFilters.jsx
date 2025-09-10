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
    <div className="mt-7 grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
      {/* SearchBar */}
      <div className="col-span-12 md:col-span-7">
        <SearchBar search={search} setSearch={setSearch} setPage={setPage} />
      </div>

      {/* Filtres */}
      <div className="col-span-12 md:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <select
          className="w-full bg-gray-200 border text-sm p-2 rounded-sm"
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

        <select
          className="w-full bg-gray-200 border text-sm p-2 rounded-sm"
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

        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 bg-gray-100 border rounded-sm hover:bg-gray-200 p-2 text-sm"
        >
          <MdOutlineSettingsBackupRestore />
          Reset
        </button>
      </div>
    </div>
  );
}
