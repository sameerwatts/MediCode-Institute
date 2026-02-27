"use client";

import React, { createContext, useContext, useState } from "react";

interface ISidebarContext {
  isOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
}

const SidebarContext = createContext<ISidebarContext>({
  isOpen: false,
  toggleMenu: () => {},
  closeMenu: () => {},
});

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <SidebarContext.Provider value={{ isOpen, toggleMenu, closeMenu }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
