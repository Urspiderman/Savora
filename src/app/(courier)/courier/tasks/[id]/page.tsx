
"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  Leaf,
  MapPin,
  Navigation,
  Package,
  Phone,
  ShieldCheck,
  Truck,
  UserRound,
  Wallet,
} from "lucide-react";

import {
  getCourierTask,
  getNextCourierStatus,
  updateCourierTaskStatus,
  STATUS_FLOW,
  formatCourierCurrency,
  formatCourierDate,
  type CourierTask,
} from "@/lib/data/courier-tasks";

const cardStyle =
  "rounded-[26px] border border-white bg-[#F8F6ED] p-5 shadow-[5px_5px_15px_#e5e3d8,-5px_-5px_15px_#ffffff] sm:p-6";

const buttonLabels: Record<string, string> = {
  "Dalam Penjemputan": "Mulai Penjemputan",
  "Barang Diambil": "Konfirmasi Barang Diambil",
  "Dalam Pengiriman": "Mulai Pengiriman",
  "Selesai": "Selesaikan Pengiriman",
};

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#E4EADD] py-3 last:border-b-0">
      <span className="text-xs text-[#829481]">
        {label}
      </span>

      <span className="max-w-[65%] text-right text-xs font-extrabold text-[#245C43]">
        {value}
      </span>
    </div>
  );
}

export default function CourierTaskDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : "";

  const [task, setTask] = useState<CourierTask | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const refresh = useCallback(() => {
    setTask(getCourierTask(id) ?? null);
    setLoaded(true);
  }, [id]);

  useEffect(() => {
    const timer = window.setTimeout(refresh, 0);

    window.addEventListener("storage", refresh);
    window.addEventListener(
      "savora-courier-updated",
      refresh
    );

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("storage", refresh);
      window.removeEventListener(
        "savora-courier-updated",
        refresh
      );
    };
  }, [refresh]);

  function handleUpdateStatus() {
    if (!task || updating) return;

    const nextStatus = getNextCourierStatus(task.status);

    if (!nextStatus) return;

    setUpdating(true);
    setError("");

    try {
      const success = updateCourierTaskStatus(
        task.id,
        nextStatus
      );

      if (!success) {
        throw new Error(
          "Status tugas tidak dapat diperbarui."
        );
      }

      refresh();
      setConfirmOpen(false);

      if (nextStatus === "Selesai") {
        router.refresh();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan."
      );
    } finally {
      setUpdating(false);
    }
  }

  if (!loaded) {
    return (
      <div className="rounded-[26px] bg-[#F8F6ED] p-10 text-center text-sm text-[#829481]">
        Memuat detail tugas...
      </div>
    );
  }

  if (!task) {
    return (
      <div className="mx-auto max-w-2xl rounded-[26px] bg-[#F8F6ED] p-10 text-center text-[#245C43]">
        <Package
          size={40}
          className="mx-auto text-[#39844E]"
        />

        <h1 className="mt-4 text-xl font-black">
          Tugas Tidak Ditemukan
        </h1>

        <p className="mt-2 text-sm text-[#829481]">
          Periksa kembali nomor tugas yang dibuka.
        </p>

        <Link
          href="/courier/tasks"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#245C43] px-5 py-3 text-xs font-extrabold text-white"
        >
          <ArrowLeft size={16} />
          Kembali ke Tugas
        </Link>
      </div>
    );
  }

  const currentIndex = STATUS_FLOW.indexOf(task.status);
  const nextStatus = getNextCourierStatus(task.status);
  const isCompleted = task.status === "Selesai";

  const mapsPickupUrl =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(task.pickupAddress);

  const mapsDeliveryUrl =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(task.deliveryAddress);

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-7 pb-8 text-[#245C43]">
      {/* HEADER */}
      <div>
        <Link
          href="/courier/tasks"
          className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-[#39844E]"
        >
          <ArrowLeft size={16} />
          Kembali ke Daftar Tugas
        </Link>

        <p className="mb-2 flex items-center gap-2 text-xs font-bold text-[#81967C]">
          <Leaf size={15} />
          SAVORA / Kurir / Detail Tugas
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black sm:text-3xl">
              Detail Tugas
            </h1>

            <p className="mt-2 text-sm text-[#849482]">
              {task.id}
            </p>
          </div>

          <span
            className={`rounded-full px-4 py-2 text-xs font-extrabold ${
              isCompleted
                ? "bg-[#E1F0DC] text-[#39844E]"
                : "bg-[#FFF0C8] text-[#9C762B]"
            }`}
          >
            {task.status}
          </span>
        </div>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden rounded-[30px] bg-[#245C43] px-6 py-8 text-white sm:px-9">
        <Truck
          size={210}
          strokeWidth={0.8}
          className="pointer-events-none absolute -bottom-16 -right-5 hidden text-white/10 sm:block"
        />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold text-[#F5D56A]">
            <Package size={14} />
            SAVORA Logistics
          </span>

          <h2 className="mt-4 max-w-lg text-2xl font-black sm:text-3xl">
            {task.title}
          </h2>

          <p className="mt-3 text-sm text-[#DCEBDD]">
            {task.farmer} → {task.processor}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-2xl bg-white/10 px-4 py-3 text-xs font-bold">
              {task.quantityKg} kg
            </span>

            <span className="rounded-2xl bg-white/10 px-4 py-3 text-xs font-bold">
              {task.product}
            </span>
          </div>
        </div>
      </section>

      {/* PROGRESS */}
      <section className={cardStyle}>
        <div className="mb-6 flex items-center gap-2">
          <ClipboardList size={20} />
          <h2 className="text-lg font-black">
            Progres Pengiriman
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-5">
          {STATUS_FLOW.map((status, index) => {
            const done = index < currentIndex;
            const current = index === currentIndex;

            return (
              <div
                key={status}
                className={`rounded-2xl border p-3 ${
                  done
                    ? "border-[#A8CDA0] bg-[#E6F1E0]"
                    : current
                      ? "border-[#F1CD61] bg-[#FFF3CF]"
                      : "border-[#E2E8DD] bg-white"
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black ${
                    done
                      ? "bg-[#39844E] text-white"
                      : current
                        ? "bg-[#F5C842] text-[#245C43]"
                        : "bg-[#EDF1EA] text-[#849482]"
                  }`}
                >
                  {done ? <Check size={17} /> : index + 1}
                </span>

                <p className="mt-3 text-[11px] font-extrabold leading-5">
                  {status}
                </p>

                <p className="mt-1 text-[10px] text-[#829481]">
                  {done
                    ? "Selesai"
                    : current
                      ? "Status saat ini"
                      : "Belum dimulai"}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          {/* PICKUP */}
          <section className={cardStyle}>
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-[#E5F0DF] p-3 text-[#39844E]">
                <MapPin size={23} />
              </span>

              <div>
                <p className="text-[11px] font-bold text-[#829481]">
                  Lokasi Penjemputan
                </p>

                <h2 className="text-lg font-black">
                  Petani
                </h2>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-[#EDF2E7] p-5">
              <p className="flex items-center gap-2 text-sm font-black">
                <UserRound size={17} />
                {task.farmer}
              </p>

              <p className="mt-3 text-xs leading-6 text-[#718671]">
                {task.pickupAddress}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={`tel:${task.farmerPhone}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold"
                >
                  <Phone size={15} />
                  Hubungi Petani
                </a>

                <a
                  href={mapsPickupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#245C43] px-4 py-3 text-xs font-bold text-white"
                >
                  <Navigation size={15} />
                  Buka Maps
                </a>
              </div>
            </div>
          </section>

          {/* DELIVERY */}
          <section className={cardStyle}>
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-[#FFF0C8] p-3 text-[#A47C27]">
                <Truck size={23} />
              </span>

              <div>
                <p className="text-[11px] font-bold text-[#829481]">
                  Lokasi Pengantaran
                </p>

                <h2 className="text-lg font-black">
                  Pengolah
                </h2>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-[#EDF2E7] p-5">
              <p className="flex items-center gap-2 text-sm font-black">
                <UserRound size={17} />
                {task.processor}
              </p>

              <p className="mt-3 text-xs leading-6 text-[#718671]">
                {task.deliveryAddress}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={`tel:${task.processorPhone}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold"
                >
                  <Phone size={15} />
                  Hubungi Pengolah
                </a>

                <a
                  href={mapsDeliveryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#245C43] px-4 py-3 text-xs font-bold text-white"
                >
                  <Navigation size={15} />
                  Buka Maps
                </a>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          {/* TASK INFO */}
          <section className={cardStyle}>
            <h2 className="flex items-center gap-2 text-lg font-black">
              <Package size={20} />
              Informasi Muatan
            </h2>

            <div className="mt-5">
              <InfoRow label="Nomor Tugas" value={task.id} />
              <InfoRow label="Produk" value={task.product} />
              <InfoRow
                label="Berat Muatan"
                value={`${task.quantityKg} kg`}
              />
              <InfoRow
                label="Jadwal"
                value={formatCourierDate(task.scheduledAt)}
              />
              <InfoRow
                label="Estimasi Ongkos"
                value={formatCourierCurrency(task.fee)}
              />
            </div>
          </section>

          {/* NOTES */}
          <section className={cardStyle}>
            <h2 className="flex items-center gap-2 text-lg font-black">
              <ClipboardList size={20} />
              Catatan Pengiriman
            </h2>

            <p className="mt-4 rounded-2xl bg-[#EDF2E7] p-4 text-xs leading-6 text-[#718671]">
              {task.notes || "Tidak ada catatan khusus."}
            </p>
          </section>

          {/* ACTION */}
          <section className="rounded-[26px] bg-[#245C43] p-6 text-white">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              {isCompleted ? (
                <CheckCircle2 size={25} />
              ) : (
                <Truck size={25} />
              )}
            </span>

            <h2 className="mt-5 text-xl font-black">
              {isCompleted
                ? "Pengiriman Selesai"
                : "Perbarui Status Tugas"}
            </h2>

            <p className="mt-3 text-xs leading-6 text-[#DCEBDD]">
              {isCompleted
                ? "Barang telah dikonfirmasi diterima pengolah dalam simulasi."
                : "Perbarui status sesuai progres penjemputan dan pengantaran."}
            </p>

            {error && (
              <p
                role="alert"
                className="mt-4 rounded-xl bg-red-100 p-3 text-xs font-bold text-red-700"
              >
                {error}
              </p>
            )}

            {nextStatus ? (
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                disabled={updating}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F5C842] px-5 py-4 text-xs font-extrabold text-[#245C43] disabled:opacity-60"
              >
                {buttonLabels[nextStatus]}
                <ArrowRight size={17} />
              </button>
            ) : (
              <Link
                href="/courier/history"
                className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-[#F5C842] px-5 py-4 text-xs font-extrabold text-[#245C43]"
              >
                <CheckCircle2 size={17} />
                Lihat Riwayat
              </Link>
            )}
          </section>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {confirmOpen && nextStatus && (
        <div
          role="presentation"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#142D20]/65 p-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-task-title"
            className="w-full max-w-md rounded-[26px] bg-[#F8F6ED] p-6 shadow-2xl"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5F0DF] text-[#39844E]">
              <ShieldCheck size={28} />
            </span>

            <h2
              id="confirm-task-title"
              className="mt-5 text-xl font-black"
            >
              Konfirmasi Status
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#718671]">
              Ubah status tugas menjadi{" "}
              <strong className="text-[#245C43]">
                {nextStatus}
              </strong>
              ?
            </p>

            <p className="mt-2 text-xs text-[#829481]">
              Status simulasi ini akan langsung diperbarui
              di Dashboard dan halaman Tugas.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="flex-1 rounded-2xl border border-[#DCE6D5] bg-white px-4 py-3 text-xs font-extrabold"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={updating}
                className="flex-1 rounded-2xl bg-[#245C43] px-4 py-3 text-xs font-extrabold text-white disabled:opacity-60"
              >
                {updating ? "Menyimpan..." : "Konfirmasi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
