
import { notFound } from "next/navigation";
import SurplusForm from "@/components/shared/SurplusForm";
import { createClient } from "@/lib/supabase/server";
import type { SurplusListing } from "@/types/surplus";

export default async function EditSurplusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) notFound();

  const { data, error } = await supabase
    .from("surplus_listings")
    .select("*")
    .eq("id", id)
    .eq("farmer_id", user.id)
    .single();

  if (error || !data) notFound();

  return <SurplusForm initial={data as SurplusListing} />;
}
