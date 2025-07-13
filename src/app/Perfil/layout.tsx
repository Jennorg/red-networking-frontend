import type { Metadata } from "next";

export const metadata: Metadata = {
title: "Mi Perfil - Red Networking",
description: "Gestiona tu perfil en Red Networking",
icons: {
    icon: "/pngs/uneg-logo.png",
},
};

export default function PerfilLayout({
children,
}: {
children: React.ReactNode;
}) {
return children;
} 