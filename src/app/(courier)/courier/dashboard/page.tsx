
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  Leaf,
  MapPin,
  Package,
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
  "rounded-[24px] border border-white bg-[#F8F6ED] shadow-[5px_5px_15px_#e5e3d8,-5px_-5px_15px_#ffffff]";

export default function CourierDashboardPage() {
  const [tasks, setTasks] = useState<CourierTask[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(() => {
    setTasks(getCourierTasks());
    setLoaded(true);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(refresh, 0);

    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    window.addEventListener("savora-courier-updated", refresh);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("savora-courier-updated", refresh);
    };
  }, [refresh]);

  const stats = useMemo(() => {
    const active = tasks.filter(
      (task) => task.status !== "Selesai"
    );

    const completed = tasks.filter(
      (task) => task.status === "Selesai"
    );

    return {
      total: tasks.length,
      active: active.length,
      completed: completed.length,
      kilograms: completed.reduce(
        (sum, task) => sum + task.quantityKg,
        0
      ),
      earnings: completed.reduce(
        (sum, task) => sum + task.fee,
        0
      ),
    };
  }, [tasks]);

  const activeTasks = tasks.filter(
    (task) => task.status !== "Selesai"
  );

  const statCards = [
    {
      title: "Total Tugas",
      value: String(stats.total),
      icon: ClipboardList,
      color: "bg-[#E5F0DF] text-[#39844E]",
    },
    {
      title: "Tugas Aktif",
      value: String(stats.active),
      icon: Truck,
      color: "bg-[#FFF0C8] text-[#A47C27]",
    },
    {
      title: "Tugas Selesai",
      value: String(stats.completed),
      icon: CheckCircle2,
      color: "bg-[#E4ECF8] text-[#4A6BA4]",
    },
    {
      title: "Total Diangkut",
      value: `${stats.kilograms} kg`,
      icon: Package,
      color: "bg-[#E6EBE5] text-[#426E55]",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-8 pb-8 text-[#245C43]">
      <div>
        <p className="mb-2 flex items-center gap-2 text-xs font-bold text-[#81967C]">
          <Leaf size={15} />
          SAVORA / Kurir / Dashboard
        </p>

        <h1 className="text-2xl font-black sm:text-3xl">
          Dashboard Kurir
        </h1>

        <p className="mt-2 text-sm text-[#849482]">
          Pantau tugas penjemputan dan pengantaran hasil panen.
        </p>
      </div>

      <section className="relative overflow-hidden rounded-[30px] bg-[#245C43] px-6 py-9 text-white shadow-[8px_10px_25px_rgba(29,84,56,0.13)] sm:px-10 sm:py-11">
        <Truck
          size={240}
          strokeWidth={0.8}
          className="pointer-events-none absolute -bottom-16 -right-10 hidden text-white/10 md:block"
        />

        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-[#F5D56A]">
            <Truck size={14} />
            SAVORA Logistics
          </span>

          <h2 className="mt-5 text-[28px] font-black leading-tight sm:text-[38px]">
            Setiap Pengiriman,
            <span className="block text-[#F5D56A]">
              Membawa Perubahan.
            </span>
          </h2>

          <p className="mt-4 text-sm leading-6 text-[#DCEBDD]">
            Jemput surplus panen dari petani dan antarkan
            kepada pengolah secara terencana.
          </p>

          <Link
            href="/courier/tasks"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#F5C842] px-5 py-3 text-xs font-extrabold text-[#245C43] transition hover:bg-[#FFE18A]"
          >
            <ClipboardList size={17} />
            Lihat Tugas Saya
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-black sm:text-xl">
          Ringkasan Aktivitas
        </h2>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
          {statCards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={`${cardStyle} min-w-0 p-4 sm:p-5`}
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color}`}
                >
                  <Icon size={22} />
                </span>

                <p className="mt-5 text-[11px] font-bold text-[#829481]">
                  {item.title}
                </p>

                <p className="mt-1 break-words text-2xl font-black sm:text-[29px]">
                  {loaded ? item.value : "—"}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <section className="min-w-0 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black">
              Tugas Penjemputan
            </h2>

            <Link
              href="/courier/tasks"
              className="flex items-center gap-1 text-xs font-bold text-[#39844E]"
            >
              Lihat Semua
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className={`${cardStyle} p-5`}>
            {!loaded ? (
              <p className="py-12 text-center text-sm text-[#829481]">
                Memuat tugas...
              </p>
            ) : activeTasks.length === 0 ? (
              <div className="py-12 text-center">
                <CheckCircle2
                  size={36}
                  className="mx-auto text-[#39844E]"
                />
                <h3 className="mt-4 font-black">
                  Semua Tugas Selesai
                </h3>
                <p className="mt-2 text-xs text-[#829481]">
                  Belum ada tugas aktif saat ini.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#E5EADD]">
                {activeTasks.slice(0, 4).map((task) => (
                  <Link
                    key={task.id}
                    href={`/courier/tasks/${task.id}`}
                    className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E5F0DF] text-[#39844E]">
                      <Package size={21} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black">
                        {task.title}
                      </p>

                      <p className="mt-1 text-xs text-[#829481]">
                        {task.farmer} • {task.quantityKg} kg
                      </p>

                      <p className="mt-1 flex items-center gap-1 text-[11px] text-[#829481]">
                        <MapPin size={12} />
                        <span className="truncate">
                          {task.pickupAddress}
                        </span>
                      </p>
                    </div>

                    <ChevronRight
                      size={18}
                      className="shrink-0 text-[#829481]"
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-black">
            Ringkasan Pengiriman
          </h2>

          <div className={`${cardStyle} space-y-5 p-6`}>
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-[#FFF0C8] p-3 text-[#A47C27]">
                <Wallet size={23} />
              </span>

              <div>
                <p className="text-xs text-[#829481]">
                  Estimasi Ongkos Tugas Selesai
                </p>

                <p className="mt-1 text-xl font-black">
                  {loaded
                    ? formatCourierCurrency(stats.earnings)
                    : "—"}
                </p>
              </div>
            </div>

            <div className="h-px bg-[#E5EADD]" />

            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-[#E5F0DF] p-3 text-[#39844E]">
                <Clock3 size={23} />
              </span>

              <div>
                <p className="text-xs text-[#829481]">
                  Tugas Aktif
                </p>

                <p className="mt-1 text-xl font-black">
                  {loaded ? stats.active : "—"} tugas
                </p>
              </div>
            </div>

            <Link
              href="/courier/history"
              className="flex items-center justify-between rounded-2xl bg-[#EDF2E7] px-4 py-3 text-xs font-extrabold text-[#245C43]"
            >
              Lihat Riwayat
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>

      <section className="rounded-[25px] bg-[#E7F0DF] p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-extrabold text-[#39844E]">
          <Leaf size={18} />
          Kontribusi Logistik
        </div>

        <h2 className="mt-3 text-3xl font-black">
          {loaded ? stats.kilograms : "—"} kg
        </h2>

        <p className="mt-2 max-w-xl text-xs leading-6 text-[#718671]">
          Total berat surplus yang telah diantarkan
          berdasarkan tugas simulasi berstatus selesai.
        </p>
      </section>

      <p className="text-center text-[11px] text-[#91A08C]">
        Data pengiriman masih berupa simulasi dan belum
        mencerminkan aktivitas logistik nyata.
      </p>
    </div>
  );
}
