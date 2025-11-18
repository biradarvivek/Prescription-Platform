import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AnimatePresence } from "framer-motion";

import LandingPage from "./components/LandingPage";
import Navbar from "./components/layout/Navbar";
import DoctorSignup from "./components/auth/DoctorSignup";
import UnifiedLogin from "./components/auth/UnifiedLogin";
import PatientSignup from "./components/auth/PatientSignup";
import DoctorDashboard from "./components/doctor/Dashboard";
import PatientDashboard from "./components/patient/Dashboard";
import DoctorsList from "./components/patient/DoctorsList";
import ConsultationForm from "./components/patient/ConsultationForm";
import PrescriptionPage from "./components/doctor/PrescriptionPage";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import DoctorLogin from "./components/auth/DoctorLogin";
import PatientLogin from "./components/auth/PatientLogin";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== role) return <Navigate to={`/${user.role}/dashboard`} />;

  return children;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {user && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<UnifiedLogin />} />
          <Route path="/doctor/signup" element={<DoctorSignup />} />
          <Route path="/patient/signup" element={<PatientSignup />} />

          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute role="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/prescriptions"
            element={
              <ProtectedRoute role="doctor">
                <PrescriptionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute role="patient">
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/doctors"
            element={
              <ProtectedRoute role="patient">
                <DoctorsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/consult/:doctorId"
            element={
              <ProtectedRoute role="patient">
                <ConsultationForm />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
