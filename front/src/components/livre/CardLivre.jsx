import React from "react";
import { LuBookText } from "react-icons/lu";
import { LuBookOpen } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import { IoBookOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { LiaBookReaderSolid } from "react-icons/lia";

export default function CardLivre({
  titre,
  auteur,
  genre,
  disponible,
  emprunts,
  onEmprunter,
  onReserver,
}) {
  const getTypeIcon = (type) => {
    switch (type) {
      case "Roman":
        return <LuBookOpen className="h-4 w-4" />;
      case "Manuel":
        return <IoBookOutline className="h-4 w-4" />;
      case "Revue":
        return <CiSearch className="h-4 w-4" />;
      default:
        return <LiaBookReaderSolid className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 border border-gray-300 rounded-2xl flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span>
            <LuBookText className="text-[16px]" />
          </span>
          <span className="py-1 px-2 text-white bg-black rounded-lg text-[10px]">
            {genre}
          </span>
        </span>
        <span
          className={`py-1 px-2 rounded-lg text-[10px] ${
            disponible ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {disponible ? "Disponible" : "Indisponible"}
        </span>
      </div>

      <span className="text-[16px] font-semibold">{titre}</span>
      <span className="text-[13px] text-gray-500 font-extralight">
        {auteur}
      </span>
      <div className="flex flex-col gap-2 mt-1 text-xs text-gray-500">
        <span>Genre: {genre}</span>
        <span className="text-gray-400">{emprunts || 0} emprunt(s)</span>
      </div>
      <div>
        <button
          onClick={disponible ? onEmprunter : onReserver}
          className={`flex gap-2.5 text-xs cursor-pointer items-center justify-center w-full rounded-lg p-1.5 transition-colors duration-200 ${
            disponible
              ? "text-white bg-black hover:bg-[#505050]"
              : "text-black bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {disponible ? (
            <>
              <LuBookOpen />
              Emprunter
            </>
          ) : (
            <>
              <FaRegHeart />
              Réserver
            </>
          )}
        </button>
      </div>
    </div>
  );
}
