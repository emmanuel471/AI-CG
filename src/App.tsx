import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { MainLayout } from "./layouts/MainLayout";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "./pages/NotFound";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { RouteShell } from "./layouts/RouteShell";
import { RecommendationsPage } from "./pages/RecommendationsPage";
import { SkillsGapPage } from "./pages/SkillsGapPage";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { ProfilePage } from "./pages/ProfilePage";
import { persistor, store } from "./store/store";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import SessionAlert from "./components/ui/SessionAlert";

export default function App() {
  return (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SessionAlert />
        <Toaster />
           <Sonner />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />            
            <Route path="/dashboard" element={<RouteShell><DashboardPage /></RouteShell>}/>
            <Route path="/recommendations" element={<RouteShell><RecommendationsPage /></RouteShell>}/>
            <Route path="/skills-gap" element={<RouteShell><SkillsGapPage /></RouteShell>}/>
            <Route path="/profile" element={<RouteShell><ProfilePage /></RouteShell>}/>          
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PersistGate>
    </Provider>
  );
}