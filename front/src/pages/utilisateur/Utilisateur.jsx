import React, { useEffect, useState } from "react";
import { HeaderDash } from "../../components/card";
import CardTableUser from "../../components/CardTableUser";
import { useLibrairie } from "../../context/LibrairieContext";
import { useAuth } from "../../context/AuthContext";

export default function Utilisateur() {
  const { fetchUsers, userAvecFiltre, limit, setLimit, page, setPage } =
    useLibrairie();
  const { token } = useAuth();

  // 👉 Ajout d’états pour gérer la sélection et la modale

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token, limit, page]);

  // 👉 Fonction appelée quand tu cliques sur "Modifier"

  return (
    <div className="animate-fade-in ">
      <HeaderDash
        titre="Gestion des Utilisateurs"
        desc={`${userAvecFiltre.length} utilisateur(s) enregistré(s)`}
      />
      <CardTableUser
        userAvecFiltre={userAvecFiltre}
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
      />
    </div>
  );
}
