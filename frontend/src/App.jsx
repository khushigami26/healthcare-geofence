import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AuthPage from "./components/AuthPage";
import DashboardLayout from "./components/DashboardLayout";

import DashboardPage from "./pages/DashboardPage";
import PatientsPage from "./pages/PatientsPage";
import PatientDetailsPage from "./pages/PatientDetailsPage";
import FamilyMembersPage from "./pages/FamilyMembersPage";
import LocationsPage from "./pages/LocationsPage";
import GeoFencePage from "./pages/GeoFencePage";
import AlertsPage from "./pages/AlertsPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

import "./App.css";

function App() {
  const savedUser = JSON.parse(localStorage.getItem("healthcareUser"));

  const loggedIn = localStorage.getItem("healthcareLoggedIn") === "true";

  const [user, setUser] = useState(loggedIn ? savedUser : null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("healthcareLoggedIn");

    setUser(null);
  };

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AuthPage onLogin={handleLogin} />} />

          <Route
            path="/register"
            element={<AuthPage onLogin={handleLogin} />}
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <DashboardLayout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<DashboardPage user={user} />} />

          <Route path="/patients" element={<PatientsPage />} />

          <Route path="/patients/:id" element={<PatientDetailsPage />} />

          <Route path="/family-members" element={<FamilyMembersPage />} />

          <Route path="/locations" element={<LocationsPage />} />

          <Route path="/geofence" element={<GeoFencePage />} />

          <Route path="/alerts" element={<AlertsPage />} />

          <Route path="/profile" element={<ProfilePage user={user} />} />

          <Route path="/settings" element={<SettingsPage />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;
