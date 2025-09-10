import React, { useRef, useEffect, useCallback, useState } from "react";
import { useLibrairie } from "../../context/LibrairieContext";
import { toast } from "react-toastify";
import NavIcon from "../../components/NavIcon";
import CardLivre from "../../components/livre/CardLivre";
import Loading from "../Loading/Loading";

export default function Catalogue() {
  const {
    livreAll,
    fetchLivreAll,
    loading,
    emprunterLivre,
    reserverLivre,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
    genre,
    setGenre,
    disponibilite,
    setDisponibilite,
    limit,
    setLimit,
  } = useLibrairie();

  // Charger les livres uniquement pour cette page
  useEffect(() => {
    fetchLivreAll();
  }, [fetchLivreAll, page, search, genre, disponibilite, limit]);

  const handleEmprunter = useCallback(
    async (livreId) => {
      try {
        await emprunterLivre(livreId);
        toast.success("Livre emprunté avec succès !");
      } catch (error) {
        toast.error(error.message || "Erreur lors de l'emprunt du livre.");
      }
    },
    [emprunterLivre]
  );

  const handleReserver = useCallback(
    async (livreId) => {
      try {
        await reserverLivre(livreId);
        toast.success("Livre réservé avec succès !");
      } catch (error) {
        toast.error(error.message || "Erreur lors de la réservation du livre.");
      }
    },
    [reserverLivre]
  );

  // Handler pour changer la limite
  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    setPage(1); // Réinitialiser à la page 1 pour éviter des erreurs avec un numéro de page invalide
  };

  const [profile, setProfile] = useState(false); // État géré ici
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfile(false);
      }
    };

    if (profile) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profile]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (value.length >= 3) {
      setSearch(value);
      setPage(1);
    } else if (value.length === 0) {
      setSearch("");
      setPage(1);
    }
  };

  return (
    <div className="px-2 py-3 container mx-auto">
      <div className="flex items-center justify-between py-3 border-b border-gray-300">
        <div className="flex items-start gap-3">
          <div>
            <img src="/images/logo.png" className="w-10" />
          </div>
          <div className="flex flex-col items-start">
            <h1 className="text-sm sm:text-lg font-bold">
              Catalogue des Livres
            </h1>
            <p className="text-xs text-gray-400">
              Découvrez notre collection de {livreAll.length} livres
            </p>
          </div>
        </div>
        <div>
          <NavIcon
            setProfile={setProfile}
            profileMenuRef={profileMenuRef}
            profile={profile}
          />
        </div>
      </div>
      <div className="mt-4 flex gap-4">
        <input
          type="text"
          placeholder="Rechercher un livre..."
          // value={search}
          onChange={handleSearchChange}
          className="px-3 py-2 border rounded"
        />
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="">Tous les genres</option>
          <option value="Roman">Roman</option>
          <option value="Manuel">Manuel</option>
          <option value="Revue">Revue</option>
          <option value="Autre">Autre</option>
        </select>
        <select
          value={disponibilite}
          onChange={(e) => setDisponibilite(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="">Tous</option>
          <option value="true">Disponible</option>
          <option value="false">Indisponible</option>
        </select>
        <select
          value={limit}
          onChange={handleLimitChange}
          className="px-3 py-2 border rounded"
        >
          <option value="10">10 par page</option>
          <option value="20">20 par page</option>
          <option value="30">30 par page</option>
          <option value="50">50 par page</option>
        </select>
      </div>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {loading ? (
          <div className="col-span-full text-center py-10">
            <Loading />
          </div>
        ) : livreAll.length === 0 ? (
          <div className="col-span-full text-center py-10">
            Aucun livre disponible
          </div>
        ) : (
          livreAll.map((livre) => (
            <CardLivre
              key={livre.id}
              titre={livre.titre}
              auteur={livre.auteur}
              genre={livre.genre}
              disponible={livre.disponible}
              emprunts={livre.emprunts?.length || 0}
              onEmprunter={() => handleEmprunter(livre.id)}
              onReserver={() => handleReserver(livre.id)}
            />
          ))
        )}
      </div>
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Précédent
        </button>
        <span className="py-2">
          Page {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
