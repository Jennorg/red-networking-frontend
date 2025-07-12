import React from "react";
import "@/styles/globals.css";
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
