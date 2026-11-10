
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FarmerTransactionBoard, {
  type FarmerTransaction,
} from "@/components/marketplace/FarmerTransactionBoard";

export const dynamic = "force-dynamic";

export default async function FarmerTransactionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("farmer_transactions")
    .select("*")
    .eq("farmer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="mx-auto max-w-3xl rounded-[28px] border border-red-100 bg-[#F8F6ED] p-8 text-center shadow-lg">
        <h1 className="text-xl font-extrabold text-[#164A32]">
          Data Transaksi Belum Bisa Dimuat
        </h1>

        <p className="mt-3 text-sm text-red-700">
          {error.message}
        </p>

        <p className="mt-3 text-sm text-[#718071]">
          Periksa tabel farmer_transactions di Supabase
          dan pastikan akun petani memiliki akses membaca
          transaksi miliknya.
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
    <FarmerTransactionBoard
      transactions={(data ?? []) as FarmerTransaction[]}
    />
  );
}
