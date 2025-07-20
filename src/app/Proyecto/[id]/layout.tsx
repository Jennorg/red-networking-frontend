import { createProjectMetadata } from "@/lib/metadata";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }){
  const { id } = await params;
  return createProjectMetadata(id);
}

export default function ProyectoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}