import React, { useMemo } from "react";
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
  const { allLivreSansFiltre, emprunts, users, reservations, livrePopulaire } =
    useLibrairie();
  const today = new Date();
  console.log("livrePopulaire : ", livrePopulaire);

  // ✅ Calcul des stats de base
  const empruntRetard = emprunts.filter(
    (emprunt) =>
      new Date(emprunt.date_retour_prevue) < today &&
      emprunt.date_retour_reelle === null
  ).length;

  const totalLivres = allLivreSansFiltre.length || 0;
  const empruntsEnCours = emprunts.filter(
    (e) => e.status === "En cours"
  ).length;

  const tauxOccupation =
    totalLivres > 0
      ? ((empruntsEnCours / totalLivres) * 100).toFixed(1) + "%"
      : "0%";

  const reservationsActives = reservations.length || 0;

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // ✅ Répartition par type de livre
  const livresParType = useMemo(() => {
    const count = {};
    allLivreSansFiltre.forEach((livre) => {
      count[livre.genre] = (count[livre.genre] || 0) + 1;
    });
    return Object.entries(count).map(([name, value]) => ({ name, value }));
  }, [allLivreSansFiltre]);

  // ✅ Répartition des types d’utilisateurs
  const utilisateursParRole = useMemo(() => {
    const count = {};
    users.forEach((user) => {
      count[user.role] = (count[user.role] || 0) + 1;
    });
    return Object.entries(count).map(([name, value]) => ({ name, value }));
  }, [users]);

  // ✅ Activité des 7 derniers jours (emprunts)
  const activite7Jours = useMemo(() => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - i);
      return d.toISOString().slice(0, 10);
    }).reverse();

    const count = last7Days.map((date) => ({
      date,
      emprunts: emprunts.filter((e) => e.date_emprunt.startsWith(date)).length,
    }));
    return count;
  }, [emprunts]);

  // ✅ Livres les plus populaires
  const livresPopulaires = useMemo(() => {
    const count = {};
    livrePopulaire.forEach((e) => {
      const titre = e.livre?.titre || "Inconnu";
      count[titre] = (count[titre] || 0) + 1;
    });
    return Object.entries(count)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [livrePopulaire]);

  // ✅ Données Chart.js
  const dataLivresParType = {
    labels: livresParType.map((item) => item.name),
    datasets: [
      {
        data: livresParType.map((item) => item.value),
        backgroundColor: COLORS,
        borderWidth: 1,
      },
    ],
  };

  const dataUtilisateursParRole = {
    labels: utilisateursParRole.map((item) => item.name),
    datasets: [
      {
        data: utilisateursParRole.map((item) => item.value),
        backgroundColor: COLORS,
        borderWidth: 1,
      },
    ],
  };

  const dataActivite7Jours = {
    labels: activite7Jours.map((item) => item.date),
    datasets: [
      {
        label: "Emprunts",
        data: activite7Jours.map((item) => item.emprunts),
        backgroundColor: "#0088FE",
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

  return (
    <div className="mt-5">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Répartition par Type de Livre */}
        <CardStat
          titre="Répartition par Type de Livre"
          desc="Distribution des ouvrages dans la collection"
        >
          <div className="h-52">
            <Pie data={dataLivresParType} options={optionsPie} />
          </div>
        </CardStat>

        {/* Répartition des utilisateurs */}
        <CardStat
          titre="Types d'Utilisateurs"
          desc="Répartition des membres de la bibliothèque"
        >
          <div className="h-52">
            <Pie data={dataUtilisateursParRole} options={optionsPie} />
          </div>
        </CardStat>

        {/* Activité des 7 Derniers Jours */}
        <CardStat
          titre="Activité des 7 Derniers Jours"
          desc="Évolution des emprunts et retours"
        >
          <div className="h-52">
            <Bar data={dataActivite7Jours} options={optionsBar} />
          </div>
        </CardStat>

        {/* Livres les Plus Populaires */}
        <CardStat
          titre="Livres les Plus Populaires"
          desc="Top 5 des ouvrages les plus empruntés"
        >
          <div className="w-full h-[200px]">
            <Bar
              data={{
                labels: livresPopulaires.map((livre) => livre.name),
                datasets: [
                  {
                    label: "Nombre d'emprunts",
                    data: livresPopulaires.map((livre) => livre.value),
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                indexAxis: "y", // ✅ Rend le graphique horizontal
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: { enabled: true },
                  title: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 },
                  },
                },
              }}
            />
          </div>
        </CardStat>
      </div>

      {/* Alertes et notifications */}
      <div className="grid gap-6 md:grid-cols-3 mt-7">
        <AlertNotification
          titre="Emprunts en Retard"
          icon={
            <AlertCircle className="h-4 w-4 text-destructive text-[#d4183d]" />
          }
          valeur={empruntRetard}
          desc="Nécessitent un suivi"
          couleur={true}
        />

        <AlertNotification
          titre="Taux d'Occupation"
          icon={<Activity className="h-4 w-4 text-destructive" />}
          valeur={tauxOccupation}
          desc="Livres actuellement empruntés"
        />

        <AlertNotification
          titre="Réservations Actives"
          icon={<Clock className="h-4 w-4 text-destructive" />}
          valeur={reservationsActives}
          desc="En liste d'attente"
        />
      </div>
    </div>
  );
}
