// TableFilters.jsx
import { MdOutlineSettingsBackupRestore } from "react-icons/md";
import SearchBar from "./livre/SearchBar";

export default function TableFilterUser({
  search,
  setSearch,
  typeUser,
  setTypeUser,
  handleReset,
  setPage,
  disponibilite,
  setDisponibilite,
}) {
  return (
    <div className="mt-7 mb-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4">
        <div className="w-full">
          <SearchBar search={search} setSearch={setSearch} setPage={setPage} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <select
            className="w-full bg-gray-200 border text-sm p-2 rounded-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={typeUser}
            onChange={(e) => {
              setTypeUser(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Tous les types</option>
            <option value="Etudiant">Etudiant</option>
            <option value="Professeur">Professeur</option>
          </select>

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
