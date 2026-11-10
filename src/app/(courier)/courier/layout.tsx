
import type { ReactNode } from "react";
import DashboardShell from "@/components/layouts/DashboardShell";
import { requireRole } from "@/lib/auth/require-role";

export default async function CourierLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireRole("courier");

  return (
    <DashboardShell
      role="courier"
      fullName={session.fullName}
      allowedRoles={session.allowedRoles}
    >
      {children}
    </DashboardShell>
  );
}
