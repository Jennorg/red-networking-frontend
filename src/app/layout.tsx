import React from "react";
import "@/styles/globals.css";
import {Toaster} from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body suppressHydrationWarning>
        <Toaster richColors position="top-right"/>
        {children}
      </body>
    </html>
  );
}
