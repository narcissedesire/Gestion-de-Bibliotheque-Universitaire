import React, { useState, useEffect } from "react";
import { AlertNotification, HeaderDash } from "../../components/card";
import { FaPlus } from "react-icons/fa6";
import ModalAjoutLivre from "../../components/ModalAjoutLivre";
import { useLibrairie } from "../../context/LibrairieContext";
import CardTableLivre from "../../components/livre/CardTableLivre";

export default function Livre() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterGenre, setFilterGenre] = useState("");
  const {
    allLivreSansFiltre,
    livreAll,
    fetchLivreAll,
    fetchLivreAllSansFiltre,
    limit,
    setLimit,
    page,
    setPage,
    totalPages,
    addLivre,
    updateLivre,
    deleteLivre,
  } = useLibrairie();

  useEffect(() => {
    fetchLivreAll();
    fetchLivreAllSansFiltre();
  }, [fetchLivreAll, fetchLivreAllSansFiltre, page, limit, filterGenre]);

  const [stats, setStats] = useState({
    Roman: { valeur: 0, desc: "Émotion, intrigue, fiction" },
    Revue: { valeur: 0, desc: "Actuel, visuel, périodique" },
    Manuel: { valeur: 0, desc: "Technique, pratique, guide" },
    Autre: { valeur: 0, desc: "Autre chose" },
  });

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

  const handleAddClick = () => setIsModalOpen(true);
  const handleFilter = (genre) => {
    setFilterGenre(genre);
    setPage(1);
  };
  const handleCloseModal = () => setIsModalOpen(false);
  const handleSaveBook = async (newBook) => {
    try {
      await addLivre(newBook);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du livre :", error);
      toast.error("Impossible d'ajouter le livre.");
    }
  };
  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    setPage(1);
  };

  const totalLivres = Object.values(stats).reduce(
    (sum, stat) => sum + stat.valeur,
    0
  );

  return (
    <div className="animate-fade-in p-4">
      <HeaderDash
        titre="Gestion des Livres"
        desc={`${totalLivres} livre(s) sur ${allLivreSansFiltre.length}`}
      >
        <button
          onClick={handleAddClick}
          className="border px-2 py-1 rounded-sm flex items-center gap-1.5 hover:bg-gray-200 transition duration-300 sm:px-3 sm:py-2"
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
              <img src={`/images/${genre.toLowerCase()}.png`} className="w-6" />
            }
            valeur={valeur}
            desc={desc}
            couleur={valeur < 5}
            onClick={() => handleFilter(genre)}
            className="cursor-pointer hover:shadow-lg transition-shadow"
          />
        ))}
      </div>
      <CardTableLivre
        filterGenre={filterGenre}
        updateLivre={updateLivre}
        deleteLivre={deleteLivre}
      />
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
