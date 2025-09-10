import React, { useEffect } from "react";
import { CardProfilEmprunt, HeaderDash } from "../../components/card";
import { useLibrairie } from "../../context/LibrairieContext";
import SousHeader from "./SousHeader";

export default function EmpruntProfile() {
  const { empruntsUser, fetchEmpruntsUser, token, user, returnLivre } =
    useLibrairie();
  useEffect(() => {
    fetchEmpruntsUser();
  }, [token, user]);
  return (
    <>
      <HeaderDash
        titre="Suivi de vos emprunts"
        desc="Visualisez vos emprunts en cours, les retours prévus et l’historique de vos lectures."
      />

      <SousHeader />
      <div className=" mt-5  gap-2.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
        {empruntsUser.map((emprunt) => (
          <div
            key={emprunt.id}
            className="p-5 border border-gray-300 rounded-2xl w-full"
          >
            <CardProfilEmprunt
              dateEmprunt={new Date(emprunt.date_emprunt).toLocaleDateString(
                "fr-FR"
              )}
              dateRetour={new Date(
                emprunt.date_retour_prevue
              ).toLocaleDateString("fr-FR")}
              // dateRetour={emprunt.date_retour_prevue}
              status={emprunt.status}
              dateRetourReel={new Date(
                emprunt.date_retour_reelle
              ).toLocaleDateString("fr-FR")}
              returnLivre={() => returnLivre(emprunt.id)}
              titreLivre={emprunt.livre.titre}
              auteurLivre={emprunt.livre.auteur}
            />
          </div>
        ))}
      </div>
    </>
  );
}
