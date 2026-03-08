import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import DoctorAppointments from "./pages/DoctorAppointments";
import PatientAppointments from "./pages/PatientAppointments";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import DoctorProfile from "./pages/DoctorProfile";
import AdminDashboard from "./pages/AdminDashboard";
function App() {

  const [role, setRole] = useState(
    localStorage.getItem("role")
  );

  const token = localStorage.getItem("token");

  return (

    <div>

      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login setRole={setRole} />}
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* DOCTOR DASHBOARD */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute>
              <DoctorAppointments />
            </ProtectedRoute>
          }
        />

        {/* PATIENT DASHBOARD */}
        <Route
          path="/patient"
          element={
            <ProtectedRoute>
              <PatientAppointments />
            </ProtectedRoute>
          }
        />

        {/* PROFILE PAGE */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* DEFAULT REDIRECT */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                token
                  ? role === "DOCTOR"
                    ? "/doctor"
                    : "/patient"
                  : "/login"
              }
            />
          }
        />
        <Route
 path="/doctor-profile/:id"
 element={<DoctorProfile />}
/>

<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

      </Routes>

    </div>

  );
}

export default App;