import { createProjectMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return createProjectMetadata(params.id);
}

export default function ProyectoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}