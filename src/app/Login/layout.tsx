import type { Metadata } from "next";

export const metadata: Metadata = {
title: "Iniciar Sesión - Red Networking",
description: "Accede a tu cuenta en Red Networking",
icons: {
    icon: "/pngs/uneg-logo.png",
},
};

export default function LoginLayout({
children,
}: {
children: React.ReactNode;
}) {
return children;
} 