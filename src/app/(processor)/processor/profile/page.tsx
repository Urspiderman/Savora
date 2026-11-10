
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import ProcessorProfileForm, {
  type ProcessorProfile,
} from "@/components/shared/ProcessorProfileForm";

export const dynamic = "force-dynamic";

export default async function ProcessorProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("processor_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return (
      <div className="mx-auto max-w-3xl rounded-[28px] border border-red-100 bg-[#F8F6ED] p-8 text-center shadow-lg">
        <h1 className="text-xl font-black text-[#164A32]">
          Profil Belum Bisa Dimuat
        </h1>

        <p className="mt-3 text-sm text-red-700">
          {error.message}
        </p>

        <p className="mt-3 text-sm text-[#718071]">
          Pastikan tabel processor_profiles sudah dibuat
          di Supabase dan kebijakan RLS sudah aktif.
        </p>
      </div>
    );
  }

  const metadata = user.user_metadata ?? {};

  const initialProfile: ProcessorProfile = profile
    ? {
        user_id: user.id,
        full_name: profile.full_name ?? "",
        phone: profile.phone ?? "",
        business_name: profile.business_name ?? "",
        business_type: profile.business_type ?? "",
        processing_types: Array.isArray(profile.processing_types)
          ? profile.processing_types
          : [],
        capacity_kg_per_day:
          profile.capacity_kg_per_day ?? null,
        description: profile.description ?? "",
        address: profile.address ?? "",
        village: profile.village ?? "",
        district: profile.district ?? "",
        city: profile.city ?? "",
        province: profile.province ?? "",
        postal_code: profile.postal_code ?? "",
        operating_hours: profile.operating_hours ?? "",
      }
    : {
        user_id: user.id,
        full_name:
          typeof metadata.full_name === "string"
            ? metadata.full_name
            : "",
        phone: "",
        business_name: "",
        business_type: "",
        processing_types: [],
        capacity_kg_per_day: null,
        description: "",
        address: "",
        village: "",
        district: "",
        city: "",
        province: "",
        postal_code: "",
        operating_hours: "",
      };

  return (
    <ProcessorProfileForm
      userId={user.id}
      email={user.email ?? ""}
      initialProfile={initialProfile}
    />
  );
}
