
import type { ReactNode } from "react";
import DashboardShell from "@/components/layouts/DashboardShell";
import { requireRole } from "@/lib/auth/require-role";

export default async function FarmerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireRole("farmer");

  return (
    <DashboardShell
      role="farmer"
      fullName={session.fullName}
      allowedRoles={session.allowedRoles}
    >
      {children}
    </DashboardShell>
  );
}
