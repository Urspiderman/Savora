
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  CreditCard,
  FileText,
  Leaf,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Save,
  ShieldCheck,
  Sprout,
  UserRound,
  Wallet,
} from "lucide-react";

export type FarmerProfile = {
  user_id: string;
  full_name: string;
  phone: string;
  farm_name: string;
  farm_type: string;
  farm_area_ha: number | null;
  address: string;
  village: string;
  district: string;
  city: string;
  province: string;
  postal_code: string;
  bank_name: string;
  bank_account_number: string;
  bank_account_holder: string;
  bio: string;
};

type Props = {
  userId: string;
  email: string;
  initialProfile: FarmerProfile | null;
};

const emptyProfile = (userId: string): FarmerProfile => ({
  user_id: userId,
  full_name: "",
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
});

const inputClass =
  "w-full rounded-2xl border border-white bg-[#F8F6ED] px-4 py-3.5 text-sm text-[#245C43] outline-none shadow-[inset_3px_3px_8px_#e3e0d5,inset_-3px_-3px_8px_#ffffff] placeholder:text-[#9AA799] focus:ring-2 focus:ring-[#9DCD85]";

const cardClass =
  "rounded-[28px] border border-white bg-[#F8F6ED] p-5 shadow-[6px_6px_17px_#e1ddd0,-6px_-6px_17px_#ffffff] sm:p-7";

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-xs font-bold text-[#637762]">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className={inputClass}
      />
    </label>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof UserRound;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E4F0D9] text-[#378A45]">
        <Icon size={23} />
      </div>

      <div>
        <h2 className="text-lg font-black text-[#164A32]">
          {title}
        </h2>
        <p className="mt-1 text-xs leading-5 text-[#819080]">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function FarmerProfileForm({
  userId,
  email,
  initialProfile,
}: Props) {
  const router = useRouter();

  const [form, setForm] = useState<FarmerProfile>(
    initialProfile ?? emptyProfile(userId)
  );

  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [supabase] = useState(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

    const key =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!url || !key) {
      return null;
    }

    return createBrowserClient(url, key);
  });

  function update<K extends keyof FarmerProfile>(
    key: K,
    value: FarmerProfile[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setMessage("");
    setError("");
  }

  const displayName =
    form.full_name.trim() ||
    email.split("@")[0] ||
    "Petani SAVORA";

  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const completedFields = [
    form.full_name,
    form.phone,
    form.farm_name,
    form.farm_type,
    form.address,
    form.city,
    form.province,
    form.bank_name,
    form.bank_account_number,
    form.bank_account_holder,
  ].filter((value) => value.trim() !== "").length;

  const completion = Math.round((completedFields / 10) * 100);

  async function saveProfile(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      if (!supabase) {
        throw new Error(
          "Konfigurasi Supabase belum tersedia. Periksa file .env.local."
        );
      }

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user || user.id !== userId) {
        throw new Error(
          "Sesi login tidak valid. Silakan login kembali."
        );
      }

      if (!form.full_name.trim()) {
        throw new Error("Nama lengkap wajib diisi.");
      }

      if (
        form.phone.trim() &&
        !/^\+?[0-9\s-]{8,20}$/.test(form.phone.trim())
      ) {
        throw new Error(
          "Format nomor telepon tidak valid."
        );
      }

      const payload = {
        ...form,
        user_id: user.id,
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        farm_name: form.farm_name.trim(),
        farm_type: form.farm_type.trim(),
        address: form.address.trim(),
        village: form.village.trim(),
        district: form.district.trim(),
        city: form.city.trim(),
        province: form.province.trim(),
        postal_code: form.postal_code.trim(),
        bank_name: form.bank_name.trim(),
        bank_account_number:
          form.bank_account_number.trim(),
        bank_account_holder:
          form.bank_account_holder.trim(),
        bio: form.bio.trim(),
      };

      const { error: saveError } = await supabase
        .from("farmer_profiles")
        .upsert(payload, {
          onConflict: "user_id",
        });

      if (saveError) {
        throw saveError;
      }

      setMessage(
        "Profil berhasil disimpan ke SAVORA."
      );

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan profil."
      );
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    setLoggingOut(true);
    setError("");

    if (!supabase) {
      setError(
        "Konfigurasi Supabase belum tersedia."
      );
      setLoggingOut(false);
      return;
    }

    const { error: signOutError } =
      await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
      setLoggingOut(false);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-6 pb-10 text-[#164A32]">

      {/* HERO */}
      <section className="relative overflow-hidden rounded-[30px] border border-white bg-gradient-to-r from-[#E6F1D9] via-[#F8F6ED] to-[#FFF0BD] p-6 shadow-[7px_7px_18px_#e1ddd0,-7px_-7px_18px_#ffffff] sm:p-8">

        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border-[25px] border-white/30" />

        <div className="absolute bottom-0 right-16 h-24 w-24 rounded-full bg-[#F5C842]/25 blur-2xl" />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-extrabold text-[#408A3D]">
            <CircleUserRound size={16} />
            AKUN PETANI
          </span>

          <h1 className="mt-5 text-3xl font-black sm:text-4xl">
            Profil Saya
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-7 text-[#5D705D] sm:text-base">
            Kelola identitas, informasi usaha tani,
            alamat penjemputan, dan rekening penerimaan
            pembayaran.
          </p>
        </div>
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[330px_minmax(0,1fr)]">

        {/* SIDEBAR PROFIL */}
        <aside className="space-y-5">

          <div className={`${cardClass} text-center`}>

            <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-[35px] bg-gradient-to-br from-[#65B86A] to-[#176D40] text-4xl font-black text-white shadow-[5px_7px_15px_#c2d4b8]">

              {initials || <UserRound size={48} />}

              <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#F8F6ED] bg-[#F5C842] text-[#245C43]">
                <Leaf size={19} />
              </div>
            </div>

            <h2 className="mt-6 break-words text-xl font-black">
              {displayName}
            </h2>

            <p className="mt-1 break-all text-xs text-[#7E8D7C]">
              {email}
            </p>

            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#E0F2D6] px-4 py-2 text-xs font-extrabold text-[#33803E]">
              <BadgeCheck size={15} />
              Akun Petani
            </span>

            <div className="mt-6 border-t border-[#E6E8DD] pt-5 text-left">

              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#647A64]">
                  Kelengkapan Profil
                </p>

                <p className="text-sm font-black text-[#278044]">
                  {completion}%
                </p>
              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#E4E9DB]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#78C65E] to-[#1D854A] transition-all"
                  style={{
                    width: `${completion}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-xs leading-5 text-[#849282]">
                Lengkapi data untuk mempermudah koordinasi
                penjemputan dan pembayaran.
              </p>
            </div>
          </div>

          <div className={cardClass}>

            <h3 className="mb-4 text-sm font-black">
              Informasi Akun
            </h3>

            <div className="space-y-4">

              <div className="flex items-start gap-3">
                <Mail
                  size={18}
                  className="shrink-0 text-[#408A4C]"
                />

                <div className="min-w-0">
                  <p className="text-[11px] text-[#899787]">
                    Email
                  </p>

                  <p className="break-all text-xs font-bold">
                    {email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={18}
                  className="shrink-0 text-[#408A4C]"
                />

                <div>
                  <p className="text-[11px] text-[#899787]">
                    Keamanan
                  </p>

                  <p className="text-xs font-bold">
                    Dikelola oleh Supabase Auth
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Sprout
                  size={18}
                  className="shrink-0 text-[#408A4C]"
                />

                <div>
                  <p className="text-[11px] text-[#899787]">
                    Peran
                  </p>

                  <p className="text-xs font-bold">
                    Petani SAVORA
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              disabled={loggingOut}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#F8E4DC] px-5 py-3 text-sm font-extrabold text-[#B45243] transition hover:bg-[#F5D4CA] disabled:opacity-50"
            >
              {loggingOut ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <LogOut size={17} />
              )}

              Keluar dari Akun
            </button>
          </div>

          <div className="rounded-[25px] bg-gradient-to-br from-[#245C43] to-[#137B45] p-6 text-white shadow-[6px_7px_17px_#d0d8ca]">

            <Leaf
              size={32}
              className="text-[#F5C842]"
            />

            <h3 className="mt-4 text-lg font-black">
              From Surplus to Value
            </h3>

            <p className="mt-2 text-xs leading-6 text-white/80">
              Bersama SAVORA, hasil panen yang tidak
              terserap pasar dapat menjadi sumber nilai
              ekonomi baru.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#F5C842]">
              SAVORA
              <ChevronRight size={15} />
            </div>
          </div>
        </aside>

        {/* FORM PROFIL */}
        <form
          onSubmit={saveProfile}
          className="space-y-6"
        >

          {/* INFORMASI PRIBADI */}
          <section className={cardClass}>

            <SectionTitle
              icon={UserRound}
              title="Informasi Pribadi"
              description="Identitas utama yang digunakan pada akun petani."
            />

            <div className="grid gap-5 md:grid-cols-2">

              <Field
                label="Nama Lengkap"
                value={form.full_name}
                onChange={(v) =>
                  update("full_name", v)
                }
                placeholder="Masukkan nama lengkap"
                required
                maxLength={120}
              />

              <Field
                label="Nomor Telepon / WhatsApp"
                value={form.phone}
                onChange={(v) =>
                  update("phone", v)
                }
                placeholder="08xxxxxxxxxx"
                type="tel"
                maxLength={20}
              />

              <div className="md:col-span-2">
                <label className="block">

                  <span className="mb-2 block text-xs font-bold text-[#637762]">
                    Alamat Email
                  </span>

                  <div className="flex items-center gap-3 rounded-2xl border border-[#E3E8DC] bg-[#EFEEE6] px-4 py-3.5 text-sm text-[#7C8C7B]">

                    <Mail
                      size={17}
                      className="shrink-0"
                    />

                    <span className="min-w-0 break-all">
                      {email}
                    </span>
                  </div>

                  <p className="mt-2 text-[11px] text-[#899787]">
                    Email akun tidak dapat diubah melalui
                    formulir ini.
                  </p>

                </label>
              </div>
            </div>
          </section>

          {/* INFORMASI USAHA TANI */}
          <section className={cardClass}>

            <SectionTitle
              icon={Sprout}
              title="Informasi Usaha Tani"
              description="Data usaha pertanian dan komoditas yang dikelola."
            />

            <div className="grid gap-5 md:grid-cols-2">

              <Field
                label="Nama Usaha / Kebun"
                value={form.farm_name}
                onChange={(v) =>
                  update("farm_name", v)
                }
                placeholder="Contoh: Kebun Tani Makmur"
                maxLength={150}
              />

              <label className="block">
                <span className="mb-2 block text-xs font-bold text-[#637762]">
                  Jenis Usaha Tani
                </span>

                <div className="relative">
                  <select
                    value={form.farm_type}
                    onChange={(e) =>
                      update(
                        "farm_type",
                        e.target.value
                      )
                    }
                    className={`${inputClass} appearance-none pr-10`}
                  >
                    <option value="">
                      Pilih jenis usaha
                    </option>
                    <option value="Hortikultura">
                      Hortikultura
                    </option>
                    <option value="Sayuran">
                      Sayuran
                    </option>
                    <option value="Buah-buahan">
                      Buah-buahan
                    </option>
                    <option value="Tanaman Pangan">
                      Tanaman Pangan
                    </option>
                    <option value="Perkebunan">
                      Perkebunan
                    </option>
                    <option value="Campuran">
                      Campuran
                    </option>
                    <option value="Lainnya">
                      Lainnya
                    </option>
                  </select>

                  <ChevronRight
                    size={17}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-[#70816F]"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold text-[#637762]">
                  Luas Lahan (Hektare)
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.farm_area_ha ?? ""}
                  onChange={(e) =>
                    update(
                      "farm_area_ha",
                      e.target.value === ""
                        ? null
                        : Number(e.target.value)
                    )
                  }
                  placeholder="Contoh: 1.5"
                  className={inputClass}
                />
              </label>

              <div className="md:col-span-2">
                <label className="block">

                  <span className="mb-2 block text-xs font-bold text-[#637762]">
                    Deskripsi Usaha Tani
                  </span>

                  <textarea
                    value={form.bio}
                    onChange={(e) =>
                      update("bio", e.target.value)
                    }
                    rows={4}
                    maxLength={1000}
                    placeholder="Ceritakan secara singkat usaha tani dan hasil panen yang kamu kelola..."
                    className={`${inputClass} resize-y`}
                  />
                </label>
              </div>
            </div>
          </section>

          {/* ALAMAT PENJEMPUTAN */}
          <section className={cardClass}>

            <SectionTitle
              icon={MapPin}
              title="Alamat Penjemputan"
              description="Alamat utama yang dapat digunakan untuk koordinasi pengambilan surplus."
            />

            <div className="grid gap-5 md:grid-cols-2">

              <div className="md:col-span-2">
                <label className="block">

                  <span className="mb-2 block text-xs font-bold text-[#637762]">
                    Alamat Lengkap
                  </span>

                  <textarea
                    value={form.address}
                    onChange={(e) =>
                      update(
                        "address",
                        e.target.value
                      )
                    }
                    rows={3}
                    maxLength={500}
                    placeholder="Nama jalan, nomor, RT/RW, patokan lokasi..."
                    className={`${inputClass} resize-y`}
                  />
                </label>
              </div>

              <Field
                label="Desa / Kelurahan"
                value={form.village}
                onChange={(v) =>
                  update("village", v)
                }
                placeholder="Nama desa atau kelurahan"
              />

              <Field
                label="Kecamatan"
                value={form.district}
                onChange={(v) =>
                  update("district", v)
                }
                placeholder="Nama kecamatan"
              />

              <Field
                label="Kabupaten / Kota"
                value={form.city}
                onChange={(v) =>
                  update("city", v)
                }
                placeholder="Nama kabupaten atau kota"
              />

              <Field
                label="Provinsi"
                value={form.province}
                onChange={(v) =>
                  update("province", v)
                }
                placeholder="Nama provinsi"
              />

              <Field
                label="Kode Pos"
                value={form.postal_code}
                onChange={(v) =>
                  update("postal_code", v)
                }
                placeholder="Contoh: 31611"
                maxLength={10}
              />
            </div>
          </section>

          {/* INFORMASI REKENING */}
          <section className={cardClass}>

            <SectionTitle
              icon={Wallet}
              title="Informasi Rekening"
              description="Rekening yang dapat digunakan untuk penerimaan hasil penjualan surplus."
            />

            <div className="mb-5 flex items-start gap-3 rounded-2xl bg-[#FFF1CB] p-4">

              <ShieldCheck
                size={20}
                className="shrink-0 text-[#B18B1C]"
              />

              <p className="text-xs leading-6 text-[#876B26]">
                Pastikan rekening milikmu dan data yang
                dimasukkan benar. Informasi ini hanya
                disimpan sebagai data profil, bukan
                verifikasi rekening atau bukti pembayaran.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <label className="block">
                <span className="mb-2 block text-xs font-bold text-[#637762]">
                  Nama Bank
                </span>

                <div className="relative">

                  <Building2
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6A9768]"
                  />

                  <select
                    value={form.bank_name}
                    onChange={(e) =>
                      update(
                        "bank_name",
                        e.target.value
                      )
                    }
                    className={`${inputClass} appearance-none pl-11`}
                  >
                    <option value="">
                      Pilih bank
                    </option>

                    {[
                      "BRI",
                      "BNI",
                      "Mandiri",
                      "BCA",
                      "BSI",
                      "BTN",
                      "Bank Sumsel Babel",
                      "Bank Jambi",
                      "Lainnya",
                    ].map((bank) => (
                      <option
                        key={bank}
                        value={bank}
                      >
                        {bank}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <Field
                label="Nomor Rekening"
                value={form.bank_account_number}
                onChange={(v) =>
                  update(
                    "bank_account_number",
                    v.replace(/\D/g, "")
                  )
                }
                placeholder="Masukkan nomor rekening"
                maxLength={30}
              />

              <div className="md:col-span-2">
                <Field
                  label="Nama Pemilik Rekening"
                  value={form.bank_account_holder}
                  onChange={(v) =>
                    update(
                      "bank_account_holder",
                      v
                    )
                  }
                  placeholder="Nama sesuai rekening bank"
                  maxLength={120}
                />
              </div>
            </div>
          </section>

          {/* FEEDBACK */}
          {message && (
            <div
              role="status"
              className="flex items-center gap-3 rounded-2xl border border-[#C8E7C6] bg-[#E5F5DF] p-4 text-sm font-bold text-[#27763A]"
            >
              <CheckCircle2 size={21} />
              {message}
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"
            >
              {error}
            </div>
          )}

          {/* TOMBOL SIMPAN */}
          <div className="flex flex-col items-center justify-between gap-4 rounded-[26px] border border-white bg-[#F8F6ED] p-5 shadow-[5px_5px_14px_#e1ddd0,-5px_-5px_14px_#ffffff] sm:flex-row">

            <div className="flex items-center gap-3">
              <FileText
                size={22}
                className="text-[#488B4D]"
              />

              <div>
                <p className="text-sm font-black">
                  Simpan Perubahan Profil
                </p>

                <p className="mt-1 text-xs text-[#819080]">
                  Data akan tersimpan ke akun SAVORA kamu.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving || !supabase}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#42B66A] to-[#087338] px-7 py-3.5 text-sm font-extrabold text-white shadow-[4px_6px_12px_#b8c9a9] transition hover:-translate-y-0.5 disabled:opacity-60 sm:w-auto"
            >
              {saving ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Save size={18} />
              )}

              {saving
                ? "Menyimpan..."
                : "Simpan Profil"}
            </button>
          </div>

          <p className="flex items-center justify-center gap-2 text-center text-xs text-[#899787]">
            <CreditCard size={15} />
            SAVORA — From Surplus to Value
          </p>

        </form>
      </div>
    </div>
  );
}
