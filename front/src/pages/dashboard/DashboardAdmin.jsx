import React, { useEffect } from "react";
import { GoBook } from "react-icons/go";
import { IoMdHeartEmpty } from "react-icons/io";
import { CiClock2 } from "react-icons/ci";
import Statistique from "../../components/Statistique";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { AlertNotification, HeaderDash } from "../../components/card";
import { useLibrairie } from "../../context/LibrairieContext";

export default function DashboardAdmin() {
  const {
    allLivreSansFiltre,
    fetchLivreAllSansFiltre,
    empruntsAll,
    reservationsSansFiltre,
    token,
    fetchReservationsSansFiltre,
    fetchAllEmprunts,
    user,
    getLivrePopulaire,
    fetchUserSansFiltre,
  } = useLibrairie();

  useEffect(() => {
    fetchLivreAllSansFiltre();
    fetchAllEmprunts();
    getLivrePopulaire();
    fetchReservationsSansFiltre();
    fetchUserSansFiltre();
  }, [token, user]);

  const livreDispo = allLivreSansFiltre?.filter(
    (dispo) => dispo.disponible === true
  ).length;

  const empruntRetard = empruntsAll.filter(
    (retard) =>
      retard.status === "En cours" && // encore non retourné
      new Date() > new Date(retard.date_retour_prevue)
  ).length;

  const reservationActive = reservationsSansFiltre.filter(
    (reserve) => reserve.status === "En attente"
  ).length;

  const empruntActif = empruntsAll.filter(
    (actif) => actif.status === "En cours"
  ).length;

  // DashboardAdmin.jsx (extrait)
  return (
    <div>
      <HeaderDash
        titre="Tableau de bord"
        desc="Vue d'ensemble des activités et performances"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AlertNotification
          titre="Total Livres"
          icon={<GoBook className="text-lg" />}
          valeur={allLivreSansFiltre?.length || 0}
          desc={`${livreDispo} disponibles`}
        />
        <AlertNotification
          titre="Retards"
          icon={<CiClock2 className="text-lg" />}
          valeur={empruntRetard}
          desc="Sanction"
        />
        <AlertNotification
          titre="Emprunts Actifs"
          icon={<MdOutlineCalendarMonth className="text-lg" />}
          valeur={empruntActif}
          desc=""
        />
        <AlertNotification
          titre="Réservations"
          icon={<IoMdHeartEmpty className="text-lg" />}
          valeur={reservationActive}
          desc="En attente"
        />
      </div>
      <div className="mt-6">
        <Statistique />
      </div>
    </div>
  );
}
