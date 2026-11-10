
import Link from "next/link";
import {
  Recycle, Truck, ShieldCheck, ShoppingBag,
  ClipboardList, Users, ArrowRight,
  Sprout, Package, BarChart3,
} from "lucide-react";
import type { AppRole } from "@/lib/auth/roles";

const CONTENT = {
  processor: {
    greeting: "Dashboard Pengolah Kompos",
    description:
      "Temukan surplus panen dan kelola kebutuhan bahan organik.",
    icon: Recycle,
    title: "Ubah Surplus Menjadi Produk Bernilai",
    subtitle:
      "Cari bahan organik dari petani dan kelola pesanan dalam satu platform.",
    button: "Jelajahi Marketplace",
    href: "/processor/marketplace",
    cards: [
      { label: "Surplus Tersedia", icon: Sprout },
      { label: "Pesanan Aktif", icon: Package },
      { label: "Kebutuhan Bahan", icon: ClipboardList },
    ],
  },
  courier: {
    greeting: "Dashboard Kurir",
    description:
      "Kelola tugas penjemputan dan pengiriman surplus panen.",
    icon: Truck,
    title: "Pengiriman Lebih Terkoordinasi",
    subtitle:
      "Pantau tugas, lokasi penjemputan, dan riwayat pengiriman.",
    button: "Lihat Tugas",
    href: "/courier/tasks",
    cards: [
      { label: "Tugas Baru", icon: ClipboardList },
      { label: "Pengiriman Aktif", icon: Truck },
      { label: "Tugas Selesai", icon: Package },
    ],
  },
  admin: {
    greeting: "Dashboard Admin",
    description:
      "Pantau pengguna, transaksi, dan aktivitas ekosistem SAVORA.",
    icon: ShieldCheck,
    title: "Kelola Ekosistem SAVORA",
    subtitle:
      "Verifikasi pengguna dan pantau aktivitas operasional platform.",
    button: "Kelola Verifikasi",
    href: "/admin/verification",
    cards: [
      { label: "Total Pengguna", icon: Users },
      { label: "Permohonan Role", icon: ClipboardList },
      { label: "Transaksi", icon: ShoppingBag },
    ],
  },
};

export default function RoleDashboard({
  role,
}: {
  role: Exclude<AppRole, "farmer">;
}) {
  const data = CONTENT[role];
  const MainIcon = data.icon;

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-extrabold sm:text-3xl">
          {data.greeting}
        </h1>
        <p className="mt-2 text-sm text-[#728071]">
          {data.description}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.cards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-center gap-4 rounded-[24px] border border-white bg-[#F8F6ED] p-5 shadow-[6px_6px_15px_#e0dccf,-6px_-6px_15px_#ffffff]"
            >
              <div className="rounded-full bg-[#EAF1D9] p-4">
                <Icon size={28} className="text-[#5C9C3D]" />
              </div>
              <div>
                <p className="text-xs text-[#687568]">{item.label}</p>
                <p className="mt-1 text-xl font-extrabold">—</p>
                <p className="text-[11px] text-[#879186]">
                  Belum ada data
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#E7F0D6] to-[#CFE6AB] p-7 sm:p-10">
        <div className="absolute -bottom-24 -right-16 h-60 w-60 rounded-full bg-[#F5C842]/70" />
        <div className="absolute -bottom-28 right-24 h-52 w-60 rounded-full bg-[#8EC65C]/60" />

        <MainIcon
          size={110}
          strokeWidth={1.2}
          className="absolute bottom-8 right-8 hidden text-[#5C9C3D]/40 sm:block"
        />

        <div className="relative z-10 max-w-[500px]">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            {data.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#536B50]">
            {data.subtitle}
          </p>
          <Link
            href={data.href}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#F8F6ED] px-6 py-3 text-sm font-bold shadow-[5px_6px_12px_#b5c49d,-3px_-3px_9px_#ffffff]"
          >
            {data.button}
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>

      <section className="rounded-[25px] border border-white bg-[#F8F6ED] p-7 shadow-[6px_6px_15px_#e0dccf,-6px_-6px_15px_#ffffff]">
        <div className="flex items-center gap-2">
          <BarChart3 size={21} className="text-[#5C9C3D]" />
          <h3 className="font-extrabold">Aktivitas Terbaru</h3>
        </div>
        <p className="mt-7 rounded-2xl bg-[#F1F2E8] px-5 py-10 text-center text-sm text-[#728071]">
          Belum ada aktivitas untuk ditampilkan.
        </p>
      </section>
    </div>
  );
}
