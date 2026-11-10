
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Save, Sprout, MapPin, Scale,
  CalendarDays, BadgeDollarSign, Lock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type {
  SurplusListing,
  SurplusCondition,
} from "@/types/surplus";

type Props = {
  initial?: SurplusListing;
};

export default function SurplusForm({ initial }: Props) {
  const router = useRouter();
  const isEditing = Boolean(initial);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [commodity, setCommodity] = useState(initial?.commodity ?? "");
  const [description, setDescription] = useState(
    initial?.description ?? ""
  );
  const [quantity, setQuantity] = useState(
    initial ? String(initial.quantity_kg) : ""
  );
  const [price, setPrice] = useState(
    initial ? String(initial.price_per_kg) : ""
  );
  const [condition, setCondition] = useState<SurplusCondition>(
    initial?.condition ?? "good"
  );
  const [location, setLocation] = useState(
    initial?.location ?? ""
  );
  const [harvestDate, setHarvestDate] = useState(
    initial?.harvest_date ?? ""
  );
  const [availableUntil, setAvailableUntil] = useState(
    initial?.available_until ?? ""
  );
  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);
  const [error, setError] = useState("");

  const locked = Boolean(
    initial && initial.status !== "available"
  );

  const inputClass =
    "w-full rounded-2xl border border-[#E5E4D9] bg-[#F8F6ED] px-4 py-3.5 text-sm text-[#164A32] outline-none shadow-[inset_4px_4px_9px_#e3dfd3,inset_-4px_-4px_9px_#ffffff] focus:border-[#5A9D49] disabled:opacity-60";

  const labelClass =
    "mb-2 flex items-center gap-2 text-sm font-bold text-[#245C43]";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const kg = Number(quantity);
    const cost = Number(price);

    if (!Number.isFinite(kg) || kg <= 0) {
      setError("Berat surplus harus lebih dari 0 kg.");
      return;
    }

    if (!Number.isFinite(cost) || cost < 0) {
      setError("Harga per kg tidak valid.");
      return;
    }

    if (
      harvestDate &&
      availableUntil &&
      availableUntil < harvestDate
    ) {
      setError("Tanggal tersedia tidak boleh sebelum tanggal panen.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Sesi login berakhir. Silakan masuk kembali.");
      }

      const payload = {
        title: title.trim(),
        commodity: commodity.trim(),
        description: description.trim() || null,
        quantity_kg: kg,
        price_per_kg: cost,
        condition,
        location: location.trim(),
        harvest_date: harvestDate || null,
        available_until: availableUntil || null,
      };

      if (initial) {
        if (initial.status !== "available") {
          throw new Error("Surplus ini tidak dapat diedit.");
        }

        const { error: updateError } = await supabase
          .from("surplus_listings")
          .update(payload)
          .eq("id", initial.id)
          .eq("farmer_id", user.id)
          .eq("status", "available")
          .select("id")
          .single();

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("surplus_listings")
          .insert({
            ...payload,
            farmer_id: user.id,
          });

        if (insertError) throw insertError;
      }

      router.push("/farmer/surplus");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan surplus."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleClose() {
    if (!initial || initial.status !== "available") return;

    if (!window.confirm("Tutup penawaran surplus ini?")) return;

    setClosing(true);
    setError("");

    try {
      const supabase = createClient();
      const { error: closeError } = await supabase.rpc(
        "close_my_surplus",
        { listing_id: initial.id }
      );

      if (closeError) throw closeError;

      router.push("/farmer/surplus");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menutup penawaran."
      );
    } finally {
      setClosing(false);
    }
  }

  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      <Link
        href="/farmer/surplus"
        className="inline-flex items-center gap-2 text-sm font-bold text-[#087338]"
      >
        <ArrowLeft size={18} />
        Kembali ke Surplus
      </Link>

      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[#5C9C3D]">
          <Sprout size={19} />
          Manajemen Surplus
        </div>
        <h1 className="text-2xl font-extrabold sm:text-3xl">
          {isEditing ? "Edit Surplus Panen" : "Tambah Surplus Panen"}
        </h1>
        <p className="mt-2 text-sm text-[#728071]">
          {isEditing
            ? "Perbarui informasi hasil panen yang kamu tawarkan."
            : "Isi informasi hasil panen berlebih agar dapat ditemukan pengolah kompos."}
        </p>
      </div>

      {locked && (
        <div className="flex items-center gap-3 rounded-2xl bg-[#FFF0CF] p-4 text-sm text-[#8A611C]">
          <Lock size={20} />
          Penawaran dengan status {initial?.status} tidak dapat diedit.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-[28px] border border-white bg-[#F8F6ED] p-5 shadow-[7px_7px_18px_#e0dccf,-7px_-7px_18px_#ffffff] sm:p-8"
      >
        <fieldset disabled={loading || locked} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="title" className={labelClass}>
                <Sprout size={17} /> Judul Surplus
              </label>
              <input
                id="title"
                className={inputClass}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Tomat hasil panen berlebih"
                maxLength={120}
                required
              />
            </div>

            <div>
              <label htmlFor="commodity" className={labelClass}>
                <Sprout size={17} /> Komoditas
              </label>
              <input
                id="commodity"
                className={inputClass}
                value={commodity}
                onChange={(e) => setCommodity(e.target.value)}
                placeholder="Contoh: Tomat"
                maxLength={80}
                required
              />
            </div>

            <div>
              <label htmlFor="condition" className={labelClass}>
                Kondisi Hasil Panen
              </label>
              <select
                id="condition"
                className={inputClass}
                value={condition}
                onChange={(e) =>
                  setCondition(e.target.value as SurplusCondition)
                }
              >
                <option value="good">Layak Konsumsi</option>
                <option value="imperfect">Bentuk Tidak Sempurna</option>
                <option value="overripe">Terlalu Matang</option>
              </select>
            </div>

            <div>
              <label htmlFor="quantity" className={labelClass}>
                <Scale size={17} /> Berat Surplus (kg)
              </label>
              <input
                id="quantity"
                type="number"
                min="0.01"
                step="0.01"
                className={inputClass}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Contoh: 25"
                required
              />
            </div>

            <div>
              <label htmlFor="price" className={labelClass}>
                <BadgeDollarSign size={17} /> Harga per kg (Rp)
              </label>
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                className={inputClass}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Contoh: 2000"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="location" className={labelClass}>
                <MapPin size={17} /> Lokasi Pengambilan
              </label>
              <input
                id="location"
                className={inputClass}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Desa, kecamatan, kabupaten/kota"
                required
              />
            </div>

            <div>
              <label htmlFor="harvestDate" className={labelClass}>
                <CalendarDays size={17} /> Tanggal Panen
              </label>
              <input
                id="harvestDate"
                type="date"
                className={inputClass}
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="availableUntil" className={labelClass}>
                <CalendarDays size={17} /> Tersedia Sampai
              </label>
              <input
                id="availableUntil"
                type="date"
                className={inputClass}
                value={availableUntil}
                onChange={(e) => setAvailableUntil(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className={labelClass}>
                Deskripsi Surplus
              </label>
              <textarea
                id="description"
                rows={5}
                className={inputClass}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan kondisi, kualitas, dan informasi tambahan..."
              />
            </div>
          </div>
        </fieldset>

        {error && (
          <p role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          {!locked && (
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#49B76D] to-[#087338] px-7 py-3.5 font-bold text-white shadow-md disabled:opacity-60"
            >
              <Save size={18} />
              {loading ? "Menyimpan..." : "Simpan Surplus"}
            </button>
          )}

          <Link
            href="/farmer/surplus"
            className="inline-flex items-center rounded-full bg-[#E8F1DA] px-7 py-3.5 font-bold text-[#245C43]"
          >
            Kembali
          </Link>

          {initial?.status === "available" && (
            <button
              type="button"
              onClick={handleClose}
              disabled={closing}
              className="ml-auto rounded-full bg-[#FCE5DC] px-6 py-3.5 text-sm font-bold text-[#9A4334] disabled:opacity-60"
            >
              {closing ? "Menutup..." : "Tutup Penawaran"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
