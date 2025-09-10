import React, { useEffect } from "react";
import { CardProfilReserve, HeaderDash } from "../../components/card";
import { useLibrairie } from "../../context/LibrairieContext";
import SousHeader from "./SousHeader";

export default function ReserveProfile() {
  const {
    fetchReservesUser,
    reserveUser,
    token,
    user,
    annuleResevation,
    reserverLivre,
  } = useLibrairie();
  useEffect(() => {
    fetchReservesUser();
  }, [token, user]);

  async function resveLivre(id) {
    await reserverLivre(id);
    await fetchReservesUser();
  }

  return (
    <>
      <HeaderDash
        titre="Suivi de vos réservations"
        desc="Retrouvez vos réservations en attente, celles actives et leur date de récupération prévue."
      />

      <SousHeader />
      <div className="p-3  gap-2.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
        {reserveUser.map((reserve) => (
          <div
            key={reserve.id}
            className="p-5 border border-gray-300 rounded-2xl w-full"
          >
            <CardProfilReserve
              dateReserve={new Date(
                reserve.date_reservation
              ).toLocaleDateString("fr-FR")}
              dateRecuperationPrevu={new Date(
                reserve.date_recuperation_prevue
              ).toLocaleDateString("fr-FR")}
              // dateRetour={emprunt.date_retour_prevue}
              status={reserve.status}
              durePrevu={reserve.duree_prevue}
              titreLivre={reserve.livre.titre}
              auteurLivre={reserve.livre.auteur}
              annuleResevation={() => annuleResevation(reserve.livre.id)}
              position={reserve.position_attente}
              reserverLivre={() => resveLivre(reserve.livre.id)}
            />
          </div>
        ))}
      </div>
    </>
  );
}
