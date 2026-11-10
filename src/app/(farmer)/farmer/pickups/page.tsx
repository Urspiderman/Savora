
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FarmerPickupBoard, {
  type PickupRecord,
} from "@/components/logistics/FarmerPickupBoard";

export const dynamic = "force-dynamic";

export default async function FarmerPickupsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("pickup_requests")
    .select("*")
    .eq("farmer_id", user.id)
    .order("pickup_date", { ascending: false });

  if (error) {
    return (
      <div className="mx-auto max-w-3xl rounded-[28px] border border-red-100 bg-[#F8F6ED] p-8 text-center shadow-lg">
        <h1 className="text-xl font-extrabold text-[#164A32]">
          Data Penjemputan Belum Bisa Dimuat
        </h1>

        <p className="mt-3 text-sm text-red-700">
          {error.message}
        </p>

        <p className="mt-3 text-sm text-[#718071]">
          Pastikan tabel pickup_requests sudah dibuat di
          Supabase dan kebijakan RLS mengizinkan akunmu
          membaca penjemputan miliknya.
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
    <FarmerPickupBoard
      pickups={(data ?? []) as PickupRecord[]}
    />
  );
}
