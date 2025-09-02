import React, { useState, useEffect } from "react";
import { AlertNotification, HeaderDash } from "../../components/card";
import { FaPlus } from "react-icons/fa6";
import ModalAjoutLivre from "../../components/ModalAjoutLivre";
import { useLibrairie } from "../../context/LibrairieContext";
import CardTableLivre from "../../components/livre/CardTableLivre";

export default function Livre() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterGenre, setFilterGenre] = useState("");
  const { allLivreSansFiltre, livreAll } = useLibrairie();

  console.log("All livre de merde : ", allLivreSansFiltre);

  const [stats, setStats] = useState({
    Roman: { valeur: 0, desc: "Émotion, intrigue, fiction" },
    Revue: { valeur: 0, desc: "Actuel, visuel, périodique" },
    Manuel: { valeur: 0, desc: "Technique, pratique, guide" },
    Autre: { valeur: 0, desc: "Autre chose" },
  });

  // ✅ Recalcule stats quand livreAll change
  useEffect(() => {
    const roman =
      allLivreSansFiltre?.filter((livre) => livre.genre === "Roman").length ||
      0;
    const revue =
      allLivreSansFiltre?.filter((livre) => livre.genre === "Revue").length ||
      0;
    const manuel =
      allLivreSansFiltre?.filter((livre) => livre.genre === "Manuel").length ||
      0;
    const autre =
      allLivreSansFiltre?.filter((livre) => livre.genre === "Autre").length ||
      0;

    setStats({
      Roman: { valeur: roman, desc: "Émotion, intrigue, fiction" },
      Revue: { valeur: revue, desc: "Actuel, visuel, périodique" },
      Manuel: { valeur: manuel, desc: "Technique, pratique, guide" },
      Autre: { valeur: autre, desc: "Autre chose" },
    });
  }, [allLivreSansFiltre]);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleFilter = (genre) => {
    setFilterGenre(genre);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveBook = (newBook) => {
    console.log("Nouveau livre ajouté :", newBook);
    setIsModalOpen(false);
    // ⚠️ Pas besoin de modifier stats ici, car il sera recalculé via livreAll
  };

  const totalLivres = Object.values(stats).reduce(
    (sum, stat) => sum + stat.valeur,
    0
  );

  return (
    <div className="animate-fade-in">
      <HeaderDash
        titre="Gestion des Livres"
        desc={`${totalLivres} livre(s) sur ${allLivreSansFiltre.length}`}
      >
        <button
          onClick={handleAddClick}
          className="border px-2 py-1 rounded-sm cursor-pointer flex items-center gap-1.5 hover:bg-gray-200 transition duration-300"
        >
          <FaPlus />
          Ajouter
        </button>
      </HeaderDash>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        {Object.entries(stats).map(([genre, { valeur, desc }]) => (
          <AlertNotification
            key={genre}
            titre={genre}
            icon={
              <img
                src={`/images/${genre.toLowerCase()}.png`}
                className="text-[16px] w-6"
              />
            }
            valeur={valeur}
            desc={desc}
            couleur={valeur < 5}
            onClick={() => handleFilter(genre)}
            className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
          />
        ))}
      </div>
      <CardTableLivre filterGenre={filterGenre} />
      {isModalOpen && (
        <ModalAjoutLivre
          onClose={handleCloseModal}
          onSave={handleSaveBook}
          genres={Object.keys(stats)}
        />
      )}
    </div>
  );
}
