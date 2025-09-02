import React from "react";
import { GoBook } from "react-icons/go";
import { IoMdHeartEmpty } from "react-icons/io";
import { CiClock2 } from "react-icons/ci";
import Statistique from "../../components/Statistique";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { AlertNotification, HeaderDash } from "../../components/card";
import { useLibrairie } from "../../context/LibrairieContext";

export default function DashboardAdmin() {
  const { allLivreSansFiltre, emprunts, reservationsSansFiltre } =
    useLibrairie();
  console.log("allLivreSansFiltre : ", allLivreSansFiltre);
  const livreDispo = allLivreSansFiltre?.filter(
    (dispo) => dispo.disponible === true
  ).length;

  const empruntRetard = emprunts.filter(
    (retard) => retard.date_emprunt > retard.date_retour_prevue
  ).length;

  const reservationActive = reservationsSansFiltre.filter(
    (reserve) => reserve.status === "Active"
  ).length;

  const empruntActif = emprunts.filter(
    (actif) => actif.status === "EN_COURS"
  ).length;
  // console.log("mdande :", empruntRetard);
  return (
    <div>
      <HeaderDash
        titre="Tableau de bord"
        desc="Vue d'ensemble des activités et performances"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
        <AlertNotification
          titre="Total Livres"
          icon={<GoBook className="text-[16px]" />}
          valeur={allLivreSansFiltre?.length || 0}
          desc={`${livreDispo} disponibles`}
        />
        <AlertNotification
          titre="Retards"
          icon={<CiClock2 className="text-[16px]" />}
          valeur={empruntRetard}
          desc="Saction"
        />
        <AlertNotification
          titre="Emprunts Actifs"
          icon={<MdOutlineCalendarMonth className="text-[16px]" />}
          valeur={empruntActif}
          desc=""
        />
        <AlertNotification
          titre="Réservations"
          icon={<IoMdHeartEmpty className="text-[16px]" />}
          valeur={reservationActive}
          desc="En attente"
        />
      </div>
      <div className="">
        <Statistique />
      </div>
    </div>
  );
}
