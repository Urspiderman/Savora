
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  IdCard,
  Leaf,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Truck,
  UserRound,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export type CourierProfile = {
  user_id: string;
  full_name: string;
  phone: string;
  vehicle_type: string;
  vehicle_brand: string;
  license_plate: string;
  operational_area: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  emergency_contact: string;
  bio: string;
};

type Props = {
  userId: string;
  email: string;
  initialProfile: CourierProfile;
};

const cardStyle =
  "rounded-[26px] border border-white bg-[#F8F6ED] p-5 shadow-[5px_5px_15px_#e5e3d8,-5px_-5px_15px_#ffffff] sm:p-7";

const inputStyle =
  "mt-2 h-12 w-full rounded-2xl border border-[#DCE6D5] bg-white px-4 text-sm text-[#245C43] outline-none transition focus:border-[#39844E] focus:ring-2 focus:ring-[#39844E]/10";

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
};

function TextField({
  label,
  value,
  onChange,
  placeholder,
  required,
  disabled,
}: TextFieldProps) {
  return (
    <label className="block min-w-0">
      <span className="text-xs font-extrabold text-[#245C43]">
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={inputStyle}
      />
    </label>
  );
}

export default function CourierProfileForm({
  userId,
  email,
  initialProfile,
}: Props) {
  const [form, setForm] =
    useState<CourierProfile>(initialProfile);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function update(
    field: keyof CourierProfile,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
    setSuccess("");
    setError("");
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const supabase = createClient();

      const cleaned = {
        ...form,
        user_id: userId,
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        vehicle_type: form.vehicle_type.trim(),
        vehicle_brand: form.vehicle_brand.trim(),
        license_plate: form.license_plate.trim().toUpperCase(),
        operational_area: form.operational_area.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        province: form.province.trim(),
        postal_code: form.postal_code.trim(),
        emergency_contact: form.emergency_contact.trim(),
        bio: form.bio.trim(),
      };

      const { error: saveError } = await supabase
        .from("courier_profiles")
        .upsert(
          {
            ...cleaned,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

      if (saveError) throw saveError;

      setForm(cleaned);
      setSuccess("Profil kurir berhasil disimpan.");
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

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-7 pb-8 text-[#245C43]">
      {/* HEADER */}
      <div>
        <p className="mb-2 flex items-center gap-2 text-xs font-bold text-[#81967C]">
          <Leaf size={15} />
          SAVORA / Kurir / Profil
        </p>

        <h1 className="text-2xl font-black sm:text-3xl">
          Profil Kurir
        </h1>

        <p className="mt-2 text-sm text-[#849482]">
          Kelola identitas, kendaraan, dan wilayah operasional.
        </p>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden rounded-[30px] bg-[#245C43] px-6 py-9 text-white sm:px-10">
        <Truck
          size={220}
          strokeWidth={0.8}
          className="pointer-events-none absolute -bottom-20 -right-5 hidden text-white/10 sm:block"
        />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold text-[#F5D56A]">
            <ShieldCheck size={14} />
            SAVORA Courier
          </span>

          <h2 className="mt-5 text-2xl font-black sm:text-3xl">
            Identitas Profesional,
            <span className="block text-[#F5D56A]">
              Pengiriman Terpercaya.
            </span>
          </h2>

          <p className="mt-3 max-w-lg text-xs leading-6 text-[#DCEBDD]">
            Lengkapi profil untuk mendukung pengelolaan
            tugas logistik SAVORA.
          </p>
        </div>
      </section>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ACCOUNT */}
        <section className={cardStyle}>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E5F0DF] text-[#39844E]">
              <UserRound size={23} />
            </span>

            <div>
              <h2 className="text-lg font-black">
                Informasi Pribadi
              </h2>
              <p className="mt-1 text-xs text-[#829481]">
                Data identitas akun kurir.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <TextField
              label="Nama Lengkap"
              value={form.full_name}
              onChange={(value) => update("full_name", value)}
              placeholder="Nama lengkap kurir"
              required
              disabled={saving}
            />

            <TextField
              label="Nomor Telepon"
              value={form.phone}
              onChange={(value) => update("phone", value)}
              placeholder="08xxxxxxxxxx"
              required
              disabled={saving}
            />

            <div className="sm:col-span-2">
              <label className="text-xs font-extrabold">
                Email Akun
              </label>

              <div className="mt-2 flex h-12 items-center gap-3 rounded-2xl border border-[#DCE6D5] bg-[#EDF2E7] px-4 text-sm text-[#718671]">
                <Mail size={17} />
                <span className="truncate">{email}</span>
              </div>

              <p className="mt-2 text-[11px] text-[#829481]">
                Email mengikuti akun Supabase dan tidak
                dapat diubah melalui formulir ini.
              </p>
            </div>
          </div>
        </section>

        {/* VEHICLE */}
        <section className={cardStyle}>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0C8] text-[#A47C27]">
              <Truck size={23} />
            </span>

            <div>
              <h2 className="text-lg font-black">
                Informasi Kendaraan
              </h2>
              <p className="mt-1 text-xs text-[#829481]">
                Kendaraan yang digunakan untuk pengiriman.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label>
              <span className="text-xs font-extrabold">
                Jenis Kendaraan
                <span className="ml-1 text-red-500">*</span>
              </span>

              <select
                value={form.vehicle_type}
                onChange={(event) =>
                  update("vehicle_type", event.target.value)
                }
                required
                disabled={saving}
                className={inputStyle}
              >
                <option value="">Pilih kendaraan</option>
                <option value="Motor">Motor</option>
                <option value="Motor Roda Tiga">
                  Motor Roda Tiga
                </option>
                <option value="Mobil Pickup">
                  Mobil Pickup
                </option>
                <option value="Mobil Box">Mobil Box</option>
                <option value="Truk">Truk</option>
              </select>
            </label>

            <TextField
              label="Merek / Model Kendaraan"
              value={form.vehicle_brand}
              onChange={(value) =>
                update("vehicle_brand", value)
              }
              placeholder="Contoh: Suzuki Carry"
              disabled={saving}
            />

            <TextField
              label="Nomor Polisi"
              value={form.license_plate}
              onChange={(value) =>
                update("license_plate", value)
              }
              placeholder="Contoh: BG 1234 XX"
              required
              disabled={saving}
            />

            <TextField
              label="Kontak Darurat"
              value={form.emergency_contact}
              onChange={(value) =>
                update("emergency_contact", value)
              }
              placeholder="08xxxxxxxxxx"
              disabled={saving}
            />
          </div>
        </section>

        {/* LOCATION */}
        <section className={cardStyle}>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4ECF8] text-[#4A6BA4]">
              <MapPin size={23} />
            </span>

            <div>
              <h2 className="text-lg font-black">
                Wilayah Operasional
              </h2>
              <p className="mt-1 text-xs text-[#829481]">
                Area layanan dan alamat kurir.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <TextField
                label="Wilayah Layanan"
                value={form.operational_area}
                onChange={(value) =>
                  update("operational_area", value)
                }
                placeholder="Contoh: Lubuklinggau dan Musi Rawas"
                required
                disabled={saving}
              />
            </div>

            <div className="sm:col-span-2">
              <TextField
                label="Alamat Lengkap"
                value={form.address}
                onChange={(value) =>
                  update("address", value)
                }
                placeholder="Jalan, RT/RW, kelurahan, kecamatan"
                disabled={saving}
              />
            </div>

            <TextField
              label="Kota / Kabupaten"
              value={form.city}
              onChange={(value) => update("city", value)}
              placeholder="Kota atau kabupaten"
              disabled={saving}
            />

            <TextField
              label="Provinsi"
              value={form.province}
              onChange={(value) => update("province", value)}
              placeholder="Provinsi"
              disabled={saving}
            />

            <TextField
              label="Kode Pos"
              value={form.postal_code}
              onChange={(value) =>
                update("postal_code", value)
              }
              placeholder="Kode pos"
              disabled={saving}
            />
          </div>
        </section>

        {/* BIO */}
        <section className={cardStyle}>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E5F0DF] text-[#39844E]">
              <IdCard size={23} />
            </span>

            <div>
              <h2 className="text-lg font-black">
                Informasi Tambahan
              </h2>
              <p className="mt-1 text-xs text-[#829481]">
                Keterangan tentang layanan kurir.
              </p>
            </div>
          </div>

          <label className="mt-6 block">
            <span className="text-xs font-extrabold">
              Deskripsi Singkat
            </span>

            <textarea
              value={form.bio}
              onChange={(event) =>
                update("bio", event.target.value)
              }
              rows={4}
              disabled={saving}
              placeholder="Ceritakan pengalaman atau layanan pengiriman..."
              className="mt-2 w-full resize-y rounded-2xl border border-[#DCE6D5] bg-white p-4 text-sm outline-none focus:border-[#39844E]"
            />
          </label>
        </section>

        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="flex items-center gap-2 rounded-2xl border border-[#B7D6B1] bg-[#E5F0DF] p-4 text-sm font-bold text-[#245C43]"
          >
            <CheckCircle2 size={20} />
            {success}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/courier/dashboard"
            className="inline-flex items-center gap-2 rounded-2xl border border-[#DCE6D5] bg-white px-5 py-3.5 text-xs font-extrabold"
          >
            <ArrowLeft size={17} />
            Kembali
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#245C43] px-7 py-3.5 text-xs font-extrabold text-white transition hover:bg-[#087338] disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {saving ? "Menyimpan..." : "Simpan Profil"}
          </button>
        </div>
      </form>
    </div>
  );
}
