import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";

function RouterContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <main className="auth-loading" aria-live="polite">
        Loading NutriSnap...
      </main>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to="/dashboard" replace />
            : <LoginPage />
        }
      />

      <Route
        path="/dashboard"
        element={
          isAuthenticated
            ? <DashboardPage />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to={isAuthenticated ? "/dashboard" : "/login"}
            replace
          />
        }
      />
    </Routes>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <RouterContent />
    </BrowserRouter>
  );
}
