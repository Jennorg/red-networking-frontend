import { createProjectMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: { id: string } }) {
  return createProjectMetadata(params.id);
}

export default function ProyectoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 