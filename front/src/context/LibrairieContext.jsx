import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const LibrairieContext = createContext();

export function LibrairieProvider({ children }) {
  const API_URL = "http://localhost:3000"; // À adapter selon ton backend

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
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [disponibilite, setDisponibilite] = useState("");
  const [message, setMessage] = useState();

  const { token, user } = useAuth();

  // Fonction pour récupérer tous les livres
  const fetchLivreAllSansFiltre = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/livres/findSansFiltre`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log("Fetch setAllLivreSansFiltre:", data);

      setAllLivreSansFiltre(data || []);
    } catch (error) {
      console.error("Erreur lors du fetch des livres :", error);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const users = await fetch(`${API_URL}/users/affiche_user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await users.json();
      console.log("data", data);
      setUserSansFiltre(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSansFiltre = async () => {
    setLoading(true);
    try {
      const users = await fetch(`${API_URL}/users/affiche-users-sans-filtre`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await users.json();
      console.log("user data", data);
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLivreAll = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit,
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
      const data = await res.json();
      console.log("Fetch LivreAll:", data);

      setLivreAll(data.data || []);
      setTotalPages(data.meta?.totalPages || 1);
    } catch (error) {
      console.error("Erreur lors du fetch des livres :", error);
    }
    setLoading(false);
  };

  const getLivrePopulaire = async () => {
    setLoading(true);
    try {
      const users = await fetch(`${API_URL}/livres/livre-populaires`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await users.json();
      console.log("livre data", data);
      setLivrePopulaire(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  console.log("livrePopulaire 2 : ", livrePopulaire);

  // Fonction pour ajouter un livre
  const addLivre = async (newLivre) => {
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
      const data = await res.json();
      if (res.ok) {
        fetchLivreAll(); // Rafraîchir la liste après ajout
        return data;
      } else {
        throw new Error(data.message || "Erreur lors de l'ajout du livre");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du livre :", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour modifier un livre
  const updateLivre = async (id, updatedLivre) => {
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
      const data = await res.json();
      if (res.ok) {
        fetchLivreAll(); // Rafraîchir la liste après mise à jour
        return data;
      } else {
        throw new Error(
          data.message || "Erreur lors de la modification du livre"
        );
      }
    } catch (error) {
      console.error("Erreur lors de la modification du livre :", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer un livre
  const deleteLivre = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/livres/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      if (res.ok) {
        fetchLivreAll(); // Rafraîchir la liste après suppression
        setMessage(res.message);
        console.log(res.message);
        return true;
      } else {
        const data = await res.json();
        throw new Error(
          data.message || "Erreur lors de la suppression du livre"
        );
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du livre :", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer tous les emprunts
  const fetchEmprunts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/emprunts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setEmprunts(data.data || []);
    } catch (error) {
      console.error("Erreur lors du fetch des emprunts :", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmpruntsUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/emprunts/emprunts-users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log(data);
      setEmpruntsUser(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllEmprunts = async function () {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/emprunts/allEmprunts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log("all emprunt :  ", data);
      setEmpruntsAll(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer toutes les réservations
  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/reservations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setReservations(data.data || []);
    } catch (error) {
      console.error("Erreur lors du fetch des réservations :", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservationsSansFiltre = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/reservations/affiche-sans-filtres`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setReservationsSansFiltre(data.data || []);
    } catch (error) {
      console.error("Erreur lors du fetch des réservations :", error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer toutes les notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/notifications`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setNotifications(data.data || []);
    } catch (error) {
      console.error("Erreur lors du fetch des notifications :", error);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour initialiser les données
  useEffect(() => {
    if (token && user) {
      fetchLivreAll();
      fetchEmprunts();
      fetchReservations();
      fetchNotifications();
      fetchLivreAllSansFiltre();
      fetchAllEmprunts();
      fetchReservationsSansFiltre();
      fetchEmpruntsUser();
      fetchUsers();
      fetchUserSansFiltre();
      getLivrePopulaire();
    }
  }, [user, token, page, limit, search, genre, disponibilite]);

  return (
    <LibrairieContext.Provider
      value={{
        message,
        livreAll,
        emprunts,
        reservations,
        notifications,
        fetchLivreAll,
        addLivre,
        updateLivre,
        deleteLivre,
        fetchEmprunts,
        fetchReservations,
        fetchNotifications,
        loading,
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
        setReservationsSansFiltre,
        users,
        empruntsUser,
        userSansFiltre,
        livrePopulaire,
      }}
    >
      {children}
    </LibrairieContext.Provider>
  );
}

export const useLibrairie = () => useContext(LibrairieContext);
