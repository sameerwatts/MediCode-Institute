"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { navLinks } from "@/data/navigation";
import AppSidebarFooter from "./AppSidebarFooter";

type TVariant = "public" | "admin";

interface INavItem {
  label: string;
  href: string;
}

interface IVariantConfig {
  wrapperClasses: string;
  brandSubtitle: string | null;
  borderColor: string;
  activeItemClasses: string;
  inactiveItemClasses: string;
  linkPaddingX: string;
  navClasses: string;
  navItems: INavItem[];
  isActiveMatch: (pathname: string, href: string) => boolean;
}

export interface IAppSidebarProps {
  variant: TVariant;
  onClose: () => void;
}

const VARIANT_CONFIG: Record<TVariant, IVariantConfig> = {
  public: {
    wrapperClasses:
      "absolute top-0 left-0 h-screen w-[80%] bg-white z-10 flex flex-col p-6 pb-12 md:hidden",
    brandSubtitle: null,
    borderColor: "border-light-gray",
    activeItemClasses: "font-semibold text-primary bg-primary-light",
    inactiveItemClasses:
      "font-medium text-dark-gray hover:text-primary hover:bg-light",
    linkPaddingX: "px-4",
    navClasses: "flex-1 flex flex-col gap-1",
    navItems: navLinks.map((l) => ({ label: l.label, href: l.path })),
    isActiveMatch: (pathname, href) => pathname === href,
  },
  admin: {
    wrapperClasses:
      "absolute inset-y-0 left-0 z-10 w-[80%] bg-dark flex flex-col md:relative md:z-auto md:w-60 md:flex-shrink-0",
    brandSubtitle: "Admin Panel",
    borderColor: "border-dark-gray",
    activeItemClasses: "bg-primary text-white",
    inactiveItemClasses: "text-gray hover:bg-dark-gray/40 hover:text-white",
    linkPaddingX: "px-3",
    navClasses: "flex-1 px-3 py-4 space-y-1",
    navItems: [
      { label: "Teacher Requests", href: "/admin/teacher-requests" },
      { label: "Students", href: "/admin/students" },
    ],
    isActiveMatch: (pathname, href) => pathname.startsWith(href),
  },
};

const AppSidebar: React.FC<IAppSidebarProps> = ({ variant, onClose }) => {
  const config = VARIANT_CONFIG[variant];
  const pathname = usePathname();
  const router = useRouter();
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (pathname === href) {
      onClose();
      return;
    }
    e.preventDefault();
    setPendingPath(href);
    setTimeout(() => {
      onClose();
      router.push(href);
      setPendingPath(null);
    }, 200);
  };

  const Tag: React.ElementType = variant === "admin" ? "aside" : "div";

  return (
    <Tag className={config.wrapperClasses}>
      {/* Brand */}
      <div className={`px-6 py-5 border-b ${config.borderColor}`}>
        <span
          className={`font-extrabold ${
            variant === "admin" ? "text-h4 text-white" : "text-h3 text-primary"
          }`}
        >
          Medi<span className="text-secondary">Code</span>
        </span>
        {config.brandSubtitle && (
          <p className="text-sm-text text-gray mt-0.5">
            {config.brandSubtitle}
          </p>
        )}
      </div>

      {/* Nav */}
      <nav
        className={config.navClasses}
        aria-label={
          variant === "admin" ? "Admin navigation" : "Mobile navigation"
        }
      >
        {config.navItems.map((item) => {
          const isActive =
            config.isActiveMatch(pathname, item.href) ||
            pendingPath === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`block ${config.linkPaddingX} py-2.5 rounded-md text-sm-text font-medium transition-colors duration-150 ${
                isActive ? config.activeItemClasses : config.inactiveItemClasses
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <AppSidebarFooter
        variant={variant}
        onClose={onClose}
        borderColor={config.borderColor}
      />
    </Tag>
  );
};

export default AppSidebar;
