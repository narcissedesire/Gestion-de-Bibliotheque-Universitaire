import React from "react";
import { NavLink } from "react-router-dom";

export default function LiensSidebar({ lien, icon, titre }) {
  return (
    <NavLink
      to={lien}
      className={({ isActive }) =>
        `flex items-center gap-3 p-2 my-2 text-sm font-medium rounded-lg ${
          isActive
            ? "bg-gray-300 text-gray-900"
            : "text-gray-700 hover:bg-gray-200"
        }`
      }
      end={lien === "/admin" || lien === "/profile"}
    >
      <span>{icon}</span>
      <span className="whitespace-nowrap">{titre}</span>
    </NavLink>
  );
}
