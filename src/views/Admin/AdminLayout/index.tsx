"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import Loader from "@/components/common/Loader";

interface IAdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<IAdminLayoutProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) return <Loader />;
  if (!user || user.role !== "admin") return null;

  return (
    <div className="fixed inset-0 z-[1001] overflow-hidden md:flex" role="main">
      {/* Sidebar — always at left, behind page content on mobile (z-10) */}
      <AdminSidebar onClose={() => setIsSidebarOpen(false)} />

      {/* Page content — slides right on mobile to reveal sidebar, same as PageShiftWrapper */}
      <div
        className="absolute inset-0 z-20 flex flex-col bg-white transition-all duration-300 ease-in-out md:relative md:z-auto md:flex-1 md:min-w-0"
        style={
          isSidebarOpen
            ? {
                transform: "translateX(80vw)",
                boxShadow: "-12px 0 32px rgba(0, 0, 0, 0.22)",
                borderRadius: "16px 0 0 16px",
              }
            : {}
        }
      >
        <AdminHeader
          userName={user.name}
          onToggleSidebar={() => setIsSidebarOpen((p) => !p)}
        />
        <main className={`flex-1 p-4 md:p-6 bg-light ${isSidebarOpen ? 'overflow-hidden' : 'overflow-auto'}`}>{children}</main>

        {/* Tap-to-close overlay — same as PageShiftWrapper */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
            style={{ touchAction: "none" }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminLayout;
