
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Clock3, CheckCircle2, LogOut, RefreshCw, ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ROLE_CONFIG, isAppRole } from "@/lib/auth/roles";

export default function PendingPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("Memeriksa status akun...");
  const [checking, setChecking] = useState(true);

  async function checkStatus() {
    setChecking(true);
    const supabase = createClient();

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/login");
      return;
    }

    setEmail(authData.user.email ?? "");

    const { data: roles, error: rolesError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", authData.user.id);

    if (rolesError) {
      setStatus("Gagal memeriksa izin akun. Coba lagi.");
      setChecking(false);
      return;
    }

    const approved = (roles ?? [])
      .map((item) => item.role)
      .find(isAppRole);

    if (approved) {
      router.replace(ROLE_CONFIG[approved].path);
      router.refresh();
      return;
    }

    const { data: applications, error: applicationError } =
      await supabase
        .from("role_applications")
        .select("status, requested_role, rejection_reason")
        .eq("user_id", authData.user.id);

    if (applicationError) {
      setStatus("Gagal memeriksa pengajuan role.");
    } else if (applications?.some((item) => item.status === "pending")) {
      setStatus("Pengajuan akun kamu sedang menunggu persetujuan admin.");
    } else if (applications?.some((item) => item.status === "rejected")) {
      const rejected = applications.find((item) => item.status === "rejected");
      setStatus(
        rejected?.rejection_reason
          ? `Pengajuan ditolak: ${rejected.rejection_reason}`
          : "Pengajuan role kamu belum disetujui."
      );
    } else {
      setStatus("Belum ada role yang aktif untuk akun ini.");
    }

    setChecking(false);
  }

  useEffect(() => {
    void checkStatus();
    // Pemeriksaan pertama dilakukan saat halaman dibuka.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#F8F6ED] p-5 text-[#164A32]">
      <div className="w-full max-w-[500px] rounded-[32px] border border-white bg-[#F8F6ED] px-6 py-10 text-center shadow-[12px_12px_30px_#dedbd0,-12px_-12px_30px_#ffffff] sm:px-12">
        <Image
          src="/images/logo/logo.png"
          alt="SAVORA"
          width={190}
          height={75}
          className="mx-auto h-auto w-[170px]"
        />
        <div className="mx-auto mt-9 flex h-24 w-24 items-center justify-center rounded-full bg-[#EAF1D8] shadow-[inset_5px_5px_12px_#d4ddc9,inset_-5px_-5px_12px_#ffffff]">
          <Clock3 size={48} className="text-[#D4A51B]" />
        </div>
        <h1 className="mt-7 text-2xl font-extrabold sm:text-3xl">
          Menunggu Persetujuan
        </h1>
        <p className="mt-3 text-sm text-[#687568]">{email}</p>
        <p className="mt-5 text-sm leading-7 text-[#526A55]">
          {status}
        </p>

        <div className="mt-7 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-2xl bg-[#EDF4E4] p-4">
            <CheckCircle2 className="mx-auto mb-2 text-[#087338]" />
            Akun Terdaftar
          </div>
          <div className="rounded-2xl bg-[#FFF4D4] p-4">
            <ShieldCheck className="mx-auto mb-2 text-[#D4A51B]" />
            Verifikasi Role
          </div>
        </div>

        <button
          onClick={checkStatus}
          disabled={checking}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#087338] px-6 py-4 font-bold text-white disabled:opacity-60"
        >
          <RefreshCw size={18} className={checking ? "animate-spin" : ""} />
          {checking ? "Memeriksa..." : "Periksa Status"}
        </button>

        <button
          onClick={logout}
          className="mt-4 inline-flex items-center gap-2 text-sm font-bold"
        >
          <LogOut size={17} /> Keluar
        </button>
      </div>
    </main>
  );
}
