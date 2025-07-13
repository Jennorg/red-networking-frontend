import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ranking - Red Networking",
  description: "Ranking de proyectos en Red Networking",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RankingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 