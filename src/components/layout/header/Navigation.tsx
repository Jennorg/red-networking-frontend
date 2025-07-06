"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getNavigationItems } from "@/config/navigation";

const Navigation = () => {
  const pathname = usePathname();
  const navigationItems = getNavigationItems(true);

  return (
    <nav className="hidden md:flex items-center space-x-1">
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
              "hover:bg-gray-700 hover:text-white",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800",
              isActive
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-300"
            )}
            title={item.description}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden lg:inline">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation; 