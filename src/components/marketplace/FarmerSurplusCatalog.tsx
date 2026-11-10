
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Leaf,
  MapPin,
  Package,
  Plus,
  Search,
  Scale,
  SlidersHorizontal,
  Sprout,
  Tag,
  X,
} from "lucide-react";

import {
  type SurplusListing,
  formatRupiah,
  SURPLUS_STATUS_LABELS,
} from "@/types/surplus";

type Props = {
  listings: SurplusListing[];
};

const PAGE_SIZE = 10;

// Seluruh gambar surplus reject SAVORA
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

function getCommodityImage(commodity: string) {
  const name = commodity.toLowerCase().trim();

  for (const [key, path] of Object.entries(commodityImages)) {
    if (name.includes(key)) {
      return `${path}?v=savora-reject-2026`;
    }
  }

  return "/images/farmer/vegetable-crate.webp";
}

function getStatusStyle(status: SurplusListing["status"]) {
  switch (status) {
    case "available":
      return "bg-[#D7F3CB] text-[#246E32]";
    case "reserved":
      return "bg-[#FFE49B] text-[#765500]";
    case "sold":
      return "bg-[#E3E7EB] text-[#52606C]";
    default:
      return "bg-[#F2E2DC] text-[#985D48]";
  }
}

export default function FarmerSurplusCatalog({
  listings,
}: Props) {
  const [search, setSearch] = useState("");
  const [commodity, setCommodity] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const commodities = useMemo(
    () =>
      [...new Set(listings.map((item) => item.commodity))].sort(
        (a, b) => a.localeCompare(b, "id")
      ),
    [listings]
  );

  const totalWeight = listings.reduce(
    (sum, item) => sum + Number(item.quantity_kg),
    0
  );

  const totalValue = listings.reduce(
    (sum, item) =>
      sum +
      Number(item.quantity_kg) * Number(item.price_per_kg),
    0
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return listings
      .filter((item) => {
        const matchesSearch =
          !query ||
          [item.title, item.commodity, item.location].some(
            (value) => (value ?? "").toLowerCase().includes(query)
          );

        const matchesCommodity =
          commodity === "all" || item.commodity === commodity;

        const matchesStatus =
          status === "all" || item.status === status;

        return (
          matchesSearch &&
          matchesCommodity &&
          matchesStatus
        );
      })
      .sort((a, b) => {
        if (sort === "oldest") {
          return (
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
          );
        }

        if (sort === "price-low") {
          return (
            Number(a.price_per_kg) -
            Number(b.price_per_kg)
          );
        }

        if (sort === "price-high") {
          return (
            Number(b.price_per_kg) -
            Number(a.price_per_kg)
          );
        }

        if (sort === "weight-high") {
          return (
            Number(b.quantity_kg) -
            Number(a.quantity_kg)
          );
        }

        return (
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
        );
      });
  }, [listings, search, commodity, status, sort]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const hasFilters =
    search !== "" ||
    commodity !== "all" ||
    status !== "all";

  const selectClass =
    "w-full appearance-none rounded-full border border-white bg-[#F8F6ED] py-3.5 pl-11 pr-10 text-sm font-semibold text-[#164A32] outline-none shadow-[4px_5px_12px_#dedbcf,-4px_-4px_12px_#ffffff] focus:ring-2 focus:ring-[#80BC72]";

  function resetFilters() {
    setSearch("");
    setCommodity("all");
    setStatus("all");
    setSort("newest");
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-6 pb-6 text-[#164A32]">
      {/* BANNER SURPLUS */}
      <section className="relative isolate overflow-hidden rounded-[30px] border border-white bg-gradient-to-r from-[#E9F1D9] via-[#F4F5E9] to-[#FFF0BD] shadow-[7px_7px_18px_#e1ddd0,-7px_-7px_18px_#ffffff]">
        <Image
          src="/images/farmer/farm-landscape.webp"
          alt=""
          width={950}
          height={400}
          className="pointer-events-none absolute bottom-0 right-0 -z-10 w-[85%] max-w-[900px] opacity-50"
        />

        <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.8fr] lg:items-center">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-bold text-[#408A3D]">
              <Leaf size={15} />
              KELOLA HASIL PANEN
            </span>

            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Surplus Panen
            </h1>

            <p className="mt-3 max-w-md text-sm leading-7 text-[#5D705D] sm:text-base">
              Kelola hasil panen reject, tidak terjual, atau
              tidak memenuhi standar pasar untuk dimanfaatkan
              kembali oleh pengolah kompos.
            </p>

            <Link
              href="/farmer/surplus/new"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#42B66A] to-[#087338] px-5 py-3 text-sm font-extrabold text-white shadow-[4px_6px_12px_#b6c9a6] lg:hidden"
            >
              <Plus size={18} />
              Tambah Surplus
            </Link>
          </div>

          <div className="pointer-events-none relative hidden h-[205px] items-end justify-center lg:flex">
            <Image
              src="/images/farmer/farmer-hero.webp"
              alt="Petani SAVORA membawa hasil panen"
              width={320}
              height={320}
              className="relative z-10 max-h-[245px] w-auto object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* STATISTIK */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        {[
          {
            label: "Total Surplus",
            value: listings.length.toLocaleString("id-ID"),
            icon: Sprout,
            tone: "bg-[#E5F2D5] text-[#4C9638]",
          },
          {
            label: "Total Berat",
            value: `${totalWeight.toLocaleString("id-ID")} kg`,
            icon: Scale,
            tone: "bg-[#FFF0C0] text-[#D5A318]",
          },
          {
            label: "Total Nilai Penawaran",
            value: formatRupiah(totalValue),
            icon: Package,
            tone: "bg-[#E5F2D5] text-[#4C9638]",
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

      {/* PENCARIAN DAN FILTER */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.6fr_1fr_1fr_1fr_auto]">
        <div className="relative">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#648065]"
          />

          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Cari tomat, pisang, kangkung..."
            aria-label="Cari surplus panen"
            className="w-full rounded-full border border-white bg-[#F8F6ED] py-3.5 pl-12 pr-5 text-sm outline-none shadow-[4px_5px_12px_#dedbcf,-4px_-4px_12px_#ffffff] focus:ring-2 focus:ring-[#80BC72]"
          />
        </div>

        <div className="relative">
          <Sprout
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#42863D]"
          />

          <select
            aria-label="Filter komoditas"
            value={commodity}
            onChange={(event) => {
              setCommodity(event.target.value);
              setPage(1);
            }}
            className={selectClass}
          >
            <option value="all">Semua Komoditas</option>
            {commodities.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
          />
        </div>

        <div className="relative">
          <Tag
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#42863D]"
          />

          <select
            aria-label="Filter status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            className={selectClass}
          >
            <option value="all">Semua Status</option>
            <option value="available">Tersedia</option>
            <option value="reserved">Dipesan</option>
            <option value="sold">Terjual</option>
            <option value="closed">Ditutup</option>
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
          />
        </div>

        <div className="relative">
          <SlidersHorizontal
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#42863D]"
          />

          <select
            aria-label="Urutkan surplus"
            value={sort}
            onChange={(event) => {
              setSort(event.target.value);
              setPage(1);
            }}
            className={selectClass}
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="price-low">Harga Termurah</option>
            <option value="price-high">Harga Termahal</option>
            <option value="weight-high">Berat Terbanyak</option>
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
          />
        </div>

        <Link
          href="/farmer/surplus/new"
          className="hidden items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-b from-[#40B667] to-[#087338] px-6 py-3.5 text-sm font-extrabold text-white shadow-[4px_6px_12px_#b8c9a9] transition hover:-translate-y-0.5 xl:inline-flex"
        >
          <Plus size={19} />
          Tambah Surplus
        </Link>
      </div>

      {/* JUMLAH HASIL */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#718071]">
          Menampilkan{" "}
          <strong className="text-[#164A32]">
            {filtered.length === 0
              ? 0
              : (currentPage - 1) * PAGE_SIZE + 1}
            {" – "}
            {Math.min(currentPage * PAGE_SIZE, filtered.length)}
          </strong>{" "}
          dari{" "}
          <strong className="text-[#164A32]">
            {filtered.length}
          </strong>{" "}
          surplus
        </p>

        {hasFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#087338]"
          >
            <X size={15} />
            Reset Filter
          </button>
        )}
      </div>

      {/* GRID 10 PRODUK SURPLUS */}
      {visible.length === 0 ? (
        <div className="rounded-[28px] border border-white bg-[#F8F6ED] px-6 py-14 text-center shadow-[6px_6px_16px_#e1ddd0,-6px_-6px_16px_#ffffff]">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#E8F1DA]">
            <Leaf size={42} className="text-[#5B9B3E]" />
          </div>

          <h2 className="mt-5 text-xl font-black">
            Surplus Tidak Ditemukan
          </h2>

          <p className="mt-2 text-sm text-[#7A8978]">
            Coba ubah pencarian atau tambahkan surplus baru.
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-full bg-[#E6EED9] px-5 py-3 text-sm font-bold text-[#245C43]"
            >
              Reset Filter
            </button>

            <Link
              href="/farmer/surplus/new"
              className="rounded-full bg-[#087338] px-5 py-3 text-sm font-bold text-white"
            >
              Tambah Surplus
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-5">
          {visible.map((item) => (
            <article
              key={item.id}
              className="group flex min-w-0 flex-col overflow-hidden rounded-[24px] border border-white bg-[#F8F6ED] p-3 shadow-[5px_6px_15px_#e0dccf,-5px_-5px_15px_#ffffff] transition hover:-translate-y-1 sm:p-4"
            >
              <div className="relative flex h-28 items-center justify-center rounded-[19px] bg-gradient-to-b from-[#F0F3E7] to-[#F8F6ED] sm:h-36">
                <Image
                  src={getCommodityImage(item.commodity)}
                  alt={`Foto surplus reject ${item.commodity}`}
                  width={180}
                  height={160}
                  unoptimized
                  className="h-full w-full object-contain p-1 transition duration-300 group-hover:scale-105"
                />

                <span
                  className={`absolute right-1 top-1 rounded-full px-2 py-1 text-[9px] font-extrabold sm:right-2 sm:top-2 sm:px-3 sm:text-[10px] ${getStatusStyle(item.status)}`}
                >
                  {SURPLUS_STATUS_LABELS[item.status]}
                </span>
              </div>

              <div className="flex flex-1 flex-col pt-3">
                <p className="text-[10px] font-semibold text-[#63934F] sm:text-xs">
                  {item.commodity}
                </p>

                <h3 className="mt-1 line-clamp-2 min-h-[36px] text-sm font-black leading-snug sm:text-base">
                  {item.title}
                </h3>

                <div className="mt-3 space-y-2 text-[11px] text-[#617261] sm:text-xs">
                  <p className="flex items-center gap-1.5">
                    <Scale size={14} className="shrink-0" />
                    {Number(item.quantity_kg).toLocaleString("id-ID")} kg
                  </p>

                  <p className="flex items-start gap-1.5">
                    <MapPin size={14} className="mt-0.5 shrink-0" />
                    <span className="line-clamp-1">
                      {item.location}
                    </span>
                  </p>
                </div>

                <div className="mt-auto flex items-end justify-between gap-1 pt-4">
                  <div className="min-w-0">
                    <p className="text-[10px] text-[#84917E]">
                      Harga / kg
                    </p>

                    <p className="break-words text-xs font-black text-[#087338] sm:text-sm">
                      {formatRupiah(Number(item.price_per_kg))}
                    </p>
                  </div>

                  <Link
                    href={`/farmer/surplus/${item.id}/edit`}
                    aria-label={`Kelola ${item.title}`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E0F2C8] text-[#087338] transition hover:bg-[#087338] hover:text-white"
                  >
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-center gap-3 pt-3">
          <button
            type="button"
            aria-label="Halaman sebelumnya"
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9E9DF] disabled:opacity-40"
          >
            <ChevronLeft size={19} />
          </button>

          <span className="rounded-xl bg-[#087338] px-4 py-2.5 text-sm font-extrabold text-white">
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            aria-label="Halaman berikutnya"
            disabled={currentPage === totalPages}
            onClick={() => setPage(currentPage + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9E9DF] disabled:opacity-40"
          >
            <ChevronRight size={19} />
          </button>
        </div>
      )}

      <p className="text-center text-xs text-[#8A9787]">
        Data surplus milik akun petani yang sedang masuk.
      </p>
    </div>
  );
}
