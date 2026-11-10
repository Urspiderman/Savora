
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

import AuthShell from "@/components/shared/AuthShell";
import { createClient } from "@/lib/supabase/client";
import { ROLE_CONFIG, isAppRole } from "@/lib/auth/roles";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const { data, error: authError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (authError) throw authError;
      if (!data.user) throw new Error("Login gagal.");

      const { data: roles, error: rolesError } =
        await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id);

      if (rolesError) throw rolesError;

      const allowedRoles = (roles ?? [])
        .map((item) => item.role)
        .filter(isAppRole);

      if (allowedRoles.length === 0) {
        router.replace("/pending");
        return;
      }

      const preferred = allowedRoles.includes("farmer")
        ? "farmer"
        : allowedRoles[0];

      router.replace(ROLE_CONFIG[preferred].path);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat masuk."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell variant="login">
      <div className="mx-auto w-full max-w-[430px]">
        {/* JUDUL */}
        <h1 className="text-center text-[25px] font-extrabold leading-tight sm:text-[34px]">
          Masuk ke{" "}
          <span className="text-[#E5A400]">SAVORA</span>
        </h1>

        <p className="mx-auto mt-2 max-w-[350px] text-center text-[12px] leading-5 text-[#6C776B] sm:text-sm sm:leading-6">
          Kelola surplus panen dan bangun rantai ekonomi
          sirkular bersama kami.
        </p>

        {/* FORM LOGIN */}
        <form
          onSubmit={handleLogin}
          className="mt-6 space-y-4 sm:mt-9 sm:space-y-5"
        >
          {/* EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 flex items-center gap-2 text-[13px] font-bold sm:text-sm"
            >
              <Mail size={17} />
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email kamu"
              className="w-full min-w-0 rounded-2xl border border-[#E7E4D8] bg-[#F8F6ED] px-4 py-3.5 text-base outline-none shadow-[inset_5px_5px_10px_#e4e0d5,inset_-5px_-5px_10px_#ffffff] transition focus:border-[#62A32C] sm:px-5 sm:py-4 sm:text-sm"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 flex items-center gap-2 text-[13px] font-bold sm:text-sm"
            >
              <LockKeyhole size={17} />
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={visible ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full min-w-0 rounded-2xl border border-[#E7E4D8] bg-[#F8F6ED] px-4 py-3.5 pr-14 text-base outline-none shadow-[inset_5px_5px_10px_#e4e0d5,inset_-5px_-5px_10px_#ffffff] transition focus:border-[#62A32C] sm:px-5 sm:py-4 sm:text-sm"
              />

              <button
                type="button"
                onClick={() => setVisible(!visible)}
                aria-label={
                  visible
                    ? "Sembunyikan password"
                    : "Tampilkan password"
                }
                aria-pressed={visible}
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-[#52715A] sm:right-2"
              >
                {visible ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {/* REMEMBER + FORGOT */}
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-[12px] sm:text-sm">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 accent-[#087338]"
              />
              Ingat saya
            </label>

            <Link
              href="/forgot-password"
              className="font-bold text-[#087338] hover:underline"
            >
              Lupa password?
            </Link>
          </div>

          {/* ERROR */}
          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
            >
              {error}
            </p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="flex min-h-[50px] w-full items-center justify-center gap-3 rounded-full bg-gradient-to-b from-[#49B76D] to-[#006D32] px-5 py-3.5 text-sm font-bold text-white shadow-[5px_7px_12px_#c5c8b4,-3px_-3px_8px_#ffffff] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 sm:py-4 sm:text-base"
          >
            <ArrowRight size={19} />
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        {/* PEMISAH */}
        <div className="mt-5 flex items-center gap-4 text-xs text-[#7B8278] sm:mt-7">
          <span className="h-px flex-1 bg-[#D9D5C7]" />
          atau
          <span className="h-px flex-1 bg-[#D9D5C7]" />
        </div>

        {/* GOOGLE INFO */}
        <p className="mt-4 text-center text-[11px] leading-5 text-[#687568] sm:mt-6 sm:text-xs">
          Login Google akan diaktifkan setelah OAuth
          Supabase dikonfigurasi.
        </p>

        {/* REGISTER LINK */}
        <p className="mt-6 text-center text-[13px] sm:mt-8 sm:text-sm">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-extrabold text-[#087338] hover:underline"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
