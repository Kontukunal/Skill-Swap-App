import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import PrivateRoute from "./components/auth/PrivateRoute";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ExchangePage from "./pages/ExchangePage";
import CommunityPage from "./pages/CommunityPage";
import ResourcesPage from "./pages/ResourcesPage";
import NotFoundPage from "./pages/NotFoundPage";
import "./styles/global.css";
import SessionsPage from "./pages/SessionsPage";
import NotificationsPage from "./pages/NotificationsPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route element={<PrivateRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/sessions" element={<SessionsPage />} />
                <Route path="/sessions/:sessionId" element={<SessionsPage />} />
                <Route path="/exchange" element={<ExchangePage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Toaster position="top-right" />
          </Layout>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
