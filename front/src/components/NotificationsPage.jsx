import React from "react";

// Fonction pour formater la date
const formatDate = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 5 * 86400) return `${Math.floor(diff / 86400)}j`;

  if (now.getFullYear() === date.getFullYear()) {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  }

  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Notifications statiques (exemple)
const staticNotifications = [
  {
    id: 1,
    sender: "Admin",
    avatar: "/images/profile.jpg",
    message: "Nouvelle mise à jour du système disponible.",
    date: new Date(Date.now() - 30 * 1000).toISOString(),
    read: false,
  },
  {
    id: 2,
    sender: "Admin",
    avatar: "/images/profile.jpg",
    message: "Votre mot de passe a été modifié avec succès.",
    date: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: 3,
    sender: "Support",
    avatar: "/images/profile.jpg",
    message: "Nouvelle fonctionnalité disponible dans votre espace.",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: 4,
    sender: "Admin",
    avatar: "/images/profile.jpg",
    message: "N'oubliez pas de vérifier vos informations.",
    date: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: 5,
    sender: "System",
    avatar: "/images/profile.jpg",
    message: "Maintenance prévue demain soir.",
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
];

export default function NotificationsPage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Toutes les notifications</h1>

      <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md bg-white shadow-sm">
        {staticNotifications.map((notif) => (
          <li
            key={notif.id}
            className={`flex items-start gap-3 p-3 cursor-pointer ${
              notif.read ? "bg-white" : "bg-gray-100"
            } hover:bg-gray-50`}
          >
            <img
              src={notif.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full border"
            />
            <div className="flex-1">
              <div className="text-sm font-medium">{notif.sender}</div>
              <div className="text-xs text-gray-600">{notif.message}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">
                {formatDate(notif.date)}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
