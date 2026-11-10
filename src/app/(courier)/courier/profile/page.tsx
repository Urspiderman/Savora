
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import CourierProfileForm, {
  type CourierProfile,
} from "@/components/shared/CourierProfileForm";

export const dynamic = "force-dynamic";

export default async function CourierProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("courier_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return (
      <div className="mx-auto max-w-3xl rounded-[28px] border border-red-100 bg-[#F8F6ED] p-8 text-center shadow-lg">
        <h1 className="text-xl font-black text-[#245C43]">
          Profil Belum Bisa Dimuat
        </h1>

        <p className="mt-3 text-sm text-red-700">
          {error.message}
        </p>

        <p className="mt-3 text-sm text-[#718071]">
          Pastikan tabel courier_profiles sudah dibuat
          dan kebijakan RLS sudah aktif di Supabase.
        </p>
      </div>
    );
  }

  const metadata = user.user_metadata ?? {};

  const initialProfile: CourierProfile = {
    user_id: user.id,
    full_name:
      profile?.full_name ||
      (typeof metadata.full_name === "string"
        ? metadata.full_name
        : ""),
    phone: profile?.phone ?? "",
    vehicle_type: profile?.vehicle_type ?? "",
    vehicle_brand: profile?.vehicle_brand ?? "",
    license_plate: profile?.license_plate ?? "",
    operational_area: profile?.operational_area ?? "",
    address: profile?.address ?? "",
    city: profile?.city ?? "",
    province: profile?.province ?? "",
    postal_code: profile?.postal_code ?? "",
    emergency_contact: profile?.emergency_contact ?? "",
    bio: profile?.bio ?? "",
  };

  return (
    <CourierProfileForm
      userId={user.id}
      email={user.email ?? ""}
      initialProfile={initialProfile}
    />
  );
}
