import { useState, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import LandingPage from "./components/LandingPage";
import AboutPage from "./components/AboutPage";
import VehicleGallery from "./components/VehicleGallery";
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";
import { Skeleton } from "./components/ui/skeleton";

type AppState = "landing" | "about" | "gallery" | "admin-login" | "admin-panel";

function App() {
  // Lógica para verificar si la URL contiene el parámetro secreto
  const urlParams = new URLSearchParams(window.location.search);
  const isSecretAdmin = urlParams.has("admin-acceso-secreto");

  // Si la URL es secreta, iniciamos en 'admin-login', si no, iniciamos en 'landing'
  const initialAppState = isSecretAdmin ? "admin-login" : "landing";

  const [appState, setAppState] = useState<AppState>(initialAppState);

  const handleNavigateToHome = () => {
    setAppState("landing");
  };

  const handleNavigateToGallery = () => {
    setAppState("gallery");
  };

  const handleNavigateToAbout = () => {
    setAppState("about");
  };

  const handleNavigateToContact = () => {
    // For now, open WhatsApp since we don't have a contact page
    const message =
      "Hola! Me interesa obtener más información sobre Los Ángeles Motors.";
    const whatsappUrl = `https://wa.link/7udyd8?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleAdminClick = () => {
    setAppState("admin-login");
  };

  const handleAdminLogin = () => {
    setAppState("admin-panel");
  };

  const handleLogout = () => {
    setAppState("landing");
  };

  const handleBackToGallery = () => {
    setAppState("gallery");
  };

  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Skeleton className="h-16 w-full mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Suspense fallback={<LoadingSkeleton />}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/"
              element={
                <motion.div
                  key={appState}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {appState === "landing" && (
                    <LandingPage
                      onNavigateToGallery={handleNavigateToGallery}
                      onNavigateToAbout={handleNavigateToAbout}
                      onNavigateToHome={handleNavigateToHome}
                      onNavigateToContact={handleNavigateToContact}
                    />
                  )}
                  {appState === "about" && (
                    <AboutPage
                      onNavigateToAbout={handleNavigateToAbout}
                      onNavigateToHome={handleNavigateToHome}
                      onNavigateToContact={handleNavigateToContact}
                    />
                  )}
                  {appState === "gallery" && (
                    <VehicleGallery
                      onAdminClick={handleAdminClick}
                      onNavigateToAbout={handleNavigateToAbout}
                      onNavigateToHome={handleNavigateToHome}
                      onNavigateToContact={handleNavigateToContact}
                    />
                  )}
                  {appState === "admin-login" && (
                    <AdminLogin
                      onLogin={handleAdminLogin}
                      onBack={handleBackToGallery}
                    />
                  )}
                  {appState === "admin-panel" && (
                    <AdminPanel onLogout={handleLogout} />
                  )}
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
