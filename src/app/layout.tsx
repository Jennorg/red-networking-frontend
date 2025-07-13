import React from "react";
import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Red Networking - Conecta Educación",
  description: "Plataforma para conectar proyectos educativos y estudiantes",
  icons: {
    icon: "/pngs/uneg-logo.png",
    shortcut: "/pngs/uneg-logo.png",
    apple: "/pngs/uneg-logo.png",
  },
};
import {Toaster} from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body suppressHydrationWarning>
        <Toaster richColors position="top-right" />
        
        <AuthProvider>
          {children}
        </AuthProvider>
      
      </body>
    </html>
  );
}
