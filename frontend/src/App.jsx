import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./services/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import "./styles/global.css";

// Global Alert Component to render the toast notifications
function GlobalAlert() {
  const { alert } = useAuth();

  if (!alert) return null;

  const getEmoji = () => {
    switch (alert.type) {
      case "success": return "✅";
      case "error": return "❌";
      case "like": return "❤️";
      case "comment": return "💬";
      case "follow": return "👥";
      default: return "ℹ️";
    }
  };

  // Keep standard background styles based on status types
  const statusType =
    alert.type === "error" ? "error" : alert.type === "info" ? "info" : "success";

  return (
    <div className={`custom-alert custom-alert-${statusType}`}>
      <span style={{ fontSize: "1.2rem", marginRight: "8px" }}>
        {getEmoji()}
      </span>
      <span>{alert.message}</span>
    </div>
  );
}

function AppContent() {
  const { token } = useAuth();

  return (
    <BrowserRouter>
      <GlobalAlert />
      <Routes>
        {/* Unprotected Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Redirect for default routes based on auth status */}
        <Route
          path="/"
          element={
            token ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
          }
        />

        {/* Catch-all redirect to home or login */}
        <Route
          path="*"
          element={
            token ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;