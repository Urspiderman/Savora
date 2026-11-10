
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Leaf,
  MapPin,
  Package,
  Phone,
  Search,
  Scale,
  Sprout,
  Truck,
  UserRound,
  X,
} from "lucide-react";

type PickupStatus =
  | "pending"
  | "scheduled"
  | "on_the_way"
  | "picked_up"
  | "completed"
  | "cancelled";

export type PickupRecord = {
  id: string;
  pickup_code: string;
  commodity_name: string;
  estimated_weight_kg: number;
  pickup_address: string;
  pickup_date: string;
  pickup_time: string;
  courier_name: string | null;
  courier_phone: string | null;
  vehicle_type: string | null;
  vehicle_plate: string | null;
  notes: string | null;
  status: PickupStatus;
  created_at: string;
};

type Props = {
  pickups: PickupRecord[];
};

const statusConfig: Record<
  PickupStatus,
  {
    label: string;
    className: string;
    dot: string;
  }
> = {
  pending: {
    label: "Menunggu Konfirmasi",
    className: "bg-[#FFF0C4] text-[#8E6A08]",
    dot: "bg-[#E7AD20]",
  },
  scheduled: {
    label: "Terjadwal",
    className: "bg-[#DDECD6] text-[#387B39]",
    dot: "bg-[#55A14A]",
  },
  on_the_way: {
    label: "Kurir Menuju Lokasi",
    className: "bg-[#DBEEFF] text-[#24699A]",
    dot: "bg-[#3B8EC7]",
  },
  picked_up: {
    label: "Sudah Dijemput",
    className: "bg-[#E7E2FA] text-[#6552A1]",
    dot: "bg-[#8C77CE]",
  },
  completed: {
    label: "Selesai",
    className: "bg-[#D7F3CB] text-[#246E32]",
    dot: "bg-[#4CA748]",
  },
  cancelled: {
    label: "Dibatalkan",
    className: "bg-[#F6DFDC] text-[#A44B43]",
    dot: "bg-[#D36E65]",
  },
};

const commodityImages: Record<string, string> = {
  tomat: "/images/farmer/tomato.webp",
  kangkung: "/images/farmer/kangkung.webp",
  pisang: "/images/farmer/banana.webp",
  wortel: "/images/farmer/wortel.webp",
  kol: "/images/farmer/kol.webp",
  terong: "/images/farmer/terong.webp",
  jagung: "/images/farmer/jagung.webp",
  cabai: "/images/farmer/cabai.webp",
  kentang: "/images/farmer/kentang.webp",
  pakcoy: "/images/farmer/pakcoy.webp",
};

function getImage(name: string) {
  const normalized = name.toLowerCase();

  for (const [key, value] of Object.entries(commodityImages)) {
    if (normalized.includes(key)) {
      return `${value}?v=savora-reject-2026`;
    }
  }

  return "/images/farmer/vegetable-crate.webp";
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

export default function FarmerPickupBoard({ pickups }: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<PickupRecord | null>(null);

  const activeCount = pickups.filter((item) =>
    ["pending", "scheduled", "on_the_way"].includes(item.status)
  ).length;

  const completedCount = pickups.filter(
    (item) => item.status === "completed"
  ).length;

  const totalWeight = pickups
    .filter((item) => item.status !== "cancelled")
    .reduce(
      (total, item) => total + Number(item.estimated_weight_kg),
      0
    );

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return pickups
      .filter((item) => {
        const matchesQuery =
          !query ||
          [
            item.pickup_code,
            item.commodity_name,
            item.pickup_address,
            item.courier_name ?? "",
          ].some((value) => value.toLowerCase().includes(query));

        return (
          matchesQuery &&
          (status === "all" || item.status === status)
        );
      })
      .sort((a, b) => {
        const aTime = new Date(a.pickup_date).getTime();
        const bTime = new Date(b.pickup_date).getTime();

        return bTime - aTime;
      });
  }, [pickups, search, status]);

  return (
    <div className="mx-auto max-w-[1500px] space-y-6 pb-8 text-[#164A32]">
      {/* HERO */}
      <section className="relative isolate overflow-hidden rounded-[30px] border border-white bg-gradient-to-r from-[#E7F1DA] via-[#F6F5E9] to-[#FFF0BD] shadow-[7px_7px_18px_#e1ddd0,-7px_-7px_18px_#ffffff]">
        <Image
          src="/images/farmer/farm-landscape.webp"
          alt=""
          width={950}
          height={400}
          className="pointer-events-none absolute bottom-0 right-0 -z-10 w-[85%] max-w-[900px] opacity-40"
        />

        <div className="relative grid gap-5 p-6 sm:p-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-xs font-bold text-[#408A3D]">
              <Truck size={16} />
              LOGISTIK SAVORA
            </span>

            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Penjemputan Panen
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-7 text-[#5D705D] sm:text-base">
              Pantau jadwal pengambilan surplus panen reject,
              informasi kurir, dan status pengiriman menuju
              pengolah organik.
            </p>
          </div>

          <div className="pointer-events-none relative hidden h-[195px] items-center justify-center lg:flex">
            <div className="flex h-40 w-40 items-center justify-center rounded-[40px] border border-white/70 bg-white/45 shadow-[7px_7px_18px_#c9d3bd,-7px_-7px_18px_#ffffff]">
              <Truck
                size={90}
                strokeWidth={1.4}
                className="text-[#287D43]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* STATISTIK */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
        {[
          {
            label: "Total Penjemputan",
            value: pickups.length,
            icon: Package,
            tone: "bg-[#E5F2D5] text-[#4C9638]",
          },
          {
            label: "Dalam Proses",
            value: activeCount,
            icon: Truck,
            tone: "bg-[#FFF0C0] text-[#D5A318]",
          },
          {
            label: "Selesai",
            value: completedCount,
            icon: CheckCircle2,
            tone: "bg-[#DDF0DD] text-[#2F9856]",
          },
          {
            label: "Total Berat",
            value: `${totalWeight.toLocaleString("id-ID")} kg`,
            icon: Scale,
            tone: "bg-[#E8EAFB] text-[#6E71BC]",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-[24px] border border-white bg-[#F8F6ED] p-4 shadow-[5px_5px_13px_#e1ddd0,-5px_-5px_13px_#ffffff] sm:p-5"
            >
              <div className={`mb-3 inline-flex rounded-2xl p-3 ${item.tone}`}>
                <Icon size={23} />
              </div>

              <p className="break-words text-xl font-black sm:text-2xl">
                {item.value}
              </p>

              <p className="mt-1 text-xs text-[#758374]">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* SEARCH DAN FILTER */}
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#648065]"
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari kode, komoditas, lokasi, atau kurir..."
            className="w-full rounded-full border border-white bg-[#F8F6ED] py-3.5 pl-12 pr-5 text-sm outline-none shadow-[4px_5px_12px_#dedbcf,-4px_-4px_12px_#ffffff] focus:ring-2 focus:ring-[#80BC72]"
          />
        </div>

        <div className="relative md:w-[240px]">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full appearance-none rounded-full border border-white bg-[#F8F6ED] px-5 py-3.5 pr-10 text-sm font-semibold outline-none shadow-[4px_5px_12px_#dedbcf,-4px_-4px_12px_#ffffff] focus:ring-2 focus:ring-[#80BC72]"
          >
            <option value="all">Semua Status</option>
            {Object.entries(statusConfig).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </select>

          <ChevronDown
            size={17}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
          />
        </div>
      </div>

      {/* JUDUL LIST */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black sm:text-2xl">
            Daftar Penjemputan
          </h2>
          <p className="mt-1 text-sm text-[#758374]">
            {filtered.length} penjemputan ditemukan
          </p>
        </div>
      </div>

      {/* KARTU PENJEMPUTAN */}
      {filtered.length === 0 ? (
        <div className="rounded-[28px] border border-white bg-[#F8F6ED] px-6 py-14 text-center shadow-[6px_6px_16px_#e1ddd0,-6px_-6px_16px_#ffffff]">
          <Truck
            size={48}
            className="mx-auto text-[#5B9B3E]"
          />
          <h3 className="mt-4 text-xl font-black">
            Belum Ada Penjemputan
          </h3>
          <p className="mt-2 text-sm text-[#7A8978]">
            Jadwal penjemputan akan tampil setelah permintaan
            tercatat di SAVORA.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((item) => {
            const config = statusConfig[item.status];

            return (
              <article
                key={item.id}
                className="rounded-[26px] border border-white bg-[#F8F6ED] p-4 shadow-[5px_6px_15px_#e0dccf,-5px_-5px_15px_#ffffff] sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-[#7C907B]">
                      {item.pickup_code}
                    </p>
                    <h3 className="mt-1 text-lg font-black">
                      {item.commodity_name}
                    </h3>
                  </div>

                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-extrabold ${config.className}`}>
                    <span className={`h-2 w-2 rounded-full ${config.dot}`} />
                    {config.label}
                  </span>
                </div>

                <div className="mt-4 flex gap-4">
                  <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[20px] bg-[#EAF1DF] sm:h-32 sm:w-32">
                    <Image
                      src={getImage(item.commodity_name)}
                      alt={item.commodity_name}
                      width={130}
                      height={130}
                      unoptimized
                      className="h-full w-full object-contain p-2"
                    />
                  </div>

                  <div className="min-w-0 flex-1 space-y-2.5 text-xs text-[#627762] sm:text-sm">
                    <p className="flex items-center gap-2">
                      <Scale size={16} className="shrink-0 text-[#398A43]" />
                      <strong className="text-[#164A32]">
                        {Number(item.estimated_weight_kg).toLocaleString("id-ID")} kg
                      </strong>
                    </p>

                    <p className="flex items-start gap-2">
                      <CalendarDays size={16} className="mt-0.5 shrink-0 text-[#398A43]" />
                      <span>{formatDate(item.pickup_date)}</span>
                    </p>

                    <p className="flex items-center gap-2">
                      <Clock3 size={16} className="shrink-0 text-[#398A43]" />
                      {item.pickup_time}
                    </p>

                    <p className="flex items-start gap-2">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-[#398A43]" />
                      <span className="line-clamp-2">
                        {item.pickup_address}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 rounded-[18px] bg-[#F0F1E8] p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DCECCF] text-[#287D43]">
                      <UserRound size={20} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] text-[#84917E]">
                        Kurir Penjemputan
                      </p>
                      <p className="truncate text-xs font-extrabold sm:text-sm">
                        {item.courier_name ?? "Belum ditugaskan"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelected(item)}
                    className="shrink-0 rounded-full bg-[#087338] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#065B2D]"
                  >
                    Detail
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#092A1B]/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelected(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Detail penjemputan"
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[30px] border border-white bg-[#F8F6ED] p-5 shadow-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-[#6F8B6D]">
                  DETAIL PENJEMPUTAN
                </p>
                <h2 className="mt-1 text-xl font-black">
                  {selected.pickup_code}
                </h2>
              </div>

              <button
                type="button"
                aria-label="Tutup detail"
                onClick={() => setSelected(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8EDE2]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-4 rounded-[22px] bg-[#EDF2E5] p-4">
              <Image
                src={getImage(selected.commodity_name)}
                alt={selected.commodity_name}
                width={90}
                height={90}
                unoptimized
                className="h-20 w-20 object-contain"
              />

              <div>
                <h3 className="font-black">
                  {selected.commodity_name}
                </h3>
                <p className="mt-1 text-sm text-[#70816F]">
                  {Number(selected.estimated_weight_kg).toLocaleString("id-ID")} kg
                </p>
                <span className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${statusConfig[selected.status].className}`}>
                  {statusConfig[selected.status].label}
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-4 text-sm">
              <div className="flex gap-3">
                <CalendarDays size={19} className="shrink-0 text-[#398A43]" />
                <div>
                  <p className="font-bold">Jadwal Penjemputan</p>
                  <p className="mt-1 text-[#70816F]">
                    {formatDate(selected.pickup_date)} • {selected.pickup_time}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <MapPin size={19} className="shrink-0 text-[#398A43]" />
                <div>
                  <p className="font-bold">Alamat Penjemputan</p>
                  <p className="mt-1 text-[#70816F]">
                    {selected.pickup_address}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <UserRound size={19} className="shrink-0 text-[#398A43]" />
                <div>
                  <p className="font-bold">Kurir</p>
                  <p className="mt-1 text-[#70816F]">
                    {selected.courier_name ?? "Belum ditugaskan"}
                  </p>
                  {selected.vehicle_type && (
                    <p className="mt-1 text-[#70816F]">
                      {selected.vehicle_type}
                      {selected.vehicle_plate
                        ? ` • ${selected.vehicle_plate}`
                        : ""}
                    </p>
                  )}
                </div>
              </div>

              {selected.courier_phone && (
                <div className="flex gap-3">
                  <Phone size={19} className="shrink-0 text-[#398A43]" />
                  <div>
                    <p className="font-bold">Nomor Kurir</p>
                    <a
                      href={`tel:${selected.courier_phone}`}
                      className="mt-1 inline-block font-bold text-[#087338] underline"
                    >
                      {selected.courier_phone}
                    </a>
                  </div>
                </div>
              )}

              {selected.notes && (
                <div className="rounded-[18px] bg-[#EDF1E6] p-4">
                  <p className="font-bold">Catatan</p>
                  <p className="mt-1 leading-6 text-[#70816F]">
                    {selected.notes}
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-6 w-full rounded-full bg-gradient-to-b from-[#40B667] to-[#087338] py-3.5 font-extrabold text-white"
            >
              Tutup Detail
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 pt-2 text-xs text-[#879582]">
        <Leaf size={15} />
        Penjemputan terhubung dengan akun SAVORA kamu.
      </div>
    </div>
  );
}
