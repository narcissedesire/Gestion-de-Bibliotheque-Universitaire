import { Outlet } from "react-router-dom";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import NavIcon from "./NavIcon";
import { useSidebar } from "../context/SidebarContext";

export default function ProfileLayout() {
  const { user } = useAuth();
  const { openSidebar, setOpenSidebar } = useSidebar();
  const [profile, setProfile] = useState(false);
  const layoutRef = useRef(null);
  const profileMenuRef = useRef(null);

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
    if (window.innerWidth < 1024 && openSidebar) {
      setOpenSidebar(false); // Ferme la sidebar si clic extérieur en dessous de 1024px
    }
  };

  return (
    <div className="w-full" ref={layoutRef} onClick={handleClickOutsideLayout}>
      <div className="flex items-center px-3 justify-between border-b border-gray-300 bg-white shadow-sm h-12">
        <div className="flex items-center gap-3">
          <span
            className="cursor-pointer border p-0.5 rounded-md hover:bg-gray-200 ml-2"
            onClick={() => setOpenSidebar(!openSidebar)} // Toggle la sidebar
          >
            <HiOutlineMenuAlt2 />
          </span>
          <span className="">Bonjour {user?.nom}</span>
        </div>
        <NavIcon
          setProfile={setProfile}
          profileMenuRef={profileMenuRef}
          profile={profile}
        />
      </div>
      <div className="p-4 w-full h-[calc(100vh-3rem)] bg-gray-50 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
