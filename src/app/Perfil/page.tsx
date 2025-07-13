import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi Perfil - Red Networking",
  description: "Gestiona tu perfil en Red Networking",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function Perfil() {
  return (
    <div>
      <h1>Perfil</h1>
    </div>
  );
}
