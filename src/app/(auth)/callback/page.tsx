
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function CallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function completeVerification() {
      try {
        const supabase = createClient();
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const tokenHash = url.searchParams.get("token_hash");
        const type = url.searchParams.get("type");

        if (url.searchParams.get("error")) {
          throw new Error(
            url.searchParams.get("error_description") ??
              "Verifikasi email gagal."
          );
        }

        if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) throw exchangeError;
        } else if (tokenHash && type === "signup") {
          const { error: verifyError } =
            await supabase.auth.verifyOtp({
              token_hash: tokenHash,
              type: "signup",
            });

          if (verifyError) throw verifyError;
        } else {
          const { data, error: sessionError } =
            await supabase.auth.getUser();

          if (sessionError || !data.user) {
            throw new Error("Tautan verifikasi tidak valid atau kedaluwarsa.");
          }
        }

        if (!cancelled) {
          router.replace("/pending");
          router.refresh();
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Verifikasi tidak berhasil."
          );
        }
      }
    }

    completeVerification();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#F8F6ED] p-6 text-[#164A32]">
      <div className="w-full max-w-md rounded-[30px] border border-white bg-[#F8F6ED] p-10 text-center shadow-[10px_10px_25px_#dedbd0,-10px_-10px_25px_#ffffff]">
        {error ? (
          <>
            <AlertCircle size={48} className="mx-auto text-red-600" />
            <h1 className="mt-5 text-2xl font-extrabold">
              Verifikasi Gagal
            </h1>
            <p className="mt-3 text-sm leading-6 text-red-700">
              {error}
            </p>
            <Link href="/login" className="mt-7 inline-block font-bold underline">
              Kembali ke Login
            </Link>
          </>
        ) : (
          <>
            <LoaderCircle size={48} className="mx-auto animate-spin text-[#087338]" />
            <h1 className="mt-5 text-2xl font-extrabold">
              Memverifikasi Akun
            </h1>
            <p className="mt-3 text-sm text-[#687568]">
              Mohon tunggu, SAVORA sedang memeriksa verifikasi email kamu.
            </p>
            <CheckCircle2 size={22} className="mx-auto mt-6 text-[#87B65E]" />
          </>
        )}
      </div>
    </main>
  );
}
