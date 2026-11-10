
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  Leaf,
  MapPin,
  Package,
  Search,
  Truck,
} from "lucide-react";

import {
  getCourierTasks,
  formatCourierDate,
  type CourierTask,
} from "@/lib/data/courier-tasks";

export default function CourierTasksPage() {
  const [tasks, setTasks] = useState<CourierTask[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Aktif");

  const refresh = useCallback(() => {
    setTasks(getCourierTasks());
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(refresh, 0);

    window.addEventListener("storage", refresh);
    window.addEventListener("savora-courier-updated", refresh);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("savora-courier-updated", refresh);
    };
  }, [refresh]);

  const filtered = useMemo(() => {
    return tasks.filter((task) => {
      const keyword = search.toLowerCase();

      const matchesSearch = [
        task.id,
        task.title,
        task.farmer,
        task.processor,
      ].some((value) => value.toLowerCase().includes(keyword));

      const matchesStatus =
        filter === "Semua" ||
        (filter === "Aktif" && task.status !== "Selesai") ||
        task.status === filter;

      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, filter]);

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-7 pb-8 text-[#245C43]">
      <div>
        <p className="mb-2 flex items-center gap-2 text-xs font-bold text-[#81967C]">
          <Leaf size={15} />
          SAVORA / Kurir / Tugas
        </p>

        <h1 className="text-2xl font-black sm:text-3xl">
          Tugas Penjemputan
        </h1>

        <p className="mt-2 text-sm text-[#849482]">
          Pantau penjemputan dan pengantaran yang ditugaskan.
        </p>
      </div>

      <section className="relative overflow-hidden rounded-[28px] bg-[#245C43] px-6 py-8 text-white sm:px-9">
        <Truck
          size={160}
          className="pointer-events-none absolute -bottom-12 right-0 text-white/10"
        />

        <div className="relative">
          <p className="text-xs font-bold text-[#F5D56A]">
            SAVORA Logistics
          </p>

          <h2 className="mt-3 text-2xl font-black">
            Kelola Setiap Perjalanan
          </h2>

          <p className="mt-2 max-w-lg text-xs leading-6 text-[#DCEBDD]">
            Pastikan setiap surplus panen dijemput dan
            dikirim ke pengolah sesuai tugas.
          </p>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#829481]"
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari tugas, petani, atau pengolah..."
            className="h-12 w-full rounded-2xl border border-[#DFE7D8] bg-white pl-12 pr-4 text-sm outline-none focus:border-[#39844E]"
          />
        </div>

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="h-12 rounded-2xl border border-[#DFE7D8] bg-white px-4 text-sm font-bold outline-none"
        >
          <option>Aktif</option>
          <option>Semua</option>
          <option>Menunggu</option>
          <option>Dalam Penjemputan</option>
          <option>Barang Diambil</option>
          <option>Dalam Pengiriman</option>
          <option>Selesai</option>
        </select>
      </div>

      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-black">
          Daftar Tugas
        </h2>

        <span className="text-xs font-bold text-[#829481]">
          {filtered.length} tugas
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[24px] bg-[#EDF2E7] p-12 text-center">
          <ClipboardList
            size={35}
            className="mx-auto text-[#39844E]"
          />

          <p className="mt-4 font-black">
            Tidak Ada Tugas Ditemukan
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((task) => (
            <article
              key={task.id}
              className="flex flex-col overflow-hidden rounded-[25px] border border-white bg-[#F8F6ED] shadow-[5px_5px_15px_#e5e3d8,-5px_-5px_15px_#ffffff]"
            >
              <div className="bg-[#E7F0DF] p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 text-[#39844E]">
                    <Package size={22} />
                  </span>

                  <span className="rounded-full bg-white/80 px-3 py-2 text-[10px] font-extrabold text-[#39844E]">
                    {task.status}
                  </span>
                </div>

                <p className="mt-4 text-[10px] font-bold text-[#39844E]">
                  {task.id}
                </p>

                <h3 className="mt-1 text-lg font-black">
                  {task.title}
                </h3>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="rounded-2xl bg-[#EDF2E7] p-4">
                  <p className="text-[11px] text-[#829481]">
                    Muatan
                  </p>

                  <p className="mt-1 text-2xl font-black">
                    {task.quantityKg} kg
                  </p>
                </div>

                <div className="mt-5 space-y-4 text-xs">
                  <div>
                    <p className="font-black">Petani</p>
                    <p className="mt-1 text-[#829481]">
                      {task.farmer}
                    </p>
                  </div>

                  <div>
                    <p className="font-black">Tujuan Pengolah</p>
                    <p className="mt-1 text-[#829481]">
                      {task.processor}
                    </p>
                  </div>

                  <div className="flex items-start gap-2 text-[#829481]">
                    <MapPin size={15} className="shrink-0" />
                    <span>{task.pickupAddress}</span>
                  </div>

                  <p className="text-[#829481]">
                    Jadwal: {formatCourierDate(task.scheduledAt)}
                  </p>
                </div>

                <Link
                  href={`/courier/tasks/${task.id}`}
                  className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-[#245C43] px-4 py-3 text-xs font-extrabold text-white transition hover:bg-[#087338]"
                >
                  Lihat Detail Tugas
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
