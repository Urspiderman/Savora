
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Building2,
  Check,
  CheckCircle2,
  Factory,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Sprout,
  UserRound,
  X,
} from "lucide-react";

export type ProcessorProfile = {
  user_id: string;
  full_name: string;
  phone: string;
  business_name: string;
  business_type: string;
  processing_types: string[];
  capacity_kg_per_day: number | null;
  description: string;
  address: string;
  village: string;
  district: string;
  city: string;
  province: string;
  postal_code: string;
  operating_hours: string;
};

type Props = {
  userId: string;
  email: string;
  initialProfile: ProcessorProfile;
};

const PROCESSING_OPTIONS = [
  "Pengolahan pangan",
  "Produksi kompos",
  "Produksi maggot BSF",
  "Pakan ternak",
  "Produk fermentasi",
  "Lainnya",
];

const BUSINESS_TYPES = [
  "UMKM Pengolahan",
  "Industri Pengolahan",
  "Koperasi",
  "Usaha Kompos",
  "Peternakan",
  "Lainnya",
];

const inputClass =
  "mt-2 w-full rounded-2xl border border-[#DCE6D5] bg-white px-4 py-3 text-sm text-[#245C43] outline-none transition focus:border-[#5DA66C] focus:ring-2 focus:ring-[#E0EED7]";

export default function ProcessorProfileForm({
  userId,
  email,
  initialProfile,
}: Props) {
  const [profile, setProfile] =
    useState<ProcessorProfile>(initialProfile);

  const [draft, setDraft] =
    useState<ProcessorProfile>(initialProfile);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField<K extends keyof ProcessorProfile>(
    key: K,
    value: ProcessorProfile[K]
  ) {
    setDraft((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function toggleProcessingType(value: string) {
    setDraft((previous) => ({
      ...previous,
      processing_types: previous.processing_types.includes(value)
        ? previous.processing_types.filter(
            (item) => item !== value
          )
        : [...previous.processing_types, value],
    }));
  }

  function startEdit() {
    setDraft({
      ...profile,
      processing_types: [...profile.processing_types],
    });
    setError("");
    setSuccess("");
    setEditing(true);
  }

  function cancelEdit() {
    setDraft({
      ...profile,
      processing_types: [...profile.processing_types],
    });
    setEditing(false);
    setError("");
  }

  async function handleSave(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    if (saving) return;

    setError("");
    setSuccess("");

    if (
      !draft.full_name.trim() ||
      !draft.business_name.trim() ||
      !draft.business_type.trim()
    ) {
      setError(
        "Nama lengkap, nama usaha, dan jenis usaha wajib diisi."
      );
      return;
    }

    if (
      draft.capacity_kg_per_day !== null &&
      (!Number.isFinite(draft.capacity_kg_per_day) ||
        draft.capacity_kg_per_day < 0)
    ) {
      setError("Kapasitas pengolahan tidak valid.");
      return;
    }

    setSaving(true);

    const cleaned: ProcessorProfile = {
      ...draft,
      user_id: userId,
      full_name: draft.full_name.trim(),
      phone: draft.phone.trim(),
      business_name: draft.business_name.trim(),
      business_type: draft.business_type.trim(),
      description: draft.description.trim(),
      address: draft.address.trim(),
      village: draft.village.trim(),
      district: draft.district.trim(),
      city: draft.city.trim(),
      province: draft.province.trim(),
      postal_code: draft.postal_code.trim(),
      operating_hours: draft.operating_hours.trim(),
    };

    try {
      const supabase = createClient();

      const { error: saveError } = await supabase
        .from("processor_profiles")
        .upsert(
          {
            ...cleaned,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

      if (saveError) throw saveError;

      setProfile(cleaned);
      setDraft(cleaned);
      setEditing(false);
      setSuccess("Profil usaha berhasil diperbarui.");
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

  function Field({
    label,
    field,
    type = "text",
    required = false,
  }: {
    label: string;
    field: keyof ProcessorProfile;
    type?: string;
    required?: boolean;
  }) {
    return (
      <label className="block text-xs font-extrabold">
        {label}
        <input
          type={type}
          value={String(draft[field] ?? "")}
          onChange={(event) => {
            if (field === "capacity_kg_per_day") {
              updateField(
                "capacity_kg_per_day",
                event.target.value === ""
                  ? null
                  : Number(event.target.value)
              );
            } else {
              setDraft((previous) => ({
                ...previous,
                [field]: event.target.value,
              }));
            }
          }}
          required={required}
          min={
            field === "capacity_kg_per_day"
              ? 0
              : undefined
          }
          step={
            field === "capacity_kg_per_day"
              ? "any"
              : undefined
          }
          className={inputClass}
        />
      </label>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-7 pb-8 text-[#245C43]">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-bold text-[#81967C]">
            <Leaf size={15} />
            SAVORA / Pengolah / Profil
          </p>

          <h1 className="text-2xl font-black sm:text-3xl">
            Profil Pengolah
          </h1>

          <p className="mt-2 text-sm text-[#849482]">
            Kelola informasi akun dan identitas usaha pengolahan.
          </p>
        </div>

        {!editing && (
          <button
            type="button"
            onClick={startEdit}
            className="rounded-2xl bg-[#245C43] px-5 py-3 text-xs font-extrabold text-white hover:bg-[#087338]"
          >
            Edit Profil
          </button>
        )}
      </div>

      {success && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-2xl bg-[#E4F1DF] p-4 text-xs font-bold text-[#39844E]"
        >
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      {/* PROFILE HERO */}
      <section className="relative overflow-hidden rounded-[30px] bg-[#245C43] px-6 py-8 text-white sm:px-10">
        <Sprout
          size={170}
          strokeWidth={1}
          className="pointer-events-none absolute -bottom-12 right-4 text-white/10"
        />

        <div className="relative z-10 flex flex-wrap items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-[25px] border border-white/20 bg-white/15">
            <UserRound size={38} />
          </div>

          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold text-[#F5D56A]">
              <ShieldCheck size={14} />
              Akun Pengolah
            </span>

            <h2 className="mt-3 break-words text-2xl font-black sm:text-3xl">
              {profile.full_name || "Pengguna SAVORA"}
            </h2>

            <p className="mt-2 break-all text-sm text-[#DCEBDD]">
              {email}
            </p>
          </div>

          <span className="rounded-full bg-[#F5C842] px-4 py-2 text-xs font-extrabold text-[#245C43]">
            Pengolah
          </span>
        </div>
      </section>

      {editing ? (
        <form onSubmit={handleSave} className="space-y-6">
          {/* ACCOUNT */}
          <section className="rounded-[26px] border border-white bg-[#F8F6ED] p-5 shadow-[5px_5px_15px_#e4e2d7,-5px_-5px_15px_#ffffff] sm:p-7">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-black">
              <UserRound size={20} />
              Informasi Akun
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Nama Lengkap *"
                field="full_name"
                required
              />

              <label className="block text-xs font-extrabold">
                Email Akun
                <input
                  type="email"
                  value={email}
                  disabled
                  className={`${inputClass} cursor-not-allowed bg-[#EEF1E9] text-[#81917E]`}
                />
              </label>

              <Field label="Nomor Telepon" field="phone" type="tel" />
            </div>
          </section>

          {/* BUSINESS */}
          <section className="rounded-[26px] border border-white bg-[#F8F6ED] p-5 shadow-[5px_5px_15px_#e4e2d7,-5px_-5px_15px_#ffffff] sm:p-7">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-black">
              <Building2 size={20} />
              Informasi Usaha
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Nama Usaha *"
                field="business_name"
                required
              />

              <label className="block text-xs font-extrabold">
                Jenis Usaha
                <select
                  value={draft.business_type}
                  onChange={(event) =>
                    updateField("business_type", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Pilih jenis usaha</option>
                  {BUSINESS_TYPES.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <Field
                label="Kapasitas Pengolahan (kg/hari)"
                field="capacity_kg_per_day"
                type="number"
              />

              <Field
                label="Jam Operasional"
                field="operating_hours"
              />

              <div className="sm:col-span-2">
                <label className="block text-xs font-extrabold">
                  Deskripsi Usaha
                  <textarea
                    rows={5}
                    value={draft.description}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    className={inputClass}
                  />
                </label>
              </div>
            </div>
          </section>

          {/* PROCESSING */}
          <section className="rounded-[26px] border border-white bg-[#F8F6ED] p-5 shadow-[5px_5px_15px_#e4e2d7,-5px_-5px_15px_#ffffff] sm:p-7">
            <h3 className="mb-5 flex items-center gap-2 text-lg font-black">
              <Factory size={20} />
              Jenis Pengolahan
            </h3>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {PROCESSING_OPTIONS.map((option) => {
                const selected =
                  draft.processing_types.includes(option);

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleProcessingType(option)}
                    aria-pressed={selected}
                    className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-xs font-bold ${
                      selected
                        ? "border-[#8CB88B] bg-[#E5F1DE]"
                        : "border-[#DFE7D8] bg-white"
                    }`}
                  >
                    {option}

                    {selected && (
                      <Check size={17} className="text-[#39844E]" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ADDRESS */}
          <section className="rounded-[26px] border border-white bg-[#F8F6ED] p-5 shadow-[5px_5px_15px_#e4e2d7,-5px_-5px_15px_#ffffff] sm:p-7">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-black">
              <MapPin size={20} />
              Lokasi Usaha
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Alamat" field="address" />
              </div>

              <Field label="Desa / Kelurahan" field="village" />
              <Field label="Kecamatan" field="district" />
              <Field label="Kota / Kabupaten" field="city" />
              <Field label="Provinsi" field="province" />
              <Field label="Kode Pos" field="postal_code" />
            </div>
          </section>

          {error && (
            <div
              role="alert"
              className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700"
            >
              {error}
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#DCE6D5] bg-white px-6 py-3 text-sm font-bold"
            >
              <X size={17} />
              Batalkan
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#245C43] px-6 py-3 text-sm font-extrabold text-white disabled:opacity-60"
            >
              <Save size={17} />
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      ) : (
        /* PROFILE OVERVIEW */
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <section className="rounded-[26px] border border-white bg-[#F8F6ED] p-6 shadow-[5px_5px_15px_#e4e2d7,-5px_-5px_15px_#ffffff]">
              <h3 className="flex items-center gap-2 text-lg font-black">
                <UserRound size={20} />
                Informasi Akun
              </h3>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoCard
                  icon={UserRound}
                  label="Nama Lengkap"
                  value={profile.full_name}
                />
                <InfoCard
                  icon={Mail}
                  label="Email Akun"
                  value={email}
                />
                <InfoCard
                  icon={Phone}
                  label="Nomor Telepon"
                  value={profile.phone}
                />
                <InfoCard
                  icon={ShieldCheck}
                  label="Peran"
                  value="Pengolah"
                />
              </div>
            </section>

            <section className="rounded-[26px] border border-white bg-[#F8F6ED] p-6 shadow-[5px_5px_15px_#e4e2d7,-5px_-5px_15px_#ffffff]">
              <h3 className="flex items-center gap-2 text-lg font-black">
                <Building2 size={20} />
                Informasi Usaha
              </h3>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoCard
                  icon={Building2}
                  label="Nama Usaha"
                  value={profile.business_name}
                />
                <InfoCard
                  icon={Factory}
                  label="Jenis Usaha"
                  value={profile.business_type}
                />
                <InfoCard
                  icon={Sprout}
                  label="Kapasitas Pengolahan"
                  value={
                    profile.capacity_kg_per_day === null
                      ? "-"
                      : `${profile.capacity_kg_per_day} kg/hari`
                  }
                />
                <InfoCard
                  icon={CalendarIcon}
                  label="Jam Operasional"
                  value={profile.operating_hours}
                />
              </div>

              <div className="mt-5 rounded-2xl bg-[#EFF3E9] p-4">
                <p className="text-xs font-bold text-[#829481]">
                  Deskripsi Usaha
                </p>
                <p className="mt-2 text-sm leading-7 text-[#245C43]">
                  {profile.description || "Belum diisi."}
                </p>
              </div>
            </section>

            <section className="rounded-[26px] border border-white bg-[#F8F6ED] p-6 shadow-[5px_5px_15px_#e4e2d7,-5px_-5px_15px_#ffffff]">
              <h3 className="flex items-center gap-2 text-lg font-black">
                <MapPin size={20} />
                Alamat Usaha
              </h3>

              <p className="mt-5 text-sm leading-7 text-[#738771]">
                {[
                  profile.address,
                  profile.village,
                  profile.district,
                  profile.city,
                  profile.province,
                  profile.postal_code,
                ]
                  .filter(Boolean)
                  .join(", ") || "Belum diisi."}
              </p>
            </section>
          </div>

          <div className="space-y-6">
            <section className="relative overflow-hidden rounded-[26px] bg-[#245C43] p-6 text-white">
              <Sprout
                size={130}
                strokeWidth={1}
                className="pointer-events-none absolute -bottom-10 -right-7 text-white/10"
              />

              <div className="relative z-10">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <Factory size={25} />
                </span>

                <h3 className="mt-5 text-xl font-black">
                  Mitra Pengolah SAVORA
                </h3>

                <p className="mt-3 text-xs leading-6 text-[#DCEBDD]">
                  Menghubungkan kebutuhan bahan baku usaha
                  dengan surplus hasil panen petani.
                </p>

                <div className="mt-5 rounded-2xl border border-white/15 bg-white/10 p-4">
                  <p className="text-xs text-[#DCEBDD]">
                    Kapasitas Pengolahan
                  </p>

                  <p className="mt-2 text-3xl font-black text-[#F5C842]">
                    {profile.capacity_kg_per_day ?? 0}
                    <span className="ml-2 text-sm text-white">
                      kg/hari
                    </span>
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[26px] border border-white bg-[#F8F6ED] p-6 shadow-[5px_5px_15px_#e4e2d7,-5px_-5px_15px_#ffffff]">
              <h3 className="flex items-center gap-2 text-lg font-black">
                <Leaf size={20} />
                Bidang Pengolahan
              </h3>

              <div className="mt-5 flex flex-wrap gap-2">
                {profile.processing_types.length ? (
                  profile.processing_types.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-[#E5F1DE] px-3 py-2 text-xs font-bold text-[#39844E]"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-[#829481]">
                    Belum ada jenis pengolahan.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

function CalendarIcon({ size = 18 }: { size?: number }) {
  return <Factory size={size} />;
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType<{ size?: number }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-2xl bg-[#EFF3E9] p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E0ECDD] text-[#39844E]">
        <Icon size={19} />
      </span>

      <div className="min-w-0">
        <p className="text-[11px] text-[#8B9A88]">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-extrabold">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}
