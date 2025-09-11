import React from "react";
import { IoIosSearch } from "react-icons/io";

export default function SearchBar({
  search,
  setSearch,
  setPage,
  placeholder = "Recherche...",
}) {
  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (value.length >= 3) {
      setSearch(value); // Mettre à jour la recherche uniquement si ≥ 3 caractères
      setPage(1); // Réinitialiser la page à 1
    } else if (value.length === 0) {
      setSearch(""); // Réinitialiser la recherche si vide
      setPage(1); // Réinitialiser la page si vide
    } // Sinon, ne rien faire si entre 1 et 2 caractères
  };

  return (
    <div className="flex items-center justify-between bg-gray-200 rounded-sm gap-1.5 p-1">
      <input
        type="text"
        className="border-r border-gray-400 w-full px-2.5 py-1 text-sm outline-none bg-transparent"
        placeholder={placeholder}
        // value={search}
        onChange={handleSearchChange}
      />
      <span className="w-8 h-7 flex items-center justify-center">
        <IoIosSearch className="text-2xl text-gray-600" />
      </span>
    </div>
  );
}
