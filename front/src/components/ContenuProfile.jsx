import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { IoCameraOutline } from "react-icons/io5";
import { MdOutlineAdminPanelSettings, MdOutlineEmail } from "react-icons/md";
import { PiCalendarStarBold } from "react-icons/pi";
import EditProfile from "./EditProfile";
import { useAuth } from "../context/AuthContext";

export default function ContenuProfile() {
  const [showEditForm, setShowEditForm] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("/images/profile.jpg");
  const [file, setFile] = useState(null);
  const { user } = useAuth(); // ✅ utiliser directement le user du contexte

  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      setFile(newFile);
      setPhotoPreview(URL.createObjectURL(newFile));
    }
  };

  if (!user) return null; // protection si user pas chargé

  return (
    <>
      <div className="mt-5 border border-gray-300 rounded-lg shadow-lg p-5 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <span className="w-32 h-32 rounded-full border-4 border-gray-300 overflow-hidden block">
            <img
              src={photoPreview}
              className="object-cover w-full h-full"
              alt="Photo de profil"
            />
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="upload-photo"
            className="hidden"
          />
          <label
            htmlFor="upload-photo"
            className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full text-xl cursor-pointer hover:bg-gray-700"
          >
            <IoCameraOutline />
          </label>
        </div>

        <div className="flex flex-col gap-3 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <span className="text-2xl font-semibold">
              {user.prenom} {user.nom}
            </span>
            <span className="text-xs flex items-center gap-1 px-2 py-1 bg-[#FF6384] text-white rounded-lg">
              <MdOutlineAdminPanelSettings />
              {user.type}
            </span>
          </div>
          <div className="flex flex-col gap-1 mb-3">
            <div className="text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-2">
              <PiCalendarStarBold className="text-[16px]" />
              Membre depuis le{" "}
              {new Date(user.createdAt).toLocaleDateString("FR-fr")}
            </div>
            <div className="text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-2">
              <MdOutlineEmail />
              {user.email}
            </div>
          </div>
          <span>
            <button
              disabled={showEditForm}
              onClick={() => setShowEditForm(true)}
              className={`${
                showEditForm
                  ? "bg-black/70"
                  : "hover:bg-black/70 bg-black cursor-pointer"
              } text-xs text-white py-1.5 px-3 rounded-lg flex items-center justify-center gap-2`}
            >
              <FaRegEdit /> Modifier le profil
            </button>
          </span>
        </div>
      </div>

      {showEditForm && (
        <EditProfile
          onClose={() => setShowEditForm(false)}
          file={file}
          user={user} // ✅ passer le user du contexte directement
        />
      )}
    </>
  );
}
