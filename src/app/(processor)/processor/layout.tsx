
import type { ReactNode } from "react";
import DashboardShell from "@/components/layouts/DashboardShell";
import { requireRole } from "@/lib/auth/require-role";

export default async function ProcessorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireRole("processor");

  return (
    <DashboardShell
      role="processor"
      fullName={session.fullName}
      allowedRoles={session.allowedRoles}
    >
      {children}
    </DashboardShell>
  );
}
