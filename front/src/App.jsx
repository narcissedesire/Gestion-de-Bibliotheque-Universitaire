import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Inscription from "./pages/authentification/Inscription";
import Login from "./pages/authentification/Login";
import Reservation from "./pages/reservation/Reservation";
import DashboardAdmin from "./pages/dashboard/DashboardAdmin";
import Unauthorized from "./components/Unauthorized";
import { AuthProvider } from "./context/AuthContext";
import Livre from "./pages/livre/Livre";
import Utilisateur from "./pages/utilisateur/Utilisateur";
import Parametre from "./pages/parametre/Parametre";
import Sidebar from "./components/Sidebar";
import AdminLayout from "./components/AdminLayout";
import { SidebarProvider } from "./context/SidebarContext"; // Import SidebarProvider
import { LibrairieProvider } from "./context/LibrairieContext";
import Catalogue from "./pages/livre/Catalogue";
import EmpruntProfile from "./pages/profile/EmpruntProfile";
import SidebarProfil from "./components/SidebarProfil";
import ProfileLayout from "./components/ProfileLayout";
import DashboardProfil from "./pages/profile/DashboardProfil";
import ReserveProfile from "./pages/profile/ReserveProfile";

export default function App() {
  return (
    <AuthProvider>
      <LibrairieProvider>
        <SidebarProvider>
          {" "}
          {/* Wrap with SidebarProvider */}
          <Router>
            <Routes>
              <Route path="/inscription" element={<Inscription />} />
              <Route path="/login" element={<Login />} />
              <Route path="/emprunt-profile" element={<EmpruntProfile />} />
              <Route path="/" element={<Catalogue />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Routes Admin protégées */}
              <Route
                path="/admin"
                element={
                  <div className="flex overflow-hidden">
                    <Sidebar /> {/* Remove props, use context */}
                    <AdminLayout /> {/* Remove props, use context */}
                  </div>
                }
              >
                <Route
                  index
                  element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                      <DashboardAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="livre"
                  element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                      <Livre />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="utilisateur"
                  element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                      <Utilisateur />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="parametre"
                  element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                      <Parametre />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Routes Profile protégées */}
              <Route
                path="/profile"
                element={
                  <div className="flex overflow-hidden">
                    <SidebarProfil /> {/* Remove props, use context */}
                    <ProfileLayout /> {/* Remove props, use context */}
                  </div>
                }
              >
                <Route
                  index
                  element={
                    <ProtectedRoute
                      allowedRoles={["Admin", "Etudiant", "Professeur"]}
                    >
                      <DashboardProfil />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="emprunt"
                  element={
                    <ProtectedRoute
                      allowedRoles={["Admin", "Etudiant", "Professeur"]}
                    >
                      <EmpruntProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="reservation"
                  element={
                    <ProtectedRoute
                      allowedRoles={["Admin", "Etudiant", "Professeur"]}
                    >
                      <ReserveProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="parametre"
                  element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                      <Parametre />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Route pour étudiants (exemple) */}
              <Route
                path="/reservation"
                element={
                  <ProtectedRoute
                    allowedRoles={["Etudiant", "Professeur", "Admin"]}
                  >
                    <Reservation />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </SidebarProvider>
      </LibrairieProvider>
    </AuthProvider>
  );
}
