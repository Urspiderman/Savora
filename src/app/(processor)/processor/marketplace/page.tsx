
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  ArrowRight,
  ShoppingBag,
  Sprout,
  Package,
  Leaf,
  ChevronDown,
  X,
  CheckCircle2,
  TrendingDown,
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: "Sayuran" | "Buah" | "Umbi";
  image: string;
  farmer: string;
  location: string;
  price: number;
  stock: number;
  unit: string;
  condition: string;
  grade: string;
};

const PRODUCTS: Product[] = [
  {
    id: "demo-tomat",
    name: "Tomat Surplus",
    category: "Sayuran",
    image: "/images/farmer/tomato.webp",
    farmer: "Pak Ahmad",
    location: "Lubuklinggau",
    price: 3500,
    stock: 120,
    unit: "kg",
    condition: "Ukuran tidak seragam",
    grade: "Grade B",
  },
  {
    id: "demo-wortel",
    name: "Wortel Segar",
    category: "Umbi",
    image: "/images/farmer/wortel.webp",
    farmer: "Bu Siti",
    location: "Musi Rawas",
    price: 4000,
    stock: 85,
    unit: "kg",
    condition: "Bentuk tidak sempurna",
    grade: "Grade B",
  },
  {
    id: "demo-pisang",
    name: "Pisang Matang",
    category: "Buah",
    image: "/images/farmer/banana.webp",
    farmer: "Pak Joko",
    location: "Lubuklinggau",
    price: 3000,
    stock: 150,
    unit: "kg",
    condition: "Matang, perlu segera diolah",
    grade: "Grade B",
  },
  {
    id: "demo-kentang",
    name: "Kentang Surplus",
    category: "Umbi",
    image: "/images/farmer/kentang.webp",
    farmer: "Bu Rina",
    location: "Musi Rawas",
    price: 5500,
    stock: 90,
    unit: "kg",
    condition: "Ukuran kecil",
    grade: "Grade B",
  },
  {
    id: "demo-kol",
    name: "Kubis Segar",
    category: "Sayuran",
    image: "/images/farmer/kol.webp",
    farmer: "Pak Bambang",
    location: "Lubuklinggau",
    price: 2500,
    stock: 200,
    unit: "kg",
    condition: "Daun luar kurang rapi",
    grade: "Grade B",
  },
  {
    id: "demo-terong",
    name: "Terong Ungu",
    category: "Sayuran",
    image: "/images/farmer/terong.webp",
    farmer: "Bu Dewi",
    location: "Musi Rawas",
    price: 3200,
    stock: 75,
    unit: "kg",
    condition: "Bentuk bervariasi",
    grade: "Grade B",
  },
  {
    id: "demo-cabai",
    name: "Cabai Merah",
    category: "Sayuran",
    image: "/images/farmer/cabai.webp",
    farmer: "Pak Hendra",
    location: "Lubuklinggau",
    price: 12000,
    stock: 45,
    unit: "kg",
    condition: "Ukuran tidak seragam",
    grade: "Grade B",
  },
  {
    id: "demo-jagung",
    name: "Jagung Surplus",
    category: "Sayuran",
    image: "/images/farmer/jagung.webp",
    farmer: "Bu Lilis",
    location: "Musi Rawas",
    price: 2800,
    stock: 180,
    unit: "kg",
    condition: "Tongkol berukuran kecil",
    grade: "Grade B",
  },
];

const CATEGORIES = ["Semua", "Sayuran", "Buah", "Umbi"] as const;

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProcessorMarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("Semua");
  const [sort, setSort] = useState("terbaru");
  const [showFilters, setShowFilters] = useState(false);
  const [onlyLargeStock, setOnlyLargeStock] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter((product) => {
      const keyword = search.toLowerCase().trim();

      const matchesSearch =
        product.name.toLowerCase().includes(keyword) ||
        product.farmer.toLowerCase().includes(keyword) ||
        product.location.toLowerCase().includes(keyword);

      const matchesCategory =
        category === "Semua" || product.category === category;

      const matchesStock =
        !onlyLargeStock || product.stock >= 100;

      return matchesSearch && matchesCategory && matchesStock;
    });

    if (sort === "termurah") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sort === "termahal") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    if (sort === "stok") {
      result = [...result].sort((a, b) => b.stock - a.stock);
    }

    return result;
  }, [search, category, sort, onlyLargeStock]);

  function resetFilters() {
    setSearch("");
    setCategory("Semua");
    setSort("terbaru");
    setOnlyLargeStock(false);
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] min-w-0 space-y-7 text-[#245C43]">
      {/* HEADING */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#81967C]">
          <Leaf size={15} />
          SAVORA / Marketplace
        </div>

        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
          Marketplace Surplus
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#849482]">
          Temukan hasil panen surplus dari petani untuk kebutuhan
          bahan baku usahamu.
        </p>
      </div>

      {/* HERO */}
      <section className="relative isolate overflow-hidden rounded-[28px] bg-[#245C43] px-5 py-7 sm:px-9 sm:py-9">
        <div className="pointer-events-none absolute -right-16 -top-20 h-60 w-60 rounded-full border-[35px] border-white/[0.06]" />

        <Sprout
          size={155}
          strokeWidth={1}
          className="pointer-events-none absolute -bottom-10 right-2 text-white/10 sm:right-16"
        />

        <div className="relative z-10 max-w-[620px]">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold text-[#EAF4E0]">
            <Sprout size={14} className="text-[#F5C842]" />
            SAVORA Marketplace
          </span>

          <h2 className="mt-4 text-2xl font-black leading-tight text-white sm:text-3xl">
            Panen Berlebih,
            <span className="block text-[#F5C842]">
              Peluang Lebih Besar.
            </span>
          </h2>

          <p className="mt-3 max-w-[480px] text-xs leading-6 text-[#DCEBDD] sm:text-sm">
            Pilih bahan baku sesuai kebutuhan produksi dan bantu
            petani memanfaatkan hasil panennya.
          </p>
        </div>
      </section>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-[20px] border border-white bg-[#F8F6ED] p-4 shadow-[4px_4px_12px_#e5e3d8,-4px_-4px_12px_#ffffff]">
          <Package size={20} className="text-[#348443]" />
          <p className="mt-3 text-2xl font-black">{PRODUCTS.length}</p>
          <p className="text-[11px] text-[#839581]">
            Contoh Produk
          </p>
        </div>

        <div className="rounded-[20px] border border-white bg-[#F8F6ED] p-4 shadow-[4px_4px_12px_#e5e3d8,-4px_-4px_12px_#ffffff]">
          <Sprout size={20} className="text-[#348443]" />
          <p className="mt-3 text-2xl font-black">
            {PRODUCTS.reduce((sum, item) => sum + item.stock, 0)}
            <span className="ml-1 text-sm">kg</span>
          </p>
          <p className="text-[11px] text-[#839581]">
            Stok Simulasi
          </p>
        </div>

        <div className="col-span-2 rounded-[20px] border border-white bg-[#F8F6ED] p-4 shadow-[4px_4px_12px_#e5e3d8,-4px_-4px_12px_#ffffff] sm:col-span-1">
          <TrendingDown size={20} className="text-[#348443]" />
          <p className="mt-3 text-2xl font-black">
            {formatRupiah(Math.min(...PRODUCTS.map((p) => p.price)))}
          </p>
          <p className="text-[11px] text-[#839581]">
            Harga Mulai / kg (Demo)
          </p>
        </div>
      </div>

      {/* SEARCH AND FILTER */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#829781]"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari tomat, wortel, pisang..."
              aria-label="Cari produk surplus"
              className="h-12 w-full rounded-2xl border border-[#DFE7D8] bg-white pl-12 pr-4 text-sm text-[#245C43] outline-none transition placeholder:text-[#A1AEA0] focus:border-[#5DA66C] focus:ring-2 focus:ring-[#DCECDD]"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            aria-expanded={showFilters}
            className={`flex h-12 items-center justify-center gap-2 rounded-2xl border px-5 text-sm font-bold transition ${
              showFilters
                ? "border-[#245C43] bg-[#245C43] text-white"
                : "border-[#DFE7D8] bg-white text-[#245C43]"
            }`}
          >
            <SlidersHorizontal size={18} />
            Filter
            <ChevronDown
              size={16}
              className={showFilters ? "rotate-180" : ""}
            />
          </button>
        </div>

        {/* CATEGORIES */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-bold transition ${
                category === item
                  ? "bg-[#245C43] text-white shadow-md"
                  : "border border-[#DFE7D8] bg-white text-[#6E856D] hover:bg-[#E8F0E1]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* EXPANDED FILTERS */}
        {showFilters && (
          <div className="grid gap-4 rounded-[22px] border border-[#DFE7D8] bg-white p-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="sort-products"
                className="mb-2 block text-xs font-bold"
              >
                Urutkan Produk
              </label>

              <select
                id="sort-products"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="h-11 w-full rounded-xl border border-[#DFE7D8] bg-[#F8F6ED] px-3 text-sm outline-none"
              >
                <option value="terbaru">Urutan Awal</option>
                <option value="termurah">Harga Termurah</option>
                <option value="termahal">Harga Termahal</option>
                <option value="stok">Stok Terbanyak</option>
              </select>
            </div>

            <div className="flex flex-col justify-end gap-3">
              <label className="flex items-center gap-3 text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={onlyLargeStock}
                  onChange={(event) =>
                    setOnlyLargeStock(event.target.checked)
                  }
                  className="h-4 w-4 accent-[#245C43]"
                />
                Tampilkan stok minimal 100 kg
              </label>

              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-2 text-xs font-bold text-[#087338]"
              >
                <X size={14} />
                Reset Semua Filter
              </button>
            </div>
          </div>
        )}
      </section>

      {/* PRODUCT HEADING */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black sm:text-xl">
            Surplus Panen Tersedia
          </h2>
          <p className="mt-1 text-xs text-[#8B9A88]">
            {filteredProducts.length} produk ditemukan (data demo)
          </p>
        </div>

        <span className="hidden items-center gap-1 rounded-full bg-[#E8F1E1] px-3 py-2 text-[11px] font-bold text-[#39844E] sm:inline-flex">
          <CheckCircle2 size={14} />
          Mode Simulasi
        </span>
      </div>

      {/* PRODUCT GRID */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 xl:gap-5">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="group flex min-w-0 flex-col overflow-hidden rounded-[23px] border border-white bg-[#F8F6ED] p-2 shadow-[5px_5px_14px_#e4e2d7,-5px_-5px_14px_#ffffff] transition duration-200 hover:-translate-y-1 sm:p-3"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[17px] bg-[#E7ECDD]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />

                <span className="absolute left-2 top-2 rounded-full bg-[#F8F6ED]/95 px-2.5 py-1 text-[10px] font-extrabold text-[#245C43]">
                  {product.grade}
                </span>
              </div>

              <div className="flex flex-1 flex-col px-1 pb-1 pt-3">
                <span className="text-[10px] font-bold text-[#6E9C6D]">
                  {product.category}
                </span>

                <h3 className="mt-1 truncate text-sm font-black sm:text-base">
                  {product.name}
                </h3>

                <p className="mt-1 line-clamp-2 min-h-8 text-[11px] leading-4 text-[#8B9A88]">
                  {product.condition}
                </p>

                <p className="mt-3 truncate text-lg font-black text-[#087338] sm:text-xl">
                  {formatRupiah(product.price)}
                  <span className="ml-1 text-[10px] font-medium text-[#91A18E]">
                    /{product.unit}
                  </span>
                </p>

                <div className="mt-3 space-y-2 border-t border-[#E5EADD] pt-3">
                  <div className="flex items-center justify-between gap-1 text-[10px]">
                    <span className="text-[#8B9A88]">
                      Stok tersedia
                    </span>
                    <span className="font-extrabold text-[#245C43]">
                      {product.stock} kg
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-[#82927E]">
                    <MapPin size={12} className="shrink-0" />
                    <span className="truncate">
                      {product.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-[#82927E]">
                    <Sprout size={12} className="shrink-0" />
                    <span className="truncate">
                      {product.farmer}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/processor/marketplace/${product.id}`}
                  className="mt-4 flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#245C43] px-2 py-2.5 text-[11px] font-extrabold text-white transition hover:bg-[#087338]"
                >
                  Lihat Detail
                  <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[25px] border border-dashed border-[#D7E4D0] bg-[#F0F3E9] p-6 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E2ECDD] text-[#348443]">
            <Search size={28} />
          </span>

          <h3 className="mt-4 text-base font-black">
            Produk Tidak Ditemukan
          </h3>

          <p className="mt-2 max-w-[310px] text-xs leading-6 text-[#81937E]">
            Coba gunakan kata kunci lain atau ubah kategori
            dan filter pencarian.
          </p>

          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 rounded-xl bg-[#245C43] px-5 py-3 text-xs font-bold text-white"
          >
            Reset Pencarian
          </button>
        </div>
      )}

      {/* BOTTOM INFO */}
      <div className="flex items-start gap-3 rounded-[20px] border border-[#DFE8D6] bg-[#EDF2E6] p-4">
        <ShoppingBag
          size={20}
          className="mt-0.5 shrink-0 text-[#39844E]"
        />

        <div>
          <p className="text-xs font-extrabold">
            Marketplace SAVORA
          </p>

          <p className="mt-1 text-xs leading-6 text-[#718671]">
            Seluruh produk, harga, stok, dan informasi petani
            pada halaman ini merupakan data simulasi untuk
            pengembangan aplikasi. Belum ada transaksi nyata.
          </p>
        </div>
      </div>
    </div>
  );
}
