import { METADATA } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ profesor_id: string }> }) {
  await params; // Await params but don't use profesor_id if not needed
  return METADATA.EVALUATED_PROJECTS;
}

export default function EvaluadosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 