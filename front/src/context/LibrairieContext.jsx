import { createContext, useCallback, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import { API_URL } from "../../API_URL";

const LibrairieContext = createContext();

export function LibrairieProvider({ children }) {
  // const API_URL = "https://gestion-de-bibliotheque-universitaire.onrender.com/";

  const [livreAll, setLivreAll] = useState([]);
  const [livrePopulaire, setLivrePopulaire] = useState([]);
  const [emprunts, setEmprunts] = useState([]);
  const [empruntsAll, setEmpruntsAll] = useState([]);
  const [empruntsUser, setEmpruntsUser] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reservationsSansFiltre, setReservationsSansFiltre] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allLivreSansFiltre, setAllLivreSansFiltre] = useState([]);
  const [users, setUsers] = useState([]);
  const [userSansFiltre, setUserSansFiltre] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [disponibilite, setDisponibilite] = useState("");
  const [message, setMessage] = useState();
  const [reserveUser, setReserveUser] = useState([]);

  const { token, user } = useAuth();

  const fetchLivreAllSansFiltre = useCallback(async () => {
    if (!token || !user) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/livres/findSansFiltre`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok)
        throw new Error(`Erreur HTTP ${res.status}: ${await res.text()}`);
      const data = await res.json();
      setAllLivreSansFiltre(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Erreur lors du fetch des livres sans filtre :", error);
      toast.error("Erreur lors du chargement des livres sans filtre");
      setAllLivreSansFiltre([]);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  const fetchUsers = useCallback(async () => {
    if (!token || !user) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/affiche_user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok)
        throw new Error(`Erreur HTTP ${res.status}: ${await res.text()}`);
      const data = await res.json();
      console.log("data users:", data);
      setUserSansFiltre(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Erreur lors du fetch des utilisateurs :", error);
      toast.error("Erreur lors du chargement des utilisateurs");
      setUserSansFiltre([]);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  const fetchUserSansFiltre = useCallback(async () => {
    if (!token || !user) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/affiche-users-sans-filtre`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("donne azo : ", res);
      if (!res.ok) {
        throw new Error(`Erreur HTTP ${res.status}: ${await res.text()}`);
      }
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(
        "Erreur lors du fetch des utilisateurs sans filtre :",
        error
      );
      toast.error("Erreur lors du chargement des utilisateurs");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  const fetchLivreAll = useCallback(async () => {
    if (!token || !user) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        type: genre || "",
        disponible: disponibilite || "",
      });
      const res = await fetch(
        `${API_URL}/livres/findAll?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erreur HTTP ${res.status}: ${errorText}`);
      }
      const data = await res.json();
      setLivreAll(Array.isArray(data) ? data : data.data || []);
      setTotalPages(Number(data.totalPages) || 1);
    } catch (error) {
      console.error("Erreur lors du fetch des livres :", error);
      toast.error(
        error.message.includes("ERR_CONNECTION_REFUSED")
          ? "Impossible de se connecter au serveur. Vérifiez si le backend est en cours d'exécution."
          : `Erreur lors du chargement des livres : ${error.message}`
      );
      setLivreAll([]);
    } finally {
      setLoading(false);
    }
  }, [token, user, page, limit, search, genre, disponibilite]);

  const getLivrePopulaire = useCallback(async () => {
    if (!token || !user) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/livres/livre-populaires`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok)
        throw new Error(`Erreur HTTP ${res.status}: ${await res.text()}`);
      const data = await res.json();
      setLivrePopulaire(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Erreur lors du fetch des livres populaires :", error);
      toast.error("Erreur lors du chargement des livres populaires");
      setLivrePopulaire([]);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  const addLivre = useCallback(
    async (newLivre) => {
      if (!token || !user) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/livres/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newLivre),
        });
        if (!res.ok)
          throw new Error(`Erreur HTTP ${res.status}: ${await res.text()}`);
        const data = await res.json();
        // Mettre à jour les états localement
        setAllLivreSansFiltre((prev) => [...prev, data]);
        fetchLivreAll(); // Recharger livreAll pour respecter la pagination/filtres
        toast.success("Livre ajouté avec succès !");
        return data;
      } catch (error) {
        console.error("Erreur lors de l'ajout du livre :", error);
        toast.error(error.message || "Erreur lors de l'ajout du livre");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token, user, fetchLivreAll]
  );

  const updateLivre = useCallback(
    async (id, updatedLivre) => {
      if (!token || !user) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/livres/update/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedLivre),
        });
        if (!res.ok)
          throw new Error(`Erreur HTTP ${res.status}: ${await res.text()}`);
        const updatedData = await res.json();
        console.log("Réponse du backend pour updateLivre :", updatedData);

        const dataToUpdate =
          updatedData && updatedData.id ? updatedData : { id, ...updatedLivre };

        setLivreAll((prev) =>
          prev.map((livre) =>
            livre.id === id ? { ...livre, ...dataToUpdate } : livre
          )
        );

        setAllLivreSansFiltre((prev) =>
          prev.map((livre) =>
            livre.id === id ? { ...livre, ...dataToUpdate } : livre
          )
        );

        // Mettre à jour livrePopulaire si le titre ou la disponibilité change
        if (updatedLivre.titre || updatedLivre.disponible !== undefined) {
          setLivrePopulaire((prev) =>
            prev.map((livre) =>
              livre.id === id
                ? {
                    ...livre,
                    ...dataToUpdate,
                    empruntCount: livre.empruntCount,
                    reservationCount: livre.reservationCount,
                    popularity: livre.popularity,
                  }
                : livre
            )
          );
        }

        toast.success("Livre modifié avec succès !");
        return dataToUpdate;
      } catch (error) {
        console.error("Erreur lors de la modification du livre :", error);
        toast.error(error.message || "Erreur lors de la modification du livre");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token, user]
  );

  const deleteLivre = useCallback(
    async (id) => {
      if (!token || !user) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/livres/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Erreur HTTP ${res.status}: ${errorText}`);
        }
        const response = await res.json();
        if (!response.result) {
          throw new Error(response.message || "Erreur lors de la suppression");
        }

        setLivreAll((prev) => prev.filter((livre) => livre.id !== id));
        setAllLivreSansFiltre((prev) =>
          prev.filter((livre) => livre.id !== id)
        );
        setEmpruntsAll((prev) =>
          prev.filter((emprunt) => emprunt.livre?.id !== id)
        );
        setReservationsSansFiltre((prev) =>
          prev.filter((reservation) => reservation.livre?.id !== id)
        );
        setLivrePopulaire((prev) => prev.filter((livre) => livre.id !== id));

        // Ajuster totalPages si nécessaire
        if (livreAll.length <= limit && page > 1) {
          setPage((prev) => Math.max(prev - 1, 1));
        }
        setTotalPages((prev) =>
          Math.max(1, Math.ceil((prev * limit - 1) / limit))
        );

        setMessage("Livre supprimé avec succès");
        toast.success("Livre supprimé avec succès !");
        return true;
      } catch (error) {
        console.error("Erreur lors de la suppression du livre :", error);
        toast.error(error.message || "Erreur lors de la suppression du livre");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token, user, livreAll, limit, page]
  );

  const fetchEmpruntsUser = useCallback(async () => {
    if (!token || !user) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/emprunts/emprunts-users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok)
        throw new Error(`Erreur HTTP ${res.status}: ${await res.text()}`);
      const data = await res.json();
      setEmpruntsUser(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Erreur lors du fetch des emprunts utilisateur :", error);
      toast.error("Erreur lors du chargement des emprunts utilisateur");
      setEmpruntsUser([]);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  const fetchReservesUser = useCallback(async () => {
    if (!token || !user) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/reservations/reserve-users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok)
        throw new Error(`Erreur HTTP ${res.status}: ${await res.text()}`);
      const data = await res.json();
      setReserveUser(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error(
        "Erreur lors du fetch des reservation utilisateur :",
        error
      );
      toast.error("Erreur lors du chargement des reservation utilisateur");
      setReserveUser([]);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  const returnLivre = useCallback(
    async (id) => {
      if (!token || !user) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/emprunts/return-livre/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error(`Erreur HTTP ${res.status}: ${await res.text()}`);
        }
        fetchEmpruntsUser();
        // const retour = await res.json();
      } catch (error) {
        console.error("Erreur lors du retour du livre :", error);
        toast.error("Erreur lors du retour du livre");
      }
    },
    [token, user]
  );

  const fetchAllEmprunts = useCallback(async () => {
    if (!token || !user) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/emprunts/allEmprunts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok)
        throw new Error(`Erreur HTTP ${res.status}: ${await res.text()}`);
      const data = await res.json();
      setEmpruntsAll(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Erreur lors du fetch de tous les emprunts :", error);
      toast.error("Erreur lors du chargement de tous les emprunts");
      setEmpruntsAll([]);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  const emprunterLivre = useCallback(
    async (livreId) => {
      if (!livreId || !token || !user) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/emprunts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ livreId }),
        });
        if (!res.ok)
          throw new Error(`Erreur HTTP ${res.status}: ${await res.text()}`);
        const newEmprunt = await res.json();
        console.log("Emprent nouveau : ", newEmprunt);
        setEmpruntsAll((prev) => [...prev, newEmprunt]);
        setAllLivreSansFiltre((prev) =>
          prev.map((livre) =>
            livre.id === livreId ? { ...livre, disponible: false } : livre
          )
        );
        setLivreAll((prev) =>
          prev.map((livre) =>
            livre.id === livreId ? { ...livre, disponible: false } : livre
          )
        );
        toast.success("Livre emprunté avec succès !");
        return true;
      } catch (error) {
        console.error("Erreur lors de l'emprunt :", error);
        toast.error(error.message || "Erreur lors de l'emprunt");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token, user]
  );

  const reserverLivre = useCallback(
    async (livreId) => {
      if (!livreId || !token || !user) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/reservations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ livreId }),
        });
        if (!res.ok)
          throw new Error(`Erreur HTTP ${res.status}: ${await res.text()}`);
        const newReservation = await res.json();
        if (newReservation.result) {
          setReservationsSansFiltre((prev) => [...prev, newReservation.result]);
          toast.success("Livre réservé avec succès !");
          return true;
        } else {
          throw new Error(
            newReservation.message || "Erreur lors de la réservation"
          );
        }
      } catch (error) {
        console.error("Erreur lors de la réservation :", error);
        toast.error(error.message || "Erreur lors de la réservation");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token, user]
  );

  const annuleResevation = useCallback(
    async (id) => {
      if (!token || !user) return;
      setLoading(true);
      try {
        const res = await fetch(
          `${API_URL}/reservations/annule-reservation/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error(`Erreur HTTP ${res.status}: ${await res.text()}`);
        }
        fetchReservesUser();
        // const retour = await res.json();
      } catch (error) {
        console.error("Erreur lors du retour du livre :", error);
        toast.error("Erreur lors du retour du livre");
      }
    },
    [token, user]
  );

  const fetchReservationsSansFiltre = useCallback(async () => {
    if (!token || !user) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/reservations/affiche-sans-filtres`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok)
        throw new Error(`Erreur HTTP ${res.status}: ${await res.text()}`);
      const data = await res.json();
      setReservationsSansFiltre(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error(
        "Erreur lors du fetch des réservations sans filtre :",
        error
      );
      toast.error("Erreur lors du chargement des réservations sans filtre");
      setReservationsSansFiltre([]);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  return (
    <LibrairieContext.Provider
      value={{
        message,
        livreAll,
        emprunts,
        empruntsAll,
        reservations,
        notifications,
        fetchLivreAll,
        addLivre,
        updateLivre,
        deleteLivre,
        loading,
        setLoading,
        page,
        limit,
        totalPages,
        search,
        setSearch,
        setGenre,
        setDisponibilite,
        setPage,
        setLimit,
        genre,
        disponibilite,
        allLivreSansFiltre,
        setAllLivreSansFiltre,
        reservationsSansFiltre,
        users,
        empruntsUser,
        userSansFiltre,
        livrePopulaire,
        emprunterLivre,
        reserverLivre,
        getLivrePopulaire,
        fetchLivreAllSansFiltre,
        fetchAllEmprunts,
        fetchReservationsSansFiltre,
        fetchUsers,
        fetchUserSansFiltre,
        fetchEmpruntsUser,
        returnLivre,
        fetchReservesUser,
        reserveUser,
        annuleResevation,
      }}
    >
      {children}
    </LibrairieContext.Provider>
  );
}

export const useLibrairie = () => useContext(LibrairieContext);
