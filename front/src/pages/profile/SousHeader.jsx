import React, { useEffect } from "react";
import { AlertNotification } from "../../components/card";
import { useLibrairie } from "../../context/LibrairieContext";
import { LuBookCheck } from "react-icons/lu";

export default function SousHeader() {
  const {
    empruntsUser,
    fetchEmpruntsUser,
    token,
    user,
    fetchReservesUser,
    reserveUser,
  } = useLibrairie();
  useEffect(() => {
    fetchEmpruntsUser();
    fetchReservesUser();
  }, [token, user]);

  const nombreEmpruntActive = empruntsUser.filter(
    (emprunt) => emprunt.status === "En cours"
  ).length;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 border-b border-gray-300 pb-5 ">
      <AlertNotification
        titre="Emprunts actifs"
        icon={<LuBookCheck className="text-[16px]" />}
        valeur={nombreEmpruntActive}
        styleIcon="bg-[#A3BFFA] w-7 h-7 flex items-center justify-center rounded-full"
        desc="Livres actuellement empruntés"
      />

      <AlertNotification
        titre="Total emprunts"
        icon={<LuBookCheck className="text-[16px] text-green-600 " />}
        styleIcon="bg-[#A9CBA3] w-7 h-7 flex items-center justify-center rounded-full"
        valeur={empruntsUser.length || 0}
        desc="Total des livres empruntés"
      />

      <AlertNotification
        titre="Réservations"
        icon={<LuBookCheck className="text-[16px] text-[#ff7300]" />}
        valeur={reserveUser.length || 0}
        styleIcon="bg-[#F4A261] w-7 h-7 flex items-center justify-center rounded-full"
        desc="En file d'attente"
      />
    </div>
  );
}
