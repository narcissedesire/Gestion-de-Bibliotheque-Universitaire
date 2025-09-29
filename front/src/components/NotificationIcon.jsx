import React, { useState, useRef, useEffect } from "react";
import { IoNotificationsOutline } from "react-icons/io5";

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

// Notifications statiques
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

export default function NotificationIcon() {
  const [open, setOpen] = useState(false);
  const modalRef = useRef(null);

  // Fermer le modal quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const unreadCount = staticNotifications.filter((n) => !n.read).length;
  const latestNotifications = staticNotifications.slice(0, 5);

  return (
    <div className="relative">
      {/* Icône Notification */}
      <span
        onClick={() => setOpen(!open)}
        className="relative hover:bg-gray-200 p-2 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer"
      >
        {unreadCount > 0 && (
          <span className="absolute w-3.5 h-3.5 bg-red-500 text-white flex items-center justify-center text-[10px] rounded-full -top-0 right-1.5">
            {unreadCount}
          </span>
        )}
        <IoNotificationsOutline className="text-4xl" />
      </span>

      {/* Fenêtre modale */}
      {open && (
        <div
          ref={modalRef}
          className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-lg rounded-md z-50 overflow-hidden px-2"
        >
          <div className="p-2 border-b font-semibold text-gray-700">
            Notifications
          </div>
          <ul className="max-h-[400px]">
            {latestNotifications.map((notif) => (
              <li
                key={notif.id}
                className={`flex items-start gap-3 p-2 cursor-pointer border-b border-gray-200 mb-1 overflow-hidden ${
                  notif.read ? "bg-white" : "bg-gray-100"
                } hover:bg-gray-200`}
              >
                <img
                  src={notif.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">{notif.sender}</div>
                  <div className="text-xs text-gray-600 truncate">
                    {notif.message}
                  </div>
                  <div className="text-[11px] text-gray-400">
                    {formatDate(notif.date)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="p-2 border-t text-center">
            <button className="text-sm text-blue-600 hover:underline">
              Toutes les notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
