"use client";

import Header from "@/components/layout/header/Header";
import Aside from "@/components/layout/aside/Aside";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Aside />
          <main className="flex-1 overflow-auto bg-gray-950">{children}</main>
        </div>
      </div>
    </>
  );
}
