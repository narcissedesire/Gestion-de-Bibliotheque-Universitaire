import React, { useEffect, useMemo } from "react";
import { Activity, Clock, AlertCircle } from "lucide-react";
import { AlertNotification, CardStat } from "./card";
import { useLibrairie } from "../context/LibrairieContext";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function Statistique() {
  const {
    allLivreSansFiltre,
    empruntsAll,
    users,
    reservationsSansFiltre,
    livrePopulaire,
  } = useLibrairie();

  const today = new Date();

  const empruntRetard = useMemo(() => {
    return empruntsAll.filter(
      (emprunt) =>
        new Date(emprunt.date_retour_prevue) < today &&
        emprunt.date_retour_reelle === null
    ).length;
  }, [empruntsAll]);

  const totalLivres = allLivreSansFiltre.length || 0;
  const empruntsEnCours = useMemo(() => {
    return empruntsAll.filter((e) => e.status === "EN_COURS").length;
  }, [empruntsAll]);

  const tauxOccupation = useMemo(() => {
    return totalLivres > 0
      ? ((empruntsEnCours / totalLivres) * 100).toFixed(1) + "%"
      : "0%";
  }, [empruntsEnCours, totalLivres]);

  const reservationsActives = useMemo(() => {
    return reservationsSansFiltre.filter(
      (r) => r.status === "ACTIVE" || r.status === "EN_ATTENTE"
    ).length;
  }, [reservationsSansFiltre]);

  const livresParType = useMemo(() => {
    const count = {};
    allLivreSansFiltre.forEach((livre) => {
      count[livre.genre] = (count[livre.genre] || 0) + 1;
    });
    return Object.entries(count).map(([name, value]) => ({ name, value }));
  }, [allLivreSansFiltre]);

  // 🎨 Définition des couleurs par rôle
  const ROLE_COLORS = {
    Etudiant: "#2A9D8F", // vert menthe
    Professeur: "#F4A261", // orange
    Admin: "#1D3557", // bleu foncé
  };

  const utilisateursParRole = useMemo(() => {
    const count = {};

    users.forEach((user) => {
      count[user.type] = (count[user.type] || 0) + 1;
    });

    return Object.entries(count).map(([name, value]) => ({
      name,
      value,
      color: ROLE_COLORS[name] || "#808080", // gris si pas trouvé
    }));
  }, [users]);

  const activite7Jours = useMemo(() => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - i);
      return d.toISOString().slice(0, 10);
    }).reverse();

    return last7Days.map((date) => ({
      date,
      empruntsAll: empruntsAll.filter(
        (e) => new Date(e.date_emprunt).toISOString().slice(0, 10) === date
      ).length,
    }));
  }, [empruntsAll]);

  const livresPopulaires = useMemo(() => {
    if (!livrePopulaire.length) return [];
    const count = {};
    livrePopulaire.forEach((e) => {
      const titre = e.titre || "Inconnu";
      count[titre] = (count[titre] || 0) + (e.popularity || 0);
    });
    return Object.entries(count)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [livrePopulaire]);

  const dataLivresParType = {
    labels: livresParType.length
      ? livresParType.map((item) => item.name)
      : ["Aucun livre"],
    datasets: [
      {
        data: livresParType.length
          ? livresParType.map((item) => item.value)
          : [1],
        backgroundColor: livresParType.length
          ? ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#808080"]
          : ["#808080"],
        borderWidth: 1,
      },
    ],
  };

  const dataUtilisateursParRole = {
    labels: utilisateursParRole.length
      ? utilisateursParRole.map((item) => item.name)
      : ["Aucun utilisateur"],
    datasets: [
      {
        data: utilisateursParRole.length
          ? utilisateursParRole.map((item) => item.value)
          : [1],
        backgroundColor: utilisateursParRole.length
          ? utilisateursParRole.map((item) => item.color)
          : ["#808080"],
        borderWidth: 1,
      },
    ],
  };

  const dataActivite7Jours = {
    labels: activite7Jours.map((item) => item.date),
    datasets: [
      {
        label: "Emprunts",
        data: activite7Jours.map((item) => item.empruntsAll),
        backgroundColor: "#0088FE",
      },
    ],
  };

  const dataLivresPopulaires = {
    labels: livresPopulaires.length
      ? livresPopulaires.map((livre) => livre.name)
      : ["Aucun livre"],
    datasets: [
      {
        label: "Popularité (Emprunts + Réservations)",
        data: livresPopulaires.length
          ? livresPopulaires.map((livre) => livre.value)
          : [0],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const optionsPie = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}`,
        },
      },
    },
  };

  const optionsBar = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#f0f0f0" } },
    },
  };

  const optionsBarHorizontal = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      title: { display: false },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div className="mt-5">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <CardStat
          titre="Répartition par Type de Livre"
          desc="Distribution des ouvrages dans la collection"
        >
          <div className="h-52">
            <Pie data={dataLivresParType} options={optionsPie} />
          </div>
        </CardStat>

        <CardStat
          titre="Types d'Utilisateurs"
          desc="Répartition des membres de la bibliothèque"
        >
          <div className="h-52">
            <Pie data={dataUtilisateursParRole} options={optionsPie} />
          </div>
        </CardStat>

        <CardStat
          titre="Activité des 7 Derniers Jours"
          desc="Évolution des emprunts"
        >
          <div className="h-52">
            <Bar data={dataActivite7Jours} options={optionsBar} />
          </div>
        </CardStat>

        <CardStat
          titre="Livres les Plus Populaires"
          desc="Top 5 des ouvrages les plus empruntés et réservés"
        >
          <div className="w-full h-[200px]">
            <Bar data={dataLivresPopulaires} options={optionsBarHorizontal} />
          </div>
        </CardStat>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mt-7">
        <AlertNotification
          titre="Emprunts en Retard"
          icon={<AlertCircle className="h-4 w-4 text-[#d4183d]" />}
          valeur={empruntRetard}
          desc="Nécessitent un suivi"
          couleur={empruntRetard > 0}
        />
        <AlertNotification
          titre="Taux d'Occupation"
          icon={<Activity className="h-4 w-4 text-[#d4183d]" />}
          valeur={tauxOccupation}
          desc="Livres actuellement empruntés"
        />
        <AlertNotification
          titre="Réservations Actives"
          icon={<Clock className="h-4 w-4 text-[#d4183d]" />}
          valeur={reservationsActives}
          desc="En liste d'attente"
        />
      </div>
    </div>
  );
}
