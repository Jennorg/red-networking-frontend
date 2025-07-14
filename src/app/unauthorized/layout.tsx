import { METADATA } from "@/lib/metadata";

export const metadata = METADATA.UNAUTHORIZED;

export default function UnauthorizedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 