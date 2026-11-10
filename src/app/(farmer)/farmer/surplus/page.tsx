
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FarmerSurplusCatalog from "@/components/marketplace/FarmerSurplusCatalog";
import type { SurplusListing } from "@/types/surplus";

export const dynamic = "force-dynamic";

export default async function FarmerSurplusPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("surplus_listings")
    .select("*")
    .eq("farmer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="mx-auto max-w-3xl rounded-[28px] border border-red-100 bg-[#F8F6ED] p-8 text-center shadow-lg">
        <h1 className="text-xl font-extrabold text-[#164A32]">
          Data Surplus Belum Bisa Dimuat
        </h1>

        <p className="mt-3 text-sm text-red-700">
          {error.message}
        </p>

        <p className="mt-3 text-sm text-[#718071]">
          Periksa tabel surplus_listings, konfigurasi Supabase,
          dan kebijakan akses akun petani.
        </p>

        <Link
          href="/farmer/dashboard"
          className="mt-6 inline-block rounded-full bg-[#087338] px-6 py-3 text-sm font-bold text-white"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  return (
    <FarmerSurplusCatalog
      listings={(data ?? []) as SurplusListing[]}
    />
  );
}
