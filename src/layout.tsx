import React, { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import { useAuth } from "./store/auth.store";
import { getPublicSettings } from "./services/system.service";
import toast from "react-hot-toast";
import Loader from "./components/common/Loader";

const Layout: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const lastMaintenanceState = useRef<boolean | null>(null);

  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }

    if (!user || user.role?.toLowerCase() === "admin") return;

    const checkMaintenance = async () => {
      try {
        const settings = await getPublicSettings();
        const isActive = settings.masterBookingEnabled;

        if (lastMaintenanceState.current === null) {
          lastMaintenanceState.current = isActive;
          if (!isActive) {
            toast.error("System under maintenance");
          }
          return;
        }

        if (lastMaintenanceState.current && !isActive) {
          toast.error("System under maintenance");
        }

        lastMaintenanceState.current = isActive;
      } catch (error) {
        console.error("Failed to check maintenance status:", error);
      }
    };

    checkMaintenance();

    const interval = setInterval(checkMaintenance, 30000);
    const handleFocus = () => checkMaintenance();

    window.addEventListener("focus", handleFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isLoading, isAuthenticated, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 ml-64 h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
