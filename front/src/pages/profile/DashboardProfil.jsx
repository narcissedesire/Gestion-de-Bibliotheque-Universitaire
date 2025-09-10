import { HeaderDash } from "../../components/card";
import ContenuProfile from "../../components/ContenuProfile";
import SousHeader from "./SousHeader";

export default function DashboardProfil() {
  return (
    <div>
      <HeaderDash
        titre="Mon profil"
        desc="Gérez vos informations personnelles et suivez vos activités dans la bibliothèque."
      />

      <SousHeader />
      <ContenuProfile />
    </div>
  );
}
