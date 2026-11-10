
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  CircleCheck,
  Clock3,
  Leaf,
  MapPin,
  Package,
  Plus,
  Recycle,
  Sprout,
  TrendingUp,
  Truck,
  Wallet,
  Scale,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import {
  type SurplusListing,
  formatRupiah,
  formatDate,
  SURPLUS_STATUS_LABELS,
} from "@/types/surplus";

export default async function FarmerDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="rounded-3xl bg-[#F8F6ED] p-8 text-center">
        <p className="font-semibold">Silakan login terlebih dahulu.</p>
        <Link href="/login" className="mt-4 inline-block font-bold text-[#087338]">
          Masuk ke SAVORA
        </Link>
      </div>
    );
  }

  const [{ data: profile }, { data: surplusData, error: surplusError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("surplus_listings")
        .select("*")
        .eq("farmer_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

  const listings = (surplusData ?? []) as SurplusListing[];

  const activeListings = listings.filter(
    (item) => item.status === "available"
  );

  const reservedListings = listings.filter(
    (item) => item.status === "reserved"
  );

  const soldListings = listings.filter(
    (item) => item.status === "sold"
  );

  const totalWeight = activeListings.reduce(
    (total, item) => total + Number(item.quantity_kg),
    0
  );

  const estimatedSoldValue = soldListings.reduce(
    (total, item) =>
      total + Number(item.quantity_kg) * Number(item.price_per_kg),
    0
  );

  const firstName =
    profile?.full_name?.trim().split(/\s+/)[0] ||
    user.user_metadata?.full_name?.trim()?.split(/\s+/)[0] ||
    "Petani";

  const stats = [
    {
      label: "Surplus Aktif",
      value: activeListings.length.toLocaleString("id-ID"),
      detail: "Penawaran tersedia",
      icon: Sprout,
      iconColor: "text-[#4C9B38]",
      iconBackground: "bg-[#E6F1D8]",
    },
    {
      label: "Total Berat",
      value: `${totalWeight.toLocaleString("id-ID")} kg`,
      detail: "Surplus tersedia",
      icon: Scale,
      iconColor: "text-[#D9A518]",
      iconBackground: "bg-[#FFF0BF]",
    },
    {
      label: "Surplus Dipesan",
      value: reservedListings.length.toLocaleString("id-ID"),
      detail: "Menunggu diproses",
      icon: Package,
      iconColor: "text-[#4C9B38]",
      iconBackground: "bg-[#E6F1D8]",
    },
    {
      label: "Nilai Surplus Terjual",
      value: formatRupiah(estimatedSoldValue),
      detail: "Estimasi nilai penawaran",
      icon: Wallet,
      iconColor: "text-[#D9A518]",
      iconBackground: "bg-[#FFF0BF]",
    },
  ];

  const tips = [
    {
      title: "Pisahkan hasil panen",
      description:
        "Kelompokkan komoditas berdasarkan jenis dan kondisinya sebelum ditawarkan.",
    },
    {
      title: "Tentukan harga yang sesuai",
      description:
        "Pertimbangkan kualitas, berat, dan kondisi pasar saat menentukan harga.",
    },
    {
      title: "Perbarui stok secara berkala",
      description:
        "Pastikan berat dan ketersediaan surplus sesuai dengan kondisi sebenarnya.",
    },
  ];

  const imageForCommodity = (commodity: string) => {
    const name = commodity.toLowerCase();

    if (name.includes("tomat")) return "/images/farmer/tomato.webp";
    if (name.includes("kangkung")) return "/images/farmer/kangkung.webp";
    if (name.includes("pisang")) return "/images/farmer/banana.webp";

    return "/images/farmer/vegetable-crate.webp";
  };

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1450px] space-y-7 overflow-x-clip pb-4 text-[#164A32]">
      {/* HERO BANNER */}
      <section className="relative isolate overflow-hidden rounded-[30px] border border-white bg-gradient-to-br from-[#EAF3DB] via-[#F0F5E4] to-[#F7E9AD] shadow-[8px_8px_22px_#dfddcf,-8px_-8px_22px_#ffffff]">
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#F5C842]/45 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-[#B8DB87]/60 blur-2xl" />

        <Image
          src="/images/farmer/farm-landscape.webp"
          alt=""
          width={1100}
          height={460}
          className="pointer-events-none absolute bottom-0 right-0 z-0 h-auto w-[90%] max-w-[900px] opacity-55 sm:w-[72%]"
          priority
        />

        <div className="relative z-10 grid min-h-[315px] items-center gap-4 p-6 sm:p-9 lg:grid-cols-[1.2fr_0.8fr] lg:p-11">
          <div className="max-w-[650px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-[#F8F6ED]/85 px-4 py-2 text-xs font-bold text-[#3B8738] shadow-sm">
              <Leaf size={15} />
              FROM SURPLUS TO VALUE
            </span>

            <h1 className="mt-5 text-[28px] font-black leading-[1.15] tracking-tight sm:text-[37px] lg:text-[42px]">
              Halo, {firstName}! <span>👋</span>
            </h1>

            <h2 className="mt-3 max-w-[570px] text-xl font-extrabold leading-snug sm:text-[27px]">
              Yuk, Ubah Surplus Panen
              <span className="block text-[#4B9D39]">
                Menjadi Peluang Baru!
              </span>
            </h2>

            <p className="mt-4 max-w-[480px] text-sm leading-7 text-[#59725A]">
              Kelola hasil panen berlebih, temukan pengolah kompos,
              dan dukung pertanian berkelanjutan bersama SAVORA.
            </p>

            <Link
              href="/farmer/surplus/new"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#42B66A] to-[#087338] px-6 py-3.5 text-sm font-extrabold text-white shadow-[5px_7px_14px_#abc69e] transition hover:-translate-y-0.5"
            >
              <Plus size={18} />
              Tambah Surplus Panen
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="relative hidden h-[270px] items-end justify-center lg:flex">
            <div className="absolute bottom-0 h-48 w-64 rounded-full bg-[#F5C842]/25 blur-2xl" />
            <Image
              src="/images/farmer/farmer-hero.webp"
              alt="Ilustrasi petani SAVORA membawa hasil panen"
              width={430}
              height={430}
              className="relative z-10 max-h-[315px] w-auto max-w-full object-contain drop-shadow-[0_15px_16px_rgba(55,91,34,0.18)]"
              priority
            />
          </div>
        </div>
      </section>

      {/* HEADER STATISTIK */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-black sm:text-2xl">
            Ringkasan Panenmu
          </h2>
          <p className="mt-1 text-sm text-[#7A8877]">
            Pantau perkembangan surplus panen dalam satu tempat.
          </p>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full bg-[#E7F0D9] px-4 py-2 text-xs font-bold text-[#478B3D]">
          <TrendingUp size={15} />
          Data dari SAVORA
        </span>
      </div>

      {surplusError && (
        <div role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
          Gagal mengambil data surplus: {surplusError.message}
        </div>
      )}

      {/* KARTU STATISTIK */}
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-[25px] border border-white bg-[#F8F6ED] p-5 shadow-[6px_6px_16px_#e1ddd0,-6px_-6px_16px_#ffffff] transition hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.iconBackground}`}>
                  <Icon size={27} className={stat.iconColor} />
                </div>
                <ArrowUpRight
                  size={17}
                  className="text-[#A7B5A1] transition group-hover:text-[#087338]"
                />
              </div>

              <p className="mt-5 text-sm font-medium text-[#71806E]">
                {stat.label}
              </p>
              <p className="mt-1 break-words text-[26px] font-black leading-tight text-[#164A32]">
                {stat.value}
              </p>
              <p className="mt-2 text-xs text-[#92A08E]">
                {stat.detail}
              </p>
            </div>
          );
        })}
      </div>

      {/* AKSI CEPAT */}
      <section className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-2">
        <Link
          href="/farmer/surplus/new"
          className="group relative flex min-h-[205px] items-center overflow-hidden rounded-[28px] bg-gradient-to-br from-[#087338] to-[#135A36] p-6 text-white shadow-[7px_8px_18px_#cbd2be] sm:p-8"
        >
          <div className="pointer-events-none absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-[#58B94B]/30" />

          <div className="relative z-10 max-w-[60%]">
            <div className="mb-4 inline-flex rounded-full bg-white/15 p-2.5">
              <Plus size={21} />
            </div>
            <h3 className="text-xl font-black sm:text-2xl">
              Tambah Surplus
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#DBF1DC] sm:text-sm">
              Punya panen berlebih? Tawarkan sekarang!
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold">
              Mulai Sekarang <ArrowRight size={16} />
            </span>
          </div>

          <Image
            src="/images/farmer/vegetable-crate.webp"
            alt="Keranjang sayuran hasil panen"
            width={260}
            height={260}
            className="absolute -bottom-6 -right-5 z-0 w-[48%] max-w-[245px] object-contain transition group-hover:scale-105"
          />
        </Link>

        <Link
          href="/farmer/pickups"
          className="group relative flex min-h-[205px] items-center overflow-hidden rounded-[28px] border border-white bg-gradient-to-br from-[#FFF1C4] to-[#F8E4A4] p-6 shadow-[7px_8px_18px_#e0dccf] sm:p-8"
        >
          <div className="pointer-events-none absolute -bottom-16 -right-12 h-52 w-52 rounded-full bg-[#F5C842]/35" />

          <div className="relative z-10 max-w-[70%]">
            <div className="mb-4 inline-flex rounded-full bg-[#F8F6ED]/75 p-2.5 text-[#B58A0C]">
              <Truck size={21} />
            </div>
            <h3 className="text-xl font-black sm:text-2xl">
              Penjemputan
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#7B714A] sm:text-sm">
              Pantau proses pengambilan hasil panenmu.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold">
              Lihat Penjemputan <ArrowRight size={16} />
            </span>
          </div>

          <div className="absolute -bottom-4 -right-2 flex h-36 w-36 items-center justify-center rounded-full bg-white/30 sm:h-44 sm:w-44">
            <Truck
              size={92}
              strokeWidth={1.3}
              className="text-[#75A83F] drop-shadow-sm"
            />
          </div>
        </Link>
      </section>

      {/* SURPLUS TERBARU & TIPS */}
      <section className="grid w-full min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.85fr)]">
        <div className="min-w-0 max-w-full overflow-hidden rounded-[28px] border border-white bg-[#F8F6ED] p-5 shadow-[7px_7px_18px_#e0dccf,-7px_-7px_18px_#ffffff] sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black sm:text-xl">
                Surplus Panen Terbaru
              </h2>
              <p className="mt-1 text-xs text-[#879486]">
                Daftar penawaran yang baru kamu tambahkan.
              </p>
            </div>

            <Link
              href="/farmer/surplus"
              className="inline-flex items-center gap-1 text-xs font-extrabold text-[#087338]"
            >
              Lihat Semua <ChevronRight size={17} />
            </Link>
          </div>

          {listings.length === 0 ? (
            <div className="mt-6 flex min-h-[245px] flex-col items-center justify-center rounded-[22px] bg-[#F0F2E8] p-6 text-center">
              <Image
                src="/images/farmer/vegetable-crate.webp"
                alt="Keranjang hasil panen"
                width={140}
                height={140}
                className="h-[115px] w-[115px] object-contain"
              />
              <h3 className="mt-2 font-extrabold">
                Belum Ada Surplus Panen
              </h3>
              <p className="mt-2 max-w-xs text-xs leading-6 text-[#7B8A77]">
                Tambahkan hasil panen pertamamu agar dapat ditemukan
                oleh pengolah kompos.
              </p>
              <Link
                href="/farmer/surplus/new"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#087338]"
              >
                <Plus size={16} />
                Tambah Surplus
              </Link>
            </div>
          ) : (
            <div className="mt-6 min-w-0 space-y-3">
              {listings.slice(0, 4).map((item) => (
                <Link
                  key={item.id}
                  href={`/farmer/surplus/${item.id}/edit`}
                  className="group flex w-full min-w-0 max-w-full items-center gap-3 overflow-hidden rounded-[20px] bg-[#F0F2E8] p-3 transition hover:bg-[#E7EEDB] sm:gap-4 sm:p-4"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#E2EDD2] sm:h-20 sm:w-20">
                    <Image
                      src={imageForCommodity(item.commodity)}
                      alt={item.commodity}
                      width={80}
                      height={80}
                      className="h-[85%] w-[85%] object-contain"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-extrabold sm:text-base">
                      {item.title}
                    </h3>

                    <p className="mt-1 truncate text-xs text-[#6F806B]">
                      {Number(item.quantity_kg).toLocaleString("id-ID")} kg
                      {" · "}
                      {formatRupiah(Number(item.price_per_kg))}/kg
                    </p>

                    <p className="mt-2 flex items-center gap-1 truncate text-[11px] text-[#84917F]">
                      <MapPin size={12} />
                      {item.location}
                    </p>
                  </div>

                  <div className="flex max-w-[105px] shrink-0 flex-col items-end gap-2">
                    <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-[#31803B]">
                      {SURPLUS_STATUS_LABELS[item.status]}
                    </span>
                    <ArrowRight
                      size={17}
                      className="text-[#8A9C84] transition group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-5">
          {/* KARTU TIPS */}
          <div className="relative overflow-hidden rounded-[28px] border border-white bg-gradient-to-br from-[#EAF2DA] to-[#DDECC4] p-6 shadow-[7px_7px_18px_#e0dccf,-7px_-7px_18px_#ffffff]">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#F5C842]/25" />

            <div className="relative flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F8F6ED]/75 px-3 py-1.5 text-[11px] font-bold text-[#4A8B3A]">
                  <Leaf size={13} />
                  SAVORA TIPS
                </span>

                <h3 className="mt-4 text-xl font-black">
                  Tips untuk Petani
                </h3>
              </div>

              <Image
                src="/images/farmer/sprout-tips.webp"
                alt="Bibit tanaman hijau"
                width={110}
                height={110}
                className="h-[95px] w-[95px] object-contain"
              />
            </div>

            <div className="relative mt-4 space-y-3">
              {tips.map((tip, index) => (
                <div
                  key={tip.title}
                  className="flex items-start gap-3 rounded-2xl bg-[#F8F6ED]/75 p-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#DCEBC7] text-xs font-black text-[#39833C]">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-xs font-extrabold sm:text-sm">
                      {tip.title}
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-[#72836F]">
                      {tip.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KARTU DAMPAK */}
          <div className="relative overflow-hidden rounded-[25px] bg-gradient-to-r from-[#0B733A] to-[#2E9150] p-6 text-white shadow-[7px_7px_18px_#cbd2be]">
            <Recycle
              size={94}
              className="absolute -bottom-5 -right-3 text-white/10"
            />

            <div className="relative">
              <div className="flex items-center gap-2">
                <CircleCheck size={19} />
                <h3 className="font-extrabold">
                  Bersama Kurangi Limbah
                </h3>
              </div>

              <p className="mt-3 text-xs leading-6 text-[#D9F0DB]">
                Setiap surplus panen yang dimanfaatkan kembali
                membantu membangun rantai ekonomi sirkular.
              </p>

              <Link
                href="/farmer/transactions"
                className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold"
              >
                Lihat Aktivitasmu
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AKTIVITAS */}
      <section className="min-w-0 max-w-full overflow-hidden rounded-[28px] border border-white bg-[#F8F6ED] p-5 shadow-[7px_7px_18px_#e0dccf,-7px_-7px_18px_#ffffff] sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black sm:text-xl">
              Aktivitas Penjemputan
            </h2>
            <p className="mt-1 text-xs text-[#879486]">
              Pantau perkembangan pengambilan surplus panen.
            </p>
          </div>

          <Link
            href="/farmer/pickups"
            className="inline-flex items-center gap-1 text-xs font-extrabold text-[#087338]"
          >
            Lihat Semua
            <ChevronRight size={17} />
          </Link>
        </div>

        <div className="mt-6 flex min-h-[145px] flex-col items-center justify-center rounded-[22px] bg-[#F0F2E8] p-5 text-center">
          <Truck size={35} className="text-[#85B15B]" />
          <p className="mt-3 text-sm font-bold">
            Belum Ada Aktivitas Penjemputan
          </p>
          <p className="mt-1 max-w-md text-xs leading-6 text-[#879486]">
            Jadwal dan status penjemputan akan tampil di sini
            setelah modul pesanan dan logistik diaktifkan.
          </p>
        </div>
      </section>
    </div>
  );
}
