import { METADATA } from "@/lib/metadata";

export async function generateMetadata({}: { params: { profesor_id: string } }) {
  return METADATA.EVALUATED_PROJECTS;
}

export default function EvaluadosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 