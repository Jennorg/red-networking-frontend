import React from "react";
import "@/styles/globals.css"; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es"> 
      <body suppressHydrationWarning>
        {children} 
      </body>
    </html>
  );
}