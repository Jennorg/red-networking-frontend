import type { Metadata } from "next";

export const metadata: Metadata = {
title: "Registrarse - Red Networking",
description: "Crea tu cuenta en Red Networking",
icons: {
    icon: "/pngs/uneg-logo.png",
},
};

export default function SignupLayout({
children,
}: {
children: React.ReactNode;
}) {
return children;
} 