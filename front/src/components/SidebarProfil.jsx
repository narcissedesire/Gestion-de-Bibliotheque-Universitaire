import React from "react";
import LiensSidebar from "./LiensSidebar";
import { IoHomeOutline } from "react-icons/io5";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { useSidebar } from "../context/SidebarContext";
import { ImProfile } from "react-icons/im";
import { MdOutlineFactCheck } from "react-icons/md";

export default function SidebarProfil() {
  const { openSidebar, setOpenSidebar } = useSidebar();

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) setOpenSidebar(false); // Ferme la sidebar sur clic de lien en dessous de 1024px
  };

  return (
    <>
      {/* Overlay pour fermer la sidebar sur mobile/tablette */}
      {openSidebar && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black/40 z-10"
          onClick={() => setOpenSidebar(false)}
        ></div>
      )}
      <div
        className={`bg-neutral shadow-2xl h-screen px-3 transition-all duration-300 z-20 ${
          // Afficher uniquement si openSidebar est true en dessous de 1024px, sinon toujours visible à partir de lg
          window.innerWidth < 1024
            ? openSidebar
              ? "block"
              : "hidden"
            : "block"
        } lg:static lg:w-64 ${
          window.innerWidth < 1024 ? "fixed w-64" : "absolute lg:sticky top-0"
        }`}
      >
        <div className="flex items-center gap-2 py-3 border-b border-gray-200">
          <img src="/images/logo.png" alt="Logo" className="w-12" />
          <div>
            <h1 className="text-sm font-medium">Bibliothèque</h1>
            <p className="text-[11px] text-gray-500">Universitaire</p>
          </div>
        </div>
        <div>
          <LiensSidebar
            onClick={handleLinkClick}
            lien="/profile"
            icon={<ImProfile />}
            titre="Profile"
          />
          <LiensSidebar
            lien="/profile/emprunt"
            icon={<HiOutlineBookOpen />}
            titre="Emprunts"
            onClick={handleLinkClick}
          />
          <LiensSidebar
            lien="/profile/reservation"
            icon={<MdOutlineFactCheck />}
            titre="Reservation"
            // onClick={handleLinkClick}
          />
          <LiensSidebar
            lien="/profile/parametre"
            icon={<IoSettingsOutline />}
            titre="Parametre"
            onClick={handleLinkClick}
          />
        </div>
      </div>
    </>
  );
}
