
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Info,
  Leaf,
  MapPin,
  Package,
  Save,
  Sprout,
  Wallet,
} from "lucide-react";

import {
  addProcessorRequirement,
  type ProcessorRequirement,
  type RequirementCategory,
} from "@/lib/data/processor-requirements";

import { formatRupiah } from "@/lib/data/processor-products";

const CATEGORIES: RequirementCategory[] = [
  "Sayuran",
  "Buah",
  "Umbi",
  "Campuran",
  "Lainnya",
];

const PURPOSES = [
  "Pengolahan pangan",
  "Produksi kompos",
  "Pakan ternak",
  "Produksi maggot BSF",
  "Lainnya",
];

export default function NewProcessorRequirementPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] =
    useState<RequirementCategory>("Sayuran");
  const [quantity, setQuantity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");
  const [deadline, setDeadline] = useState("");
  const [purpose, setPurpose] = useState(
    "Pengolahan pangan"
  );
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const quantityNumber = Number(quantity) || 0;
  const priceNumber = Number(maxPrice) || 0;
  const estimatedBudget = quantityNumber * priceNumber;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    setError("");

    if (
      !title.trim() ||
      !location.trim() ||
      !description.trim() ||
      !deadline
    ) {
      setError("Lengkapi semua informasi kebutuhan.");
      return;
    }

    if (
      !Number.isFinite(quantityNumber) ||
      !Number.isInteger(quantityNumber) ||
      quantityNumber <= 0 ||
      !Number.isFinite(priceNumber) ||
      !Number.isInteger(priceNumber) ||
      priceNumber < 0
    ) {
      setError(
        "Jumlah harus bilangan bulat positif dan harga tidak boleh negatif."
      );
      return;
    }

    const today = new Date();
    const todayString = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    if (deadline < todayString) {
      setError("Tanggal kebutuhan tidak boleh sebelum hari ini.");
      return;
    }

    setSaving(true);

    const requirement: ProcessorRequirement = {
      id: `REQ-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 6)
        .toUpperCase()}`,
      title: title.trim(),
      category,
      quantity: quantityNumber,
      unit: "kg",
      maxPrice: priceNumber,
      location: location.trim(),
      deadline,
      purpose,
      description: description.trim(),
      status: "Aktif",
      createdAt: new Date().toISOString(),
    };

    try {
      addProcessorRequirement(requirement);
      router.push("/processor/requirements");
    } catch {
      setError(
        "Gagal menyimpan kebutuhan. Periksa penyimpanan browser."
      );
      setSaving(false);
    }
  }

  const inputClass =
    "mt-2 h-12 w-full rounded-2xl border border-[#DCE6D5] bg-white px-4 text-sm text-[#245C43] outline-none transition placeholder:text-[#A1AEA0] focus:border-[#5DA66C] focus:ring-2 focus:ring-[#E0EED7]";

  return (
    <div className="mx-auto w-full max-w-[1200px] min-w-0 space-y-6 pb-6 text-[#245C43]">
      {/* BREADCRUMB */}
      <Link
        href="/processor/requirements"
        className="inline-flex items-center gap-2 text-xs font-bold text-[#39844E]"
      >
        <ArrowLeft size={16} />
        Kembali ke Kebutuhan
      </Link>

      <div>
        <p className="mb-2 flex items-center gap-2 text-xs font-bold text-[#81967C]">
          <Leaf size={15} />
          SAVORA / Pengolah / Kebutuhan Baru
        </p>

        <h1 className="text-2xl font-black sm:text-3xl">
          Buat Kebutuhan Baru
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#849482]">
          Tentukan bahan baku yang dibutuhkan untuk
          proses produksi usahamu.
        </p>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden rounded-[27px] bg-[#245C43] px-5 py-7 sm:px-8">
        <Sprout
          size={130}
          strokeWidth={1}
          className="pointer-events-none absolute -bottom-10 right-3 text-white/10"
        />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold text-[#E5F0DB]">
            <ClipboardList size={14} className="text-[#F5C842]" />
            Formulir Permintaan
          </span>

          <h2 className="mt-4 text-xl font-black text-white sm:text-2xl">
            Cari Bahan Baku Sesuai Kebutuhanmu
          </h2>

          <p className="mt-2 max-w-[550px] text-xs leading-6 text-[#DCEBDD]">
            Isi formulir dengan jelas agar kebutuhan bahan
            baku dapat dikelola dengan baik.
          </p>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)]"
      >
        {/* FORM */}
        <div className="min-w-0 space-y-6">
          <section className="rounded-[26px] border border-white bg-[#F8F6ED] p-5 shadow-[5px_5px_15px_#e4e2d7,-5px_-5px_15px_#ffffff] sm:p-7">
            <h2 className="flex items-center gap-2 text-lg font-black">
              <Package size={20} className="text-[#39844E]" />
              Informasi Bahan Baku
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="requirement-title"
                  className="text-xs font-extrabold"
                >
                  Nama Kebutuhan *
                </label>

                <input
                  id="requirement-title"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  maxLength={120}
                  placeholder="Contoh: Tomat Surplus untuk Produksi Saus"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="requirement-category"
                  className="text-xs font-extrabold"
                >
                  Kategori Bahan *
                </label>

                <select
                  id="requirement-category"
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target.value as RequirementCategory
                    )
                  }
                  className={inputClass}
                >
                  {CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="requirement-quantity"
                    className="text-xs font-extrabold"
                  >
                    Jumlah Dibutuhkan (kg) *
                  </label>

                  <input
                    id="requirement-quantity"
                    type="number"
                    min="1"
                    step="1"
                    value={quantity}
                    onChange={(event) =>
                      setQuantity(event.target.value)
                    }
                    placeholder="Contoh: 100"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="requirement-price"
                    className="text-xs font-extrabold"
                  >
                    Harga Maksimal / kg *
                  </label>

                  <input
                    id="requirement-price"
                    type="number"
                    min="0"
                    step="1"
                    value={maxPrice}
                    onChange={(event) =>
                      setMaxPrice(event.target.value)
                    }
                    placeholder="Contoh: 4000"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="requirement-purpose"
                  className="text-xs font-extrabold"
                >
                  Tujuan Pengolahan *
                </label>

                <select
                  id="requirement-purpose"
                  value={purpose}
                  onChange={(event) =>
                    setPurpose(event.target.value)
                  }
                  className={inputClass}
                >
                  {PURPOSES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-[26px] border border-white bg-[#F8F6ED] p-5 shadow-[5px_5px_15px_#e4e2d7,-5px_-5px_15px_#ffffff] sm:p-7">
            <h2 className="flex items-center gap-2 text-lg font-black">
              <MapPin size={20} className="text-[#39844E]" />
              Lokasi dan Waktu
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="requirement-location"
                  className="text-xs font-extrabold"
                >
                  Lokasi Pengiriman *
                </label>

                <input
                  id="requirement-location"
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                  maxLength={120}
                  placeholder="Contoh: Lubuklinggau, Sumatera Selatan"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="requirement-deadline"
                  className="text-xs font-extrabold"
                >
                  Batas Waktu Kebutuhan *
                </label>

                <div className="relative">
                  <input
                    id="requirement-deadline"
                    type="date"
                    value={deadline}
                    onChange={(event) =>
                      setDeadline(event.target.value)
                    }
                    className={inputClass}
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[26px] border border-white bg-[#F8F6ED] p-5 shadow-[5px_5px_15px_#e4e2d7,-5px_-5px_15px_#ffffff] sm:p-7">
            <h2 className="flex items-center gap-2 text-lg font-black">
              <ClipboardList
                size={20}
                className="text-[#39844E]"
              />
              Deskripsi Kebutuhan
            </h2>

            <div className="mt-6">
              <label
                htmlFor="requirement-description"
                className="text-xs font-extrabold"
              >
                Detail dan Persyaratan Bahan *
              </label>

              <textarea
                id="requirement-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows={6}
                maxLength={1000}
                placeholder="Jelaskan kondisi bahan baku yang dibutuhkan, toleransi bentuk atau ukuran, persyaratan kualitas, dan informasi lainnya..."
                className="mt-2 w-full resize-none rounded-2xl border border-[#DCE6D5] bg-white p-4 text-sm leading-6 outline-none placeholder:text-[#A1AEA0] focus:border-[#5DA66C]"
                required
              />

              <p className="mt-2 text-right text-[11px] text-[#8C9A89]">
                {description.length}/1000 karakter
              </p>
            </div>
          </section>
        </div>

        {/* SUMMARY */}
        <div className="min-w-0">
          <div className="space-y-5 rounded-[26px] border border-white bg-[#F8F6ED] p-5 shadow-[6px_6px_18px_#e4e2d7,-6px_-6px_18px_#ffffff] sm:p-6 lg:sticky lg:top-6">
            <h2 className="flex items-center gap-2 text-lg font-black">
              <ClipboardList
                size={20}
                className="text-[#39844E]"
              />
              Ringkasan Kebutuhan
            </h2>

            <div className="rounded-2xl bg-[#EDF2E7] p-4">
              <p className="text-xs text-[#829481]">
                Estimasi Anggaran Maksimal
              </p>

              <p className="mt-2 break-words text-2xl font-black text-[#087338]">
                {formatRupiah(estimatedBudget)}
              </p>

              <p className="mt-2 text-[11px] text-[#829481]">
                Berdasarkan jumlah × harga maksimal per kg
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between gap-3">
                <span className="text-[#829481]">
                  Kategori
                </span>
                <strong>{category}</strong>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-[#829481]">
                  Jumlah
                </span>
                <strong>{quantityNumber} kg</strong>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-[#829481]">
                  Harga maksimal
                </span>
                <strong>{formatRupiah(priceNumber)}/kg</strong>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-[#829481]">
                  Tujuan
                </span>
                <strong className="text-right">
                  {purpose}
                </strong>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-2xl bg-[#E8F1E1] p-4 text-[11px] leading-5 text-[#718671]">
              <Info size={17} className="mt-0.5 shrink-0" />
              Data akan disimpan secara lokal sebagai
              simulasi. Belum ada penawaran petani
              atau transaksi nyata.
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#245C43] px-5 py-4 text-sm font-extrabold text-white transition hover:bg-[#087338] disabled:opacity-60"
            >
              <Save size={18} />
              {saving
                ? "Menyimpan..."
                : "Simpan Kebutuhan"}
              <ArrowRight size={17} />
            </button>

            <Link
              href="/processor/requirements"
              className="flex w-full items-center justify-center rounded-2xl border border-[#DCE6D5] bg-white px-5 py-3.5 text-xs font-bold"
            >
              Batalkan
            </Link>
          </div>
        </div>
      </form>

      <div className="flex items-start gap-3 rounded-2xl bg-[#EAF2E4] p-4 text-xs leading-6 text-[#718671]">
        <CheckCircle2
          size={19}
          className="mt-0.5 shrink-0 text-[#39844E]"
        />
        Permintaan yang disimpan akan muncul pada
        halaman Kebutuhan Bahan Baku dan dapat
        dikelola melalui status Aktif, Terpenuhi,
        atau Ditutup.
      </div>
    </div>
  );
}
