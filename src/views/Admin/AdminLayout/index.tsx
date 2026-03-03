"use client";

import React, { useEffect } from "react";
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

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) return <Loader />;
  if (!user || user.role !== "admin") return null;

  return (
    <div className="fixed inset-0 z-[1001] flex bg-white" role="main">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader userName={user.name} />
        <main className="flex-1 overflow-auto p-6 bg-light">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
