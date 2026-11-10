
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Download,
  Leaf,
  MapPin,
  Package,
  Search,
  Truck,
  Wallet,
} from "lucide-react";

import {
  getCourierTasks,
  formatCourierCurrency,
  formatCourierDate,
  type CourierTask,
} from "@/lib/data/courier-tasks";

const cardStyle =
  "rounded-[26px] border border-white bg-[#F8F6ED] p-5 shadow-[5px_5px_15px_#e5e3d8,-5px_-5px_15px_#ffffff] sm:p-6";

function downloadCSV(tasks: CourierTask[]) {
  const headers = [
    "Nomor Tugas",
    "Produk",
    "Berat (kg)",
    "Petani",
    "Alamat Penjemputan",
    "Pengolah",
    "Alamat Pengantaran",
    "Jadwal",
    "Status",
    "Estimasi Ongkos (Rp)",
  ];

  const rows = tasks.map((task) => [
    task.id,
    task.product,
    task.quantityKg,
    task.farmer,
    task.pickupAddress,
    task.processor,
    task.deliveryAddress,
    task.scheduledAt,
    task.status,
    task.fee,
  ]);

  function escapeCSV(value: string | number) {
    const text = String(value);
    return `"${text.replace(/"/g, '""')}"`;
  }

  const csv = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => row.map(escapeCSV).join(",")),
  ].join("\r\n");

  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "savora-riwayat-kurir.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

export default function CourierHistoryPage() {
  const [tasks, setTasks] = useState<CourierTask[]>([]);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("Semua");
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(() => {
    setTasks(
      getCourierTasks().filter(
        (task) => task.status === "Selesai"
      )
    );
    setLoaded(true);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(refresh, 0);

    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    window.addEventListener(
      "savora-courier-updated",
      refresh
    );

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
      window.removeEventListener(
        "savora-courier-updated",
        refresh
      );
    };
  }, [refresh]);

  const availableMonths = useMemo(() => {
    const months = new Set(
      tasks
        .filter((task) =>
          Number.isFinite(new Date(task.scheduledAt).getTime())
        )
        .map((task) => task.scheduledAt.slice(0, 7))
    );

    return [...months].sort().reverse();
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return tasks
      .filter((task) => {
        const matchesSearch = [
          task.id,
          task.product,
          task.title,
          task.farmer,
          task.processor,
        ].some((value) =>
          value.toLowerCase().includes(keyword)
        );

        const matchesMonth =
          month === "Semua" ||
          task.scheduledAt.startsWith(month);

        return matchesSearch && matchesMonth;
      })
      .sort(
        (a, b) =>
          new Date(b.scheduledAt).getTime() -
          new Date(a.scheduledAt).getTime()
      );
  }, [tasks, search, month]);

  const stats = useMemo(() => {
    return {
      total: filteredTasks.length,
      weight: filteredTasks.reduce(
        (sum, task) => sum + task.quantityKg,
        0
      ),
      fees: filteredTasks.reduce(
        (sum, task) => sum + task.fee,
        0
      ),
    };
  }, [filteredTasks]);

  const statCards = [
    {
      title: "Pengiriman Selesai",
      value: String(stats.total),
      icon: CheckCircle2,
      color: "bg-[#E5F0DF] text-[#39844E]",
    },
    {
      title: "Total Berat Diangkut",
      value: `${stats.weight.toLocaleString("id-ID")} kg`,
      icon: Package,
      color: "bg-[#FFF0C8] text-[#A47C27]",
    },
    {
      title: "Estimasi Ongkos",
      value: formatCourierCurrency(stats.fees),
      icon: Wallet,
      color: "bg-[#E4ECF8] text-[#4A6BA4]",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-8 pb-8 text-[#245C43]">
      {/* HEADER */}
      <div>
        <p className="mb-2 flex items-center gap-2 text-xs font-bold text-[#81967C]">
          <Leaf size={15} />
          SAVORA / Kurir / Riwayat
        </p>

        <h1 className="text-2xl font-black sm:text-3xl">
          Riwayat Pengiriman
        </h1>

        <p className="mt-2 text-sm text-[#849482]">
          Pantau pengiriman yang telah selesai dan
          ringkasan aktivitas logistik.
        </p>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden rounded-[30px] bg-[#245C43] px-6 py-9 text-white shadow-[8px_10px_25px_rgba(29,84,56,0.13)] sm:px-10">
        <Truck
          size={220}
          strokeWidth={0.8}
          className="pointer-events-none absolute -bottom-20 -right-5 hidden text-white/10 sm:block"
        />

        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-[#F5D56A]">
            <CheckCircle2 size={14} />
            SAVORA Logistics
          </span>

          <h2 className="mt-5 text-[27px] font-black leading-tight sm:text-[36px]">
            Setiap Perjalanan,
            <span className="block text-[#F5D56A]">
              Punya Cerita Keberhasilan.
            </span>
          </h2>

          <p className="mt-4 max-w-lg text-xs leading-6 text-[#DCEBDD] sm:text-sm">
            Lihat kembali perjalanan pengiriman surplus
            panen yang telah diselesaikan.
          </p>

          <button
            type="button"
            onClick={() => downloadCSV(filteredTasks)}
            disabled={!loaded || filteredTasks.length === 0}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#F5C842] px-5 py-3 text-xs font-extrabold text-[#245C43] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={17} />
            Unduh Riwayat CSV
          </button>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-black sm:text-xl">
            Ringkasan Pengiriman
          </h2>

          <p className="mt-1 text-xs text-[#829481]">
            Statistik mengikuti pencarian dan filter yang dipilih.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {statCards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={cardStyle}
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color}`}
                >
                  <Icon size={22} />
                </span>

                <p className="mt-5 text-[11px] font-bold text-[#829481]">
                  {item.title}
                </p>

                <p className="mt-2 break-words text-2xl font-black">
                  {loaded ? item.value : "—"}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FILTERS */}
      <section className={cardStyle}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-black">
            Daftar Riwayat
          </h2>

          <span className="rounded-full bg-[#E5F0DF] px-3 py-2 text-xs font-extrabold text-[#39844E]">
            {loaded ? filteredTasks.length : "—"} Pengiriman
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#829481]"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nomor tugas, petani, atau produk..."
              className="h-12 w-full rounded-2xl border border-[#DCE6D5] bg-white pl-12 pr-4 text-sm outline-none focus:border-[#39844E]"
            />
          </div>

          <div className="relative">
            <CalendarDays
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#829481]"
            />

            <select
              value={month}
              onChange={(event) => setMonth(event.target.value)}
              className="h-12 w-full appearance-none rounded-2xl border border-[#DCE6D5] bg-white pl-11 pr-4 text-xs font-bold outline-none"
            >
              <option value="Semua">Semua Bulan</option>

              {availableMonths.map((value) => (
                <option key={value} value={value}>
                  {new Intl.DateTimeFormat("id-ID", {
                    month: "long",
                    year: "numeric",
                    timeZone: "UTC",
                  }).format(new Date(`${value}-01T00:00:00Z`))}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!loaded ? (
          <p className="py-12 text-center text-sm text-[#829481]">
            Memuat riwayat...
          </p>
        ) : filteredTasks.length === 0 ? (
          <div className="py-14 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E5F0DF] text-[#39844E]">
              <ClipboardList size={30} />
            </span>

            <h3 className="mt-5 text-lg font-black">
              Belum Ada Riwayat
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-[#829481]">
              Belum ada pengiriman selesai yang cocok
              dengan filter. Selesaikan tugas melalui
              halaman Detail Tugas agar muncul di sini.
            </p>

            <Link
              href="/courier/tasks"
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#245C43] px-5 py-3 text-xs font-extrabold text-white"
            >
              Lihat Tugas
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-[22px] border border-[#E3EBDD] bg-white/70 p-4 transition hover:border-[#A8CDA0] sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E5F0DF] text-[#39844E]">
                      <Package size={22} />
                    </span>

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-[#39844E]">
                        {task.id}
                      </p>

                      <h3 className="mt-1 text-sm font-black">
                        {task.title}
                      </h3>

                      <p className="mt-1 text-[11px] text-[#829481]">
                        {formatCourierDate(task.scheduledAt)}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E5F0DF] px-3 py-2 text-[10px] font-extrabold text-[#39844E]">
                    <CheckCircle2 size={13} />
                    Selesai
                  </span>
                </div>

                <div className="mt-5 grid gap-3 rounded-2xl bg-[#EDF2E7] p-4 sm:grid-cols-3">
                  <div>
                    <p className="text-[10px] text-[#829481]">
                      Muatan
                    </p>

                    <p className="mt-1 text-sm font-black">
                      {task.quantityKg} kg
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-[#829481]">
                      Petani
                    </p>

                    <p className="mt-1 text-sm font-black">
                      {task.farmer}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-[#829481]">
                      Estimasi Ongkos
                    </p>

                    <p className="mt-1 text-sm font-black text-[#39844E]">
                      {formatCourierCurrency(task.fee)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="flex min-w-0 items-center gap-2 text-xs text-[#829481]">
                    <MapPin size={15} className="shrink-0" />
                    <span className="truncate">
                      {task.processor} — {task.deliveryAddress}
                    </span>
                  </p>

                  <Link
                    href={`/courier/tasks/${task.id}`}
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-[#39844E]"
                  >
                    Detail Pengiriman
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* IMPACT */}
      <section className="relative overflow-hidden rounded-[26px] bg-[#E7F0DF] p-6 sm:p-8">
        <Leaf
          size={150}
          strokeWidth={1}
          className="pointer-events-none absolute -bottom-12 right-0 text-[#39844E]/10"
        />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 text-xs font-extrabold text-[#39844E]">
            <Leaf size={17} />
            Kontribusi Logistik
          </span>

          <h2 className="mt-4 text-3xl font-black">
            {loaded
              ? stats.weight.toLocaleString("id-ID")
              : "—"}{" "}
            kg
          </h2>

          <p className="mt-2 max-w-xl text-xs leading-6 text-[#718671]">
            Berat surplus yang berhasil diantarkan
            berdasarkan riwayat simulasi yang sedang
            ditampilkan. Angka ini belum merupakan
            perhitungan pengurangan limbah pangan.
          </p>
        </div>
      </section>

      <p className="text-center text-[11px] leading-5 text-[#91A08C]">
        Riwayat, ongkos, dan statistik pada halaman ini
        merupakan data simulasi yang disimpan di browser.
      </p>
    </div>
  );
}
