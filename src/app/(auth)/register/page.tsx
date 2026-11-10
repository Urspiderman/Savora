
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  UserRound,
  Sprout,
  Recycle,
  Truck,
  UserRoundPlus,
  Check,
} from "lucide-react";

import AuthShell from "@/components/shared/AuthShell";
import { createClient } from "@/lib/supabase/client";
import {
  REGISTER_ROLES,
  ROLE_CONFIG,
  type AppRole,
} from "@/lib/auth/roles";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [role, setRole] = useState<AppRole>("farmer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleRegister(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setError("");

    if (fullName.trim().length < 3) {
      setError("Nama lengkap minimal 3 karakter.");
      return;
    }

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sesuai.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error: signUpError } =
        await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            emailRedirectTo:
              `${window.location.origin}/callback`,
            data: {
              full_name: fullName.trim(),
              requested_role: role,
            },
          },
        });

      if (signUpError) throw signUpError;

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Pendaftaran gagal. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full min-w-0 rounded-2xl border border-[#E7E4D8] bg-[#F8F6ED] px-4 py-3 text-base outline-none shadow-[inset_4px_4px_9px_#e4e0d5,inset_-4px_-4px_9px_#ffffff] transition focus:border-[#62A32C] sm:text-sm";

  /* SUCCESS */
  if (success) {
    return (
      <AuthShell variant="register">
        <div className="mx-auto w-full max-w-[430px] text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#E4F1D5] text-[#087338] shadow-[6px_6px_14px_#ddd9cc,-6px_-6px_14px_#ffffff] sm:mb-6 sm:h-20 sm:w-20">
            <Check
              size={36}
              className="sm:h-[42px] sm:w-[42px]"
            />
          </div>

          <h1 className="text-[25px] font-extrabold leading-tight sm:text-3xl">
            Pendaftaran Diterima!
          </h1>

          <p className="mt-4 text-[13px] leading-6 text-[#687568] sm:text-sm sm:leading-7">
            Periksa email kamu untuk verifikasi akun
            SAVORA. Setelah email terverifikasi,
            pengajuan role akan menunggu persetujuan
            admin.
          </p>

          <Link
            href="/login"
            className="mt-7 inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#087338] px-8 py-3.5 text-sm font-bold text-white sm:mt-8 sm:py-4 sm:text-base"
          >
            Kembali ke Login
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell variant="register">
      <div className="mx-auto w-full max-w-[460px]">
        {/* HEADER */}
        <h1 className="text-center text-[25px] font-extrabold leading-tight sm:text-[33px]">
          Buat Akun{" "}
          <span className="text-[#E5A400]">SAVORA</span>
        </h1>

        <p className="mt-2 text-center text-[12px] leading-5 text-[#687568] sm:text-sm sm:leading-6">
          Bergabung dan mulai manfaatkan surplus panen
          secara berkelanjutan.
        </p>

        {/* FORM */}
        <form
          onSubmit={handleRegister}
          className="mt-5 space-y-3 sm:mt-7 sm:space-y-3.5"
        >
          {/* NAME */}
          <div>
            <label
              htmlFor="fullName"
              className="mb-1.5 flex items-center gap-2 text-[13px] font-bold sm:text-sm"
            >
              <UserRound size={16} />
              Nama Lengkap
            </label>

            <input
              id="fullName"
              className={inputClass}
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              placeholder="Masukkan nama lengkap"
              autoComplete="name"
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 flex items-center gap-2 text-[13px] font-bold sm:text-sm"
            >
              <Mail size={16} />
              Email
            </label>

            <input
              id="email"
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
              autoComplete="email"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 flex items-center gap-2 text-[13px] font-bold sm:text-sm"
            >
              <LockKeyhole size={16} />
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={
                  showPassword ? "text" : "password"
                }
                className={`${inputClass} pr-12`}
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Buat password (min. 8 karakter)"
                autoComplete="new-password"
                minLength={8}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label={
                  showPassword
                    ? "Sembunyikan password"
                    : "Tampilkan password"
                }
                aria-pressed={showPassword}
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-[#52715A]"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 flex items-center gap-2 text-[13px] font-bold sm:text-sm"
            >
              <LockKeyhole size={16} />
              Konfirmasi Password
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                type={
                  showConfirm ? "text" : "password"
                }
                className={`${inputClass} pr-12`}
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Ulangi password"
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirm(!showConfirm)
                }
                aria-label={
                  showConfirm
                    ? "Sembunyikan konfirmasi password"
                    : "Tampilkan konfirmasi password"
                }
                aria-pressed={showConfirm}
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-[#52715A]"
              >
                {showConfirm ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* ROLE SELECTION */}
          <fieldset>
            <legend className="mb-3 text-[13px] font-bold sm:text-sm">
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <UserRoundPlus size={16} />
                Pilih Peran
                <span className="text-[11px] font-normal text-[#7B8278] sm:text-sm">
                  (perlu persetujuan admin)
                </span>
              </span>
            </legend>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {REGISTER_ROLES.map((item) => {
                const selected = role === item;

                const Icon =
                  item === "farmer"
                    ? Sprout
                    : item === "processor"
                      ? Recycle
                      : Truck;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRole(item)}
                    aria-pressed={selected}
                    className={`relative flex min-h-[92px] min-w-0 flex-col items-center justify-center rounded-2xl border-2 px-1.5 py-3 text-center transition sm:min-h-[125px] sm:justify-start sm:px-2 sm:py-4 ${
                      selected
                        ? "border-[#087338] bg-[#EDF4E3] shadow-[inset_3px_3px_7px_#d1dfc6]"
                        : "border-white bg-[#F8F6ED] shadow-[5px_5px_12px_#e0dccf,-5px_-5px_12px_#ffffff]"
                    }`}
                  >
                    {selected && (
                      <span className="absolute right-1.5 top-1.5 rounded-full bg-[#087338] p-1 text-white">
                        <Check size={11} />
                      </span>
                    )}

                    <Icon
                      size={26}
                      className={
                        item === "courier"
                          ? "text-[#E5A400]"
                          : "text-[#4B9A37]"
                      }
                    />

                    <span className="mt-2 break-words text-[11px] font-extrabold leading-4 sm:text-xs">
                      {ROLE_CONFIG[item].label}
                    </span>

                    <span className="mt-1 hidden text-[10px] leading-4 text-[#718071] sm:block">
                      {ROLE_CONFIG[item].description}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* ERROR */}
          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
            >
              {error}
            </p>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="mt-3 flex min-h-[50px] w-full items-center justify-center gap-3 rounded-full bg-gradient-to-b from-[#49B76D] to-[#006D32] px-5 py-3.5 text-sm font-bold text-white shadow-[5px_7px_12px_#c5c8b4,-3px_-3px_8px_#ffffff] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 sm:py-4 sm:text-base"
          >
            <UserRoundPlus size={20} />
            {loading
              ? "Mendaftarkan akun..."
              : "Daftar Sekarang"}
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="mt-6 text-center text-[13px] sm:text-sm">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-extrabold text-[#087338] hover:underline"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
