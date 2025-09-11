import React from "react";
import { FiLogOut } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdOutlinePersonOutline } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavIcon({ setProfile, profileMenuRef, profile }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Vérifie si on est dans admin ou profile
  const isAdminPage = location.pathname.startsWith("/admin");
  const isProfilePage = location.pathname.startsWith("/profile");

  // Détermine la cible du lien uniquement si user existe
  const linkTarget = user
    ? isAdminPage || isProfilePage
      ? "/"
      : user.type === "Admin"
      ? "/admin"
      : "/profile"
    : "/"; // Valeur par défaut si user est null

  // Détermine le texte du lien uniquement si user existe
  const linkLabel = user
    ? isAdminPage || isProfilePage
      ? "Catalogue"
      : user.type === "Admin"
      ? "Dashboard"
      : "Mon Profil"
    : "Catalogue"; // Valeur par défaut si user est null

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex items-center gap-5">
      {/* Notifications */}
      <span className="relative hover:bg-gray-200 p-2 w-7 h-7 flex items-center justify-center rounded-full cursor-pointer">
        <span className="absolute w-3.5 h-3.5 bg-red-500 text-white flex items-center justify-center text-[10px] rounded-full -top-1 -right-0.5">
          2
        </span>
        <span>
          <IoNotificationsOutline className="text-2xl" />
        </span>
      </span>

      {/* Profil menu */}
      <span className="relative">
        <img
          src="/images/profile.jpg"
          alt="Avatar"
          className="w-7 h-7 border rounded-full cursor-pointer"
          onClick={() => setProfile(!profile)}
        />
        {profile && (
          <div
            ref={profileMenuRef}
            className="border absolute border-gray-200 bg-white shadow right-0 top-10 rounded-sm min-w-40 z-50"
          >
            <div className="flex flex-col items-start border-b border-gray-300 p-1.5">
              <h2 className="text-sm font-medium">{user?.nom}</h2>
              <p className="text-[11px] text-gray-400 -mt-0.5">{user?.email}</p>
              <p className="text-[11px] text-gray-400 -mt-0.5">{user?.type}</p>
            </div>
            <Link
              to={linkTarget}
              className="flex items-center justify-start gap-3.5 p-1.5 border-b border-gray-500 hover:bg-gray-100"
            >
              <span className="text-3xl">
                <MdOutlinePersonOutline className="text-lg" />
              </span>
              <span>{linkLabel}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="cursor-pointer flex items-center justify-start gap-3.5 p-1.5 hover:bg-gray-100 w-full text-left"
            >
              <span className="text-3xl">
                <FiLogOut className="text-lg" />
              </span>
              <span>Déconnexion</span>
            </button>
          </div>
        )}
      </span>
    </div>
  );
}
