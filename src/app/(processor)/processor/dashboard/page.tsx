
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProcessorDashboard from "@/components/shared/ProcessorDashboard";

export const dynamic = "force-dynamic";

export default async function ProcessorDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("processor_profiles")
    .select("full_name, business_name, capacity_kg_per_day")
    .eq("user_id", user.id)
    .maybeSingle();

  const metadata = user.user_metadata ?? {};

  const fullName =
    profile?.full_name ||
    (typeof metadata.full_name === "string"
      ? metadata.full_name
      : "") ||
    "Pengolah SAVORA";

  return (
    <ProcessorDashboard
      fullName={fullName}
      businessName={profile?.business_name ?? ""}
      capacityKgPerDay={profile?.capacity_kg_per_day ?? null}
    />
  );
}
