
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FarmerProfileForm, {
  type FarmerProfile,
} from "@/components/shared/FarmerProfileForm";

export const dynamic = "force-dynamic";

export default async function FarmerProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("farmer_profiles")
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
          Pastikan tabel farmer_profiles sudah dibuat di
          Supabase dan kebijakan RLS sudah aktif.
        </p>
      </div>
    );
  }

  const metadata = user.user_metadata ?? {};

  const initialProfile: FarmerProfile = profile
    ? (profile as FarmerProfile)
    : {
        user_id: user.id,
        full_name:
          typeof metadata.full_name === "string"
            ? metadata.full_name
            : "",
        phone: "",
        farm_name: "",
        farm_type: "",
        farm_area_ha: null,
        address: "",
        village: "",
        district: "",
        city: "",
        province: "",
        postal_code: "",
        bank_name: "",
        bank_account_number: "",
        bank_account_holder: "",
        bio: "",
      };

  return (
    <FarmerProfileForm
      userId={user.id}
      email={user.email ?? ""}
      initialProfile={initialProfile}
    />
  );
}
