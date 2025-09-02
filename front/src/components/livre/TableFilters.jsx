import React from "react";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineSettingsBackupRestore } from "react-icons/md";

export default function TableFilters({
  search,
  setSearch,
  genre,
  setGenre,
  disponibilite,
  setDisponibilite,
  handleReset,
  setPage, // Prop pour réinitialiser la page
}) {
  return (
    <div className="mt-7 grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
      <div className="col-span-8 flex items-center justify-between bg-gray-200 rounded-sm gap-1.5 p-1">
        <input
          type="text"
          className="border-r border-gray-400 w-full px-2.5 py-1 text-sm outline-none"
          placeholder="Recherche par titre ou auteur..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Réinitialise la page à 1 lors du changement
          }}
        />
        <span className="w-8 h-7 flex items-center justify-center">
          <IoIosSearch className="text-2xl" />
        </span>
      </div>

      <div className="col-span-4 grid grid-cols-2 gap-2">
        <select
          className="w-full bg-gray-200 border text-sm p-2"
          value={genre}
          onChange={(e) => {
            setGenre(e.target.value);
            setPage(1); // Réinitialise la page à 1
          }}
        >
          <option value="">Tous les genres</option>
          <option value="Roman">Roman</option>
          <option value="Manuel">Manuel</option>
          <option value="Revue">Revue</option>
          <option value="Autre">Autre</option>
        </select>

        {/* <select
          className="w-full bg-gray-200 border text-sm p-2"
          value={disponibilite}
          onChange={(e) => {
            setDisponibilite(e.target.value);
            setPage(1); // Réinitialise la page à 1
          }}
        >
          <option value="">Disponibilité</option>
          <option value="true">Disponible</option>
          <option value="false">Indisponible</option>
        </select> */}

        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 bg-gray-100 border rounded-sm hover:bg-gray-200"
        >
          <MdOutlineSettingsBackupRestore />
          Reset
        </button>
      </div>
    </div>
  );
}
