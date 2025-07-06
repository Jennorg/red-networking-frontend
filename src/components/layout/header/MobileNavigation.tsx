"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { getNavigationItems } from "@/config/navigation";

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const navigationItems = getNavigationItems(true);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      {/* Botón de menú */}
      <button
        onClick={toggleMenu}
        className="text-white hover:bg-gray-700 p-2 rounded-md transition-colors"
        aria-label="Abrir menú de navegación"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={closeMenu}
        />
      )}

      {/* Menú desplegable */}
      <div
        className={cn(
          "fixed top-16 left-0 right-0 bg-gray-800 border-b border-gray-600 z-50 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <nav className="px-4 py-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMenu}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-all duration-200",
                  "hover:bg-gray-700 hover:text-white",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
                {item.description && (
                  <span className="text-xs text-gray-400 ml-auto">
                    {item.description}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default MobileNavigation; 