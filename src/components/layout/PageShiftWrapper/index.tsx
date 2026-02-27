"use client";

import React, { useEffect } from "react";
import { useSidebar } from "@/context/SidebarContext";

const PageShiftWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isOpen, closeMenu } = useSidebar();

  return (
    <div
      className="relative z-20 min-h-screen bg-white transition-all duration-300 ease-in-out"
      style={{
        transform: isOpen ? "translateX(80vw)" : "translateX(0)",
        boxShadow: isOpen ? "-12px 0 32px rgba(0, 0, 0, 0.22)" : "none",
        borderRadius: isOpen ? "16px 0 0 16px" : "0",
      }}
    >
      {children}

      {/* Tap-to-close overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[1001]"
          onClick={closeMenu}
          aria-hidden="true"
          style={{ touchAction: "none" }}
        />
      )}
    </div>
  );
};

export default PageShiftWrapper;
