import React from "react";
import type { Metadata } from "next";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { Providers } from "../../providers/providers";

export const metadata: Metadata = {
  title: "Red Networking - Plataforma de Proyectos",
  description: "Plataforma para compartir y descubrir proyectos de desarrollo web y tecnología",
  icons: {
    icon: "/pngs/uneg-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body suppressHydrationWarning>
        <Toaster richColors position="top-right" />
        <Providers>
          <AuthProvider>{children}</AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
