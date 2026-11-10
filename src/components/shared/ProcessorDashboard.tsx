
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  Factory,
  Leaf,
  MapPin,
  Package,
  Plus,
  ShoppingBag,
  Sprout,
  TrendingUp,
  Wallet,
} from "lucide-react";

import {
  getProcessorOrders,
  type ProcessorOrder,
} from "@/lib/data/processor-orders";

import {
  getProcessorRequirements,
  type ProcessorRequirement,
} from "@/lib/data/processor-requirements";

import {
  PROCESSOR_PRODUCTS,
  formatRupiah,
} from "@/lib/data/processor-products";

type Props = {
  fullName: string;
  businessName: string;
  capacityKgPerDay: number | null;
};

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: typeof Package;
  color: string;
}) {
  return (
    <div className="min-w-0 rounded-[24px] border border-white bg-[#F8F6ED] p-4 shadow-[5px_5px_15px_#e5e3d8,-5px_-5px_15px_#ffffff] sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${color}`}
        >
          <Icon size={22} />
        </span>

        <TrendingUp size={16} className="text-[#A3B29E]" />
      </div>

      <p className="mt-5 text-[11px] font-bold text-[#829481]">
        {title}
      </p>

      <p className="mt-1 break-words text-2xl font-black tracking-tight text-[#245C43] sm:text-[29px]">
        {value}
      </p>

      <p className="mt-2 text-[10px] leading-4 text-[#9BAA97]">
        {subtitle}
      </p>
    </div>
  );
}

function SectionHeading({
  title,
  description,
  href,
  linkText,
}: {
  title: string;
  description: string;
  href?: string;
  linkText?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-lg font-black text-[#245C43] sm:text-xl">
          {title}
        </h2>

        <p className="mt-1 text-xs text-[#849482]">
          {description}
        </p>
      </div>

      {href && linkText && (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-xs font-extrabold text-[#39844E] hover:text-[#245C43]"
        >
          {linkText}
          <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}

export default function ProcessorDashboard({
  fullName,
  businessName,
  capacityKgPerDay,
}: Props) {
  const [orders, setOrders] = useState<ProcessorOrder[]>([]);
  const [requirements, setRequirements] = useState<
    ProcessorRequirement[]
  >([]);
  const [loaded, setLoaded] = useState(false);

  const loadData = useCallback(() => {
    setOrders(getProcessorOrders());
    setRequirements(getProcessorRequirements());
    setLoaded(true);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(loadData, 0);

    window.addEventListener("storage", loadData);
    window.addEventListener("focus", loadData);
    window.addEventListener("savora-orders-updated", loadData);
    window.addEventListener(
      "savora-requirements-updated",
      loadData
    );

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("storage", loadData);
      window.removeEventListener("focus", loadData);
      window.removeEventListener(
        "savora-orders-updated",
        loadData
      );
      window.removeEventListener(
        "savora-requirements-updated",
        loadData
      );
    };
  }, [loadData]);

  const stats = useMemo(() => {
    const activeOrders = orders.filter(
      (order) =>
        order.status !== "Selesai" &&
        order.status !== "Dibatalkan"
    );

    const completedOrders = orders.filter(
      (order) => order.status === "Selesai"
    );

    const activeRequirements = requirements.filter(
      (item) => item.status === "Aktif"
    );

    return {
      activeOrders: activeOrders.length,
      totalPurchases: orders
        .filter((order) => order.status !== "Dibatalkan")
        .reduce((sum, order) => sum + order.total, 0),
      activeRequirements: activeRequirements.length,
      completedOrders: completedOrders.length,
      processedKg: completedOrders.reduce(
        (sum, order) => sum + order.quantity,
        0
      ),
    };
  }, [orders, requirements]);

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
        .slice(0, 3),
    [orders]
  );

  const recentRequirements = useMemo(
    () =>
      [...requirements]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
        .slice(0, 3),
    [requirements]
  );

  const featuredProducts = PROCESSOR_PRODUCTS.slice(0, 3);

  const firstName = fullName.trim().split(/\s+/)[0] || "Pengolah";

  return (
    <div className="mx-auto w-full max-w-[1440px] min-w-0 space-y-8 pb-8 text-[#245C43]">
      {/* PAGE HEADING */}
      <div>
        <p className="mb-2 flex items-center gap-2 text-xs font-bold text-[#81967C]">
          <Leaf size={15} />
          SAVORA / Pengolah / Dashboard
        </p>

        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
          Dashboard Pengolah
        </h1>

        <p className="mt-2 text-sm text-[#849482]">
          Selamat datang kembali, {firstName}!
        </p>
      </div>

      {/* HERO */}
      <section className="relative isolate overflow-hidden rounded-[30px] bg-[#245C43] shadow-[8px_10px_25px_rgba(29,84,56,0.13)]">
        <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border-[48px] border-white/[0.055]" />

        <Sprout
          size={235}
          strokeWidth={0.8}
          className="pointer-events-none absolute -bottom-20 right-2 hidden text-white/[0.09] sm:block"
        />

        <div className="relative z-10 px-6 py-9 sm:px-10 sm:py-11">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-[#E9F3E0]">
            <Factory size={14} className="text-[#F5C842]" />
            {businessName || "Mitra Pengolah SAVORA"}
          </span>

          <h2 className="mt-5 max-w-[650px] text-[27px] font-black leading-tight text-white sm:text-[38px]">
            Ubah Surplus Panen
            <span className="block text-[#F5D56A]">
              Jadi Peluang Usaha.
            </span>
          </h2>

          <p className="mt-4 max-w-[500px] text-xs leading-6 text-[#DCEBDD] sm:text-sm">
            Temukan bahan baku berkualitas, kelola kebutuhan
            produksi, dan pantau aktivitas pembelian dalam
            satu platform.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/processor/marketplace"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#F5C842] px-5 py-3 text-xs font-extrabold text-[#245C43]"
            >
              <ShoppingBag size={17} />
              Cari Bahan Baku
              <ArrowRight size={15} />
            </Link>

            <Link
              href="/processor/requirements/new"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-xs font-extrabold text-white"
            >
              <Plus size={17} />
              Buat Kebutuhan
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="space-y-4">
        <SectionHeading
          title="Ringkasan Aktivitas"
          description="Statistik aktivitas pengolahan dan pembelian bahan baku."
        />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
          <StatCard
            title="Pesanan Aktif"
            value={loaded ? String(stats.activeOrders) : "—"}
            subtitle="Sedang dalam proses"
            icon={Package}
            color="bg-[#E5F0DF] text-[#39844E]"
          />

          <StatCard
            title="Total Pembelian"
            value={
              loaded
                ? formatRupiah(stats.totalPurchases)
                : "—"
            }
            subtitle="Nilai pesanan selain dibatalkan"
            icon={Wallet}
            color="bg-[#FFF0C8] text-[#A47C27]"
          />

          <StatCard
            title="Kebutuhan Aktif"
            value={
              loaded
                ? String(stats.activeRequirements)
                : "—"
            }
            subtitle="Permintaan bahan baku"
            icon={ClipboardList}
            color="bg-[#E4ECF8] text-[#4A6BA4]"
          />

          <StatCard
            title="Pesanan Selesai"
            value={
              loaded
                ? String(stats.completedOrders)
                : "—"
            }
            subtitle="Transaksi simulasi selesai"
            icon={CheckCircle2}
            color="bg-[#E6EBE5] text-[#426E55]"
          />
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="space-y-4">
        <SectionHeading
          title="Akses Cepat"
          description="Kelola kebutuhan usaha dalam beberapa langkah."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Jelajahi Marketplace",
              description:
                "Temukan hasil panen surplus dari petani.",
              href: "/processor/marketplace",
              icon: ShoppingBag,
              color: "bg-[#E5F0DF]",
            },
            {
              title: "Buat Kebutuhan",
              description:
                "Publikasikan kebutuhan bahan baku simulasi.",
              href: "/processor/requirements/new",
              icon: ClipboardList,
              color: "bg-[#FFF0C8]",
            },
            {
              title: "Pantau Pesanan",
              description:
                "Lihat status pembelian bahan baku.",
              href: "/processor/orders",
              icon: Package,
              color: "bg-[#E4ECF8]",
            },
          ].map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-start gap-4 rounded-[24px] border border-white bg-[#F8F6ED] p-5 shadow-[5px_5px_15px_#e5e3d8,-5px_-5px_15px_#ffffff] transition hover:-translate-y-1"
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[#245C43] ${action.color}`}
                >
                  <Icon size={22} />
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-black">
                    {action.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-[#849482]">
                    {action.description}
                  </p>

                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-extrabold text-[#39844E]">
                    Buka
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ORDERS + REQUIREMENTS */}
      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        {/* RECENT ORDERS */}
        <section className="min-w-0 space-y-4">
          <SectionHeading
            title="Pesanan Terbaru"
            description="Aktivitas pembelian bahan baku."
            href="/processor/orders"
            linkText="Semua Pesanan"
          />

          <div className="min-h-[270px] rounded-[25px] border border-white bg-[#F8F6ED] p-5 shadow-[5px_5px_15px_#e5e3d8,-5px_-5px_15px_#ffffff]">
            {recentOrders.length === 0 ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5F0DF] text-[#39844E]">
                  <ShoppingBag size={26} />
                </span>

                <h3 className="mt-4 text-sm font-black">
                  Belum Ada Pesanan
                </h3>

                <p className="mt-2 max-w-[270px] text-xs leading-5 text-[#849482]">
                  Pesanan akan muncul setelah kamu
                  membeli bahan baku dari marketplace.
                </p>

                <Link
                  href="/processor/marketplace"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-[#39844E]"
                >
                  Jelajahi Marketplace
                  <ArrowRight size={15} />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#E4EADD]">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/processor/orders/${order.id}`}
                    className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[#E5F0DF]">
                      <Image
                        src={order.productImage}
                        alt={order.productName}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-black">
                        {order.productName}
                      </p>

                      <p className="mt-1 text-[11px] text-[#849482]">
                        {order.quantity} kg • {order.status}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-black text-[#087338]">
                        {formatRupiah(order.total)}
                      </p>

                      <ChevronRight
                        size={16}
                        className="ml-auto mt-1 text-[#829481]"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* RECENT REQUIREMENTS */}
        <section className="min-w-0 space-y-4">
          <SectionHeading
            title="Kebutuhan Terbaru"
            description="Permintaan bahan baku usahamu."
            href="/processor/requirements"
            linkText="Semua Kebutuhan"
          />

          <div className="min-h-[270px] rounded-[25px] border border-white bg-[#F8F6ED] p-5 shadow-[5px_5px_15px_#e5e3d8,-5px_-5px_15px_#ffffff]">
            {recentRequirements.length === 0 ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5F0DF] text-[#39844E]">
                  <ClipboardList size={26} />
                </span>

                <h3 className="mt-4 text-sm font-black">
                  Belum Ada Kebutuhan
                </h3>

                <p className="mt-2 max-w-[270px] text-xs leading-5 text-[#849482]">
                  Buat permintaan untuk mencatat bahan
                  baku yang dibutuhkan usahamu.
                </p>

                <Link
                  href="/processor/requirements/new"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-[#39844E]"
                >
                  Buat Kebutuhan
                  <ArrowRight size={15} />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#E4EADD]">
                {recentRequirements.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E5F0DF] text-[#39844E]">
                      <Sprout size={22} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-black">
                        {item.title}
                      </p>

                      <p className="mt-1 text-[11px] text-[#849482]">
                        {item.quantity} kg • {item.category}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-[#E5F0DF] px-2.5 py-1.5 text-[10px] font-bold text-[#39844E]">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* FEATURED PRODUCTS */}
      <section className="space-y-4">
        <SectionHeading
          title="Rekomendasi Bahan Baku"
          description="Pilihan surplus panen yang tersedia pada katalog simulasi."
          href="/processor/marketplace"
          linkText="Lihat Marketplace"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/processor/marketplace/${product.id}`}
              className="group overflow-hidden rounded-[24px] border border-white bg-[#F8F6ED] shadow-[5px_5px_15px_#e5e3d8,-5px_-5px_15px_#ffffff] transition hover:-translate-y-1"
            >
              <div className="relative h-40 overflow-hidden bg-[#E7EFE1]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />

                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-extrabold text-[#245C43]">
                  {product.grade}
                </span>
              </div>

              <div className="p-4">
                <p className="text-[10px] font-bold text-[#39844E]">
                  {product.category}
                </p>

                <h3 className="mt-1 text-sm font-black">
                  {product.name}
                </h3>

                <p className="mt-2 flex items-center gap-1 text-[11px] text-[#849482]">
                  <MapPin size={13} />
                  {product.location}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-black text-[#087338]">
                      {formatRupiah(product.price)}
                      <span className="text-[10px] font-medium text-[#849482]">
                        /kg
                      </span>
                    </p>

                    <p className="mt-1 text-[10px] text-[#849482]">
                      Stok {product.stock} kg
                    </p>
                  </div>

                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#245C43] text-white">
                    <ArrowRight size={17} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* IMPACT */}
      <section className="relative overflow-hidden rounded-[27px] bg-[#E7F0DF] p-6 sm:p-8">
        <Leaf
          size={160}
          strokeWidth={1}
          className="pointer-events-none absolute -bottom-12 right-2 text-[#39844E]/10"
        />

        <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-extrabold text-[#39844E]">
              <Sprout size={17} />
              Dampak Pemanfaatan Surplus
            </span>

            <h2 className="mt-3 text-2xl font-black">
              {loaded ? stats.processedKg : "—"} kg
            </h2>

            <p className="mt-2 max-w-[510px] text-xs leading-6 text-[#718671]">
              Total berat bahan baku dari pesanan simulasi
              yang sudah berstatus selesai. Angka ini belum
              membuktikan jumlah limbah pangan yang berhasil
              dicegah.
            </p>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/65 p-4 sm:min-w-[180px]">
            <p className="text-[11px] text-[#829481]">
              Kapasitas Usaha
            </p>

            <p className="mt-2 text-2xl font-black">
              {capacityKgPerDay ?? 0}
              <span className="ml-1 text-xs font-bold text-[#829481]">
                kg/hari
              </span>
            </p>
          </div>
        </div>
      </section>

      <p className="text-center text-[11px] leading-5 text-[#91A08C]">
        Data pesanan dan kebutuhan pada dashboard ini masih
        menggunakan penyimpanan lokal untuk keperluan simulasi.
      </p>
    </div>
  );
}
