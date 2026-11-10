
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
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock3,
  Leaf,
  MapPin,
  Navigation,
  Package,
  Route,
  Truck,
  UserRound,
} from "lucide-react";

import {
  getCourierTasks,
  formatCourierDate,
  type CourierTask,
} from "@/lib/data/courier-tasks";

const cardStyle =
  "rounded-[26px] border border-white bg-[#F8F6ED] p-5 shadow-[5px_5px_15px_#e5e3d8,-5px_-5px_15px_#ffffff] sm:p-6";

function mapsSearch(address: string) {
  return (
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(address)
  );
}

function mapsDirections(origin: string, destination: string) {
  return (
    "https://www.google.com/maps/dir/?api=1" +
    "&origin=" +
    encodeURIComponent(origin) +
    "&destination=" +
    encodeURIComponent(destination) +
    "&travelmode=driving"
  );
}

export default function CourierNavigationPage() {
  const [tasks, setTasks] = useState<CourierTask[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(() => {
    const data = getCourierTasks().filter(
      (task) => task.status !== "Selesai"
    );

    setTasks(data);
    setSelectedId((previous) =>
      data.some((task) => task.id === previous)
        ? previous
        : (data[0]?.id ?? "")
    );
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

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedId),
    [tasks, selectedId]
  );

  const pickupDone = selectedTask
    ? [
        "Barang Diambil",
        "Dalam Pengiriman",
      ].includes(selectedTask.status)
    : false;

  const routeUrl = selectedTask
    ? mapsDirections(
        selectedTask.pickupAddress,
        selectedTask.deliveryAddress
      )
    : "";

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-7 pb-8 text-[#245C43]">
      {/* HEADER */}
      <div>
        <p className="mb-2 flex items-center gap-2 text-xs font-bold text-[#81967C]">
          <Leaf size={15} />
          SAVORA / Kurir / Navigasi
        </p>

        <h1 className="text-2xl font-black sm:text-3xl">
          Navigasi Pengiriman
        </h1>

        <p className="mt-2 text-sm text-[#849482]">
          Akses lokasi petani dan tujuan pengolah berdasarkan tugas aktif.
        </p>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden rounded-[30px] bg-[#245C43] px-6 py-9 text-white sm:px-10">
        <Route
          size={220}
          strokeWidth={0.8}
          className="pointer-events-none absolute -bottom-20 -right-4 hidden text-white/10 sm:block"
        />

        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold text-[#F5D56A]">
            <Navigation size={14} />
            SAVORA Smart Logistics
          </span>

          <h2 className="mt-5 text-[27px] font-black leading-tight sm:text-[36px]">
            Perjalanan Lebih Terarah,
            <span className="block text-[#F5D56A]">
              Pengiriman Lebih Mudah.
            </span>
          </h2>

          <p className="mt-4 max-w-lg text-xs leading-6 text-[#DCEBDD] sm:text-sm">
            Pilih tugas, periksa lokasi penjemputan, lalu
            buka rute menuju tujuan pengantaran.
          </p>
        </div>
      </section>

      {/* TASK SELECTOR */}
      <section className={cardStyle}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-black">
              <ClipboardList size={20} />
              Pilih Tugas Pengiriman
            </h2>

            <p className="mt-2 text-xs text-[#829481]">
              {loaded ? tasks.length : "—"} tugas aktif tersedia
            </p>
          </div>

          <Link
            href="/courier/tasks"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-[#39844E]"
          >
            Semua Tugas
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="relative mt-5">
          <select
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
            disabled={!loaded || tasks.length === 0}
            className="h-14 w-full appearance-none rounded-2xl border border-[#DCE6D5] bg-white px-4 pr-12 text-sm font-bold outline-none focus:border-[#39844E] disabled:opacity-60"
          >
            {!loaded && <option value="">Memuat tugas...</option>}

            {loaded && tasks.length === 0 && (
              <option value="">Tidak ada tugas aktif</option>
            )}

            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.id} — {task.product} ({task.quantityKg} kg)
              </option>
            ))}
          </select>

          <ChevronDown
            size={19}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#829481]"
          />
        </div>
      </section>

      {!selectedTask ? (
        <section className={`${cardStyle} py-16 text-center`}>
          <CheckCircle2
            size={42}
            className="mx-auto text-[#39844E]"
          />

          <h2 className="mt-5 text-xl font-black">
            Tidak Ada Pengiriman Aktif
          </h2>

          <p className="mt-3 text-sm text-[#829481]">
            Tugas yang sudah selesai dapat dilihat di riwayat.
          </p>

          <Link
            href="/courier/history"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#245C43] px-5 py-3 text-xs font-extrabold text-white"
          >
            Lihat Riwayat
            <ArrowRight size={16} />
          </Link>
        </section>
      ) : (
        <>
          {/* ROUTE SUMMARY */}
          <section className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
            <div className={cardStyle}>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-black">
                  Rute Pengiriman
                </h2>

                <span className="rounded-full bg-[#E5F0DF] px-3 py-2 text-[10px] font-extrabold text-[#39844E]">
                  {selectedTask.status}
                </span>
              </div>

              <div className="mt-6 flex gap-4">
                {/* ROUTE LINE */}
                <div className="flex flex-col items-center">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E5F0DF] text-[#39844E]">
                    <MapPin size={21} />
                  </span>

                  <div className="my-2 h-20 w-0.5 border-l-2 border-dashed border-[#9DBA99]" />

                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0C8] text-[#A47C27]">
                    <Truck size={21} />
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="min-h-[116px]">
                    <p className="text-[11px] font-bold text-[#829481]">
                      TITIK PENJEMPUTAN
                    </p>

                    <h3 className="mt-2 text-sm font-black">
                      {selectedTask.farmer}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-[#718671]">
                      {selectedTask.pickupAddress}
                    </p>

                    {pickupDone && (
                      <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-[#39844E]">
                        <CheckCircle2 size={13} />
                        Barang sudah diambil
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="text-[11px] font-bold text-[#829481]">
                      TITIK PENGANTARAN
                    </p>

                    <h3 className="mt-2 text-sm font-black">
                      {selectedTask.processor}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-[#718671]">
                      {selectedTask.deliveryAddress}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <a
                  href={mapsSearch(selectedTask.pickupAddress)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#DCE6D5] bg-white px-4 py-3 text-xs font-extrabold"
                >
                  <MapPin size={17} />
                  Lokasi Petani
                </a>

                <a
                  href={mapsSearch(selectedTask.deliveryAddress)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#DCE6D5] bg-white px-4 py-3 text-xs font-extrabold"
                >
                  <MapPin size={17} />
                  Lokasi Pengolah
                </a>
              </div>

              <a
                href={routeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#245C43] px-5 py-4 text-xs font-extrabold text-white"
              >
                <Navigation size={18} />
                Buka Rute di Google Maps
                <ArrowRight size={16} />
              </a>
            </div>

            {/* TASK DETAILS */}
            <div className={`${cardStyle} flex flex-col`}>
              <h2 className="text-lg font-black">
                Detail Perjalanan
              </h2>

              <div className="mt-6 space-y-5">
                <div className="flex items-center gap-3">
                  <span className="rounded-2xl bg-[#E5F0DF] p-3 text-[#39844E]">
                    <Package size={20} />
                  </span>

                  <div>
                    <p className="text-[11px] text-[#829481]">
                      Muatan
                    </p>

                    <p className="text-sm font-black">
                      {selectedTask.product}
                    </p>

                    <p className="text-xs text-[#829481]">
                      {selectedTask.quantityKg} kg
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-2xl bg-[#FFF0C8] p-3 text-[#A47C27]">
                    <Clock3 size={20} />
                  </span>

                  <div>
                    <p className="text-[11px] text-[#829481]">
                      Jadwal Penjemputan
                    </p>

                    <p className="text-xs font-black">
                      {formatCourierDate(
                        selectedTask.scheduledAt
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-2xl bg-[#E4ECF8] p-3 text-[#4A6BA4]">
                    <Route size={20} />
                  </span>

                  <div>
                    <p className="text-[11px] text-[#829481]">
                      Nomor Tugas
                    </p>

                    <p className="text-sm font-black">
                      {selectedTask.id}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-7">
                <Link
                  href={`/courier/tasks/${selectedTask.id}`}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#E5F0DF] px-4 py-4 text-xs font-extrabold text-[#245C43]"
                >
                  Lihat Detail & Ubah Status
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>

          {/* GUIDANCE */}
          <section className="rounded-[25px] bg-[#E7F0DF] p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-lg font-black">
              <Leaf size={20} className="text-[#39844E]" />
              Panduan Pengiriman
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                {
                  number: "01",
                  title: "Menuju Petani",
                  description:
                    "Periksa alamat dan lakukan penjemputan hasil panen.",
                },
                {
                  number: "02",
                  title: "Periksa Muatan",
                  description:
                    "Pastikan produk dan berat sesuai detail tugas.",
                },
                {
                  number: "03",
                  title: "Antarkan Barang",
                  description:
                    "Kirim ke pengolah dan konfirmasi penyelesaian.",
                },
              ].map((step) => (
                <div
                  key={step.number}
                  className="rounded-2xl bg-white/70 p-5"
                >
                  <span className="text-2xl font-black text-[#39844E]">
                    {step.number}
                  </span>

                  <h3 className="mt-3 text-sm font-black">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-[#718671]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <p className="text-center text-[11px] leading-5 text-[#91A08C]">
        Navigasi menggunakan alamat simulasi.
        Rute aktual perlu diverifikasi melalui Google Maps.
      </p>
    </div>
  );
}
