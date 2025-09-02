import { Link, Outlet, useNavigate } from "react-router-dom";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdOutlinePersonOutline } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout({ openSidebar, setOpenSidebar }) {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(false);
  const layoutRef = useRef(null);
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);

  // ✅ Fermer le menu uniquement si on clique en dehors du menu ET de l'avatar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfile(false);
      }
    };

    if (profile) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profile]);

  const handleClickOutsideLayout = () => {
    if (window.innerWidth < 768 && openSidebar) {
      setOpenSidebar(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-full" ref={layoutRef} onClick={handleClickOutsideLayout}>
      <div className="flex items-center px-3 justify-between border-b border-gray-300 bg-white shadow-sm h-12">
        <div className="flex items-center gap-3">
          <span
            className="cursor-pointer border p-0.5 rounded-md hover:bg-gray-200 ml-2"
            onClick={() => setOpenSidebar(!openSidebar)}
          >
            <HiOutlineMenuAlt2 />
          </span>
          <span className="">Bonjour {user?.nom}</span>
        </div>
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
              src="/images/logo.png"
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
                  <p className="text-[11px] text-gray-400 -mt-0.5">
                    {user?.email}
                  </p>
                  <p className="text-[11px] text-gray-400 -mt-0.5">
                    {user?.type}
                  </p>
                </div>
                <Link
                  to="#"
                  className="flex items-center justify-start gap-3.5 p-1.5 border-b border-gray-500 hover:bg-gray-100"
                >
                  <span className="text-3xl">
                    <MdOutlinePersonOutline className="text-lg" />
                  </span>
                  <span>Mon Profil</span>
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
      </div>
      <div className="p-4 w-full h-[calc(100vh-3rem)] bg-gray-50 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
