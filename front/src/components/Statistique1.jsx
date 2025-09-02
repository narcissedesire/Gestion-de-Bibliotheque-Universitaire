import React, { useMemo } from "react";
import { Activity, Clock, AlertCircle } from "lucide-react";
import { AlertNotification, CardStat } from "./card";
import { useLibrairie } from "../context/LibrairieContext";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Statistique() {
  const { allLivreSansFiltre, emprunts, users, reservations } = useLibrairie();
  console.log("user : ", users);
  const today = new Date();
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
    emprunts.forEach((e) => {
      const titre = e.livre?.titre || "Inconnu";
      count[titre] = (count[titre] || 0) + 1;
    });
    return Object.entries(count)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [emprunts]);

  return (
    <div className="mt-5">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Répartition par Type de Livre */}
        <CardStat
          titre="Répartition par Type de Livre"
          desc="Distribution des ouvrages dans la collection"
        >
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={livresParType}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {livresParType.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </CardStat>

        {/* Répartition des utilisateurs */}
        <CardStat
          titre="Types d'Utilisateurs"
          desc="Répartition des membres de la bibliothèque"
        >
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={utilisateursParRole}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {utilisateursParRole.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </CardStat>

        {/* Activité des 7 Derniers Jours */}
        <CardStat
          titre="Activité des 7 Derniers Jours"
          desc="Évolution des emprunts et retours"
        >
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={activite7Jours}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="emprunts" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </CardStat>

        {/* Livres les Plus Populaires */}
        <CardStat
          titre="Livres les Plus Populaires"
          desc="Top 5 des ouvrages les plus empruntés"
        >
          <ul className="text-sm">
            {livresPopulaires.map((livre, index) => (
              <li key={index} className="flex justify-between border-b py-1">
                <span>{livre.name}</span>
                <span>{livre.value} emprunts</span>
              </li>
            ))}
          </ul>
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
