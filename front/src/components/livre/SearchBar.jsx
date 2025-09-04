import React from "react";
import { IoIosSearch } from "react-icons/io";

export default function SearchBar({
  search,
  setSearch,
  setPage,
  placeholder = "Recherche...",
}) {
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Réinitialise la page à 1 lors d'une nouvelle recherche
  };

  return (
    <div className="col-span-7 flex items-center justify-between bg-gray-200 rounded-sm gap-1.5 p-1">
      <input
        type="text"
        className="border-r border-gray-400 w-full px-2.5 py-1 text-sm outline-none"
        placeholder={placeholder}
        value={search}
        onChange={handleSearchChange}
      />
      <span className="w-8 h-7 flex items-center justify-center">
        <IoIosSearch className="text-2xl" />
      </span>
    </div>
  );
}
