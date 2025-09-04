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
import { useState } from "react";
import { LibrairieProvider } from "./context/LibrairieContext";
import Catalogue from "./pages/livre/Catalogue";

export default function App() {
  const [openSidebar, setOpenSidebar] = useState(true);

  return (
    <AuthProvider>
      <LibrairieProvider>
        <Router>
          <Routes>
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Catalogue />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Routes Admin protégées */}
            <Route
              path="/admin"
              element={
                <div className="flex overflow-hidden">
                  <Sidebar
                    openSidebar={openSidebar}
                    setOpenSidebar={setOpenSidebar}
                  />
                  <AdminLayout
                    openSidebar={openSidebar}
                    setOpenSidebar={setOpenSidebar}
                  />
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
      </LibrairieProvider>
    </AuthProvider>
  );
}
