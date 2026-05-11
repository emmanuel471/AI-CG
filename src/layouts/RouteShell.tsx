import { type ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Loader } from "@/components/Loader";
import { PageTransition } from "@/components/PageTransition";

import { selectUser } from "@/store/store";

export interface RouteShellProps {
  children: ReactNode;
}

export function RouteShell({ children }: RouteShellProps) {
  const navigate = useNavigate();

  const user = useSelector(selectUser);

  const isAuthenticated = !!user;

  const loading = false;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <Loader fullscreen label="Loading workspace…" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-8 flex gap-8">
        <Sidebar />

        <main className="flex-1 min-w-0">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}