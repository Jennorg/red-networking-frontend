import { createProjectMetadata } from "@/lib/metadata";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return createProjectMetadata(params.id);
}

export default function ProyectoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}