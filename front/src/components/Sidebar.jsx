import React from "react";
import LiensSidebar from "./LiensSidebar";
import { IoHomeOutline } from "react-icons/io5";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlinePersonOutline } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";

export default function Sidebar({ openSidebar, setOpenSidebar }) {
  const handleLinkClick = () => {
    // if (window.innerWidth < 768) {
    setOpenSidebar(!openSidebar);
    // }
  };

  return (
    <>
      {/* Overlay (mobile) */}
      {openSidebar && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black/40 z-10"
          onClick={() => setOpenSidebar(false)}
        ></div>
      )}
      <div
        className={`bg-neutral shadow-2xl w-64 h-screen px-3 transition-all duration-300 z-20
        ${openSidebar ? "block" : "hidden"}
        md:${openSidebar ? "block" : "hidden"} 
        ${window.innerWidth < 768 ? "fixed" : "absolute md:static"}
      `}
      >
        {/* Header du sidebar */}
        <div className="flex items-center gap-2 py-3 border-b border-gray-200">
          <img src="/images/logo.png" alt="Logo" className="w-12" />
          <div>
            <h1 className="text-sm font-medium">Bibliothèque</h1>
            <p className="text-[11px] text-gray-500">Universitaire</p>
          </div>
        </div>

        {/* Liens */}
        <div>
          <LiensSidebar
            onClick={handleLinkClick}
            lien="/admin"
            icon={<IoHomeOutline />}
            titre="Tableau de bord"
          />
          <LiensSidebar
            lien="/admin/livre"
            icon={<HiOutlineBookOpen />}
            titre="Gestion des livres"
            onClick={handleLinkClick}
          />
          <LiensSidebar
            lien="/admin/utilisateur"
            icon={<FaRegUser />}
            titre="Gestion des users"
            // onClick={handleLinkClick}
          />
          <LiensSidebar
            lien="/admin/parametre"
            icon={<IoSettingsOutline />}
            titre="Parametre"
            onClick={handleLinkClick}
          />
        </div>
      </div>
    </>
  );
}
