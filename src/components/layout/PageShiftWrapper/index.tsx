"use client";

import React, { useEffect, useRef } from "react";
import { useSidebar } from "@/context/SidebarContext";

const PageShiftWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isOpen, closeMenu } = useSidebar();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    el.style.position = isOpen ? "fixed" : "relative";
  }, [isOpen]);

  return (
    <div
      ref={wrapperRef}
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
