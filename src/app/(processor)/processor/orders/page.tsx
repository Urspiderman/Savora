
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
  MapPin,
  Package,
  Search,
  ShoppingBag,
  Truck,
  Wallet,
  X,
  XCircle,
} from "lucide-react";

import {
  getProcessorOrders,
  updateProcessorOrderStatus,
  formatOrderDate,
  type ProcessorOrder,
  type ProcessorOrderStatus,
} from "@/lib/data/processor-orders";

import { formatRupiah } from "@/lib/data/processor-products";

type FilterStatus = "Semua" | ProcessorOrderStatus;

const STATUS_OPTIONS: FilterStatus[] = [
  "Semua",
  "Menunggu Konfirmasi",
  "Diproses",
  "Dikirim",
  "Selesai",
  "Dibatalkan",
];

function statusStyle(status: ProcessorOrderStatus) {
  switch (status) {
    case "Menunggu Konfirmasi":
      return "bg-[#FFF1CF] text-[#A17A28]";
    case "Diproses":
      return "bg-[#E5EDFF] text-[#416BA3]";
    case "Dikirim":
      return "bg-[#E6EDFA] text-[#526AB0]";
    case "Selesai":
      return "bg-[#E3F1E0] text-[#318148]";
    case "Dibatalkan":
      return "bg-[#F9E7E4] text-[#A14E45]";
    default:
      return "bg-[#EDF2E7] text-[#245C43]";
  }
}

function StatusIcon({
  status,
}: {
  status: ProcessorOrderStatus;
}) {
  if (status === "Selesai") return <CheckCircle2 size={14} />;
  if (status === "Dibatalkan") return <XCircle size={14} />;
  if (status === "Dikirim") return <Truck size={14} />;
  if (status === "Diproses") return <Package size={14} />;

  return <Clock3 size={14} />;
}

export default function ProcessorOrdersPage() {
  const [orders, setOrders] = useState<ProcessorOrder[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("Semua");
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const loadOrders = useCallback(() => {
    setOrders(getProcessorOrders());
    setLoaded(true);
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(loadOrders, 0);

    window.addEventListener("storage", loadOrders);
    window.addEventListener("savora-orders-updated", loadOrders);
    window.addEventListener("focus", loadOrders);

    return () => {
      window.clearTimeout(initial);
      window.removeEventListener("storage", loadOrders);
      window.removeEventListener("savora-orders-updated", loadOrders);
      window.removeEventListener("focus", loadOrders);
    };
  }, [loadOrders]);

  const stats = useMemo(() => {
    const active = orders.filter(
      (order) =>
        order.status !== "Selesai" &&
        order.status !== "Dibatalkan"
    );

    const completed = orders.filter(
      (order) => order.status === "Selesai"
    );

    const totalSpending = completed.reduce(
      (sum, order) => sum + order.total,
      0
    );

    return {
      total: orders.length,
      active: active.length,
      completed: completed.length,
      spending: totalSpending,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return orders
      .filter((order) => {
        const matchesSearch =
          order.id.toLowerCase().includes(keyword) ||
          order.productName.toLowerCase().includes(keyword) ||
          order.farmer.toLowerCase().includes(keyword);

        const matchesStatus =
          filter === "Semua" || order.status === filter;

        return matchesSearch && matchesStatus;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
  }, [orders, search, filter]);

  function cancelOrder() {
    if (!cancelTarget) return;

    const success = updateProcessorOrderStatus(
      cancelTarget,
      "Dibatalkan"
    );

    setCancelTarget(null);
    loadOrders();

    setNotice(
      success
        ? "Pesanan simulasi berhasil dibatalkan."
        : "Status pesanan tidak dapat diubah."
    );
  }

  function simulateNextStatus(order: ProcessorOrder) {
    const nextStatus: ProcessorOrderStatus | null =
      order.status === "Menunggu Konfirmasi"
        ? "Diproses"
        : order.status === "Diproses"
          ? "Dikirim"
          : order.status === "Dikirim"
            ? "Selesai"
            : null;

    if (!nextStatus) return;

    const success = updateProcessorOrderStatus(
      order.id,
      nextStatus
    );

    loadOrders();

    setNotice(
      success
        ? `Status simulasi diperbarui menjadi "${nextStatus}".`
        : "Status pesanan tidak dapat diubah."
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] min-w-0 space-y-7 pb-6 text-[#245C43]">
      {/* PAGE HEADING */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#81967C]">
            <ShoppingBag size={15} />
            SAVORA / Pengolah / Pesanan
          </div>

          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            Pesanan Saya
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#849482]">
            Pantau pembelian surplus hasil panen dari petani.
          </p>
        </div>

        <Link
          href="/processor/marketplace"
          className="inline-flex items-center gap-2 rounded-2xl bg-[#245C43] px-5 py-3 text-xs font-extrabold text-white transition hover:bg-[#087338]"
        >
          <ShoppingBag size={17} />
          Belanja Surplus
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* HERO */}
      <section className="relative isolate overflow-hidden rounded-[27px] bg-[#245C43] px-5 py-7 sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute -right-14 -top-20 h-60 w-60 rounded-full border-[35px] border-white/[0.06]" />

        <Package
          size={145}
          strokeWidth={1}
          className="pointer-events-none absolute -bottom-10 right-3 text-white/10 sm:right-12"
        />

        <div className="relative z-10 max-w-[570px]">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold text-[#E5F0DB]">
            <ClipboardList size={14} className="text-[#F5C842]" />
            Manajemen Pesanan
          </span>

          <h2 className="mt-4 text-2xl font-black text-white sm:text-3xl">
            Semua Pesanan,
            <span className="block text-[#F5C842]">
              Dalam Satu Tempat.
            </span>
          </h2>

          <p className="mt-3 text-xs leading-6 text-[#DCEBDD] sm:text-sm">
            Lihat status pemesanan, detail pembelian,
            dan riwayat transaksi surplus panenmu.
          </p>
        </div>
      </section>

      {/* STATISTICS */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
        {[
          {
            label: "Total Pesanan",
            value: stats.total.toString(),
            icon: ShoppingBag,
            color: "bg-[#E6F0E0] text-[#39844E]",
          },
          {
            label: "Pesanan Aktif",
            value: stats.active.toString(),
            icon: Clock3,
            color: "bg-[#FFF0CA] text-[#A17A28]",
          },
          {
            label: "Pesanan Selesai",
            value: stats.completed.toString(),
            icon: CheckCircle2,
            color: "bg-[#E3F1E0] text-[#318148]",
          },
          {
            label: "Total Pembelian",
            value: formatRupiah(stats.spending),
            icon: Wallet,
            color: "bg-[#E5EBE6] text-[#426E55]",
          },
        ].map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="min-w-0 rounded-[22px] border border-white bg-[#F8F6ED] p-4 shadow-[5px_5px_14px_#e4e2d7,-5px_-5px_14px_#ffffff] sm:p-5"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.color}`}
              >
                <Icon size={21} />
              </div>

              <p className="mt-4 text-[11px] font-bold text-[#849482]">
                {stat.label}
              </p>

              <p className="mt-1 break-words text-xl font-black sm:text-2xl">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* SEARCH */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#829781]"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nomor pesanan, produk, petani..."
              aria-label="Cari pesanan"
              className="h-12 w-full rounded-2xl border border-[#DFE7D8] bg-white pl-12 pr-4 text-sm outline-none placeholder:text-[#A1AEA0] focus:border-[#5DA66C]"
            />
          </div>

          <span className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#DCE8D4] bg-[#EAF2E4] px-5 text-xs font-bold text-[#39844E]">
            <CheckCircle2 size={16} />
            Mode Simulasi
          </span>
        </div>

        {/* STATUS FILTER */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-bold transition ${
                filter === status
                  ? "bg-[#245C43] text-white"
                  : "border border-[#DFE7D8] bg-white text-[#718770]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </section>

      {notice && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-2xl bg-[#E5F0DF] px-4 py-3 text-xs font-bold text-[#39844E]"
        >
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Tutup pemberitahuan"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* ORDERS HEADER */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black sm:text-xl">
            Daftar Pesanan
          </h2>
          <p className="mt-1 text-xs text-[#8B9A88]">
            {filteredOrders.length} pesanan ditemukan
          </p>
        </div>
      </div>

      {/* LOADING */}
      {!loaded ? (
        <div className="rounded-[25px] bg-[#EDF2E7] p-10 text-center text-sm text-[#829481]">
          Memuat pesanan...
        </div>
      ) : filteredOrders.length === 0 ? (
        /* EMPTY STATE */
        <div className="flex min-h-[340px] flex-col items-center justify-center rounded-[27px] border border-dashed border-[#D7E4D0] bg-[#F0F3E9] p-6 text-center">
          <span className="flex h-18 w-18 items-center justify-center rounded-[22px] bg-[#E2ECDD] p-4 text-[#348443]">
            <ShoppingBag size={34} />
          </span>

          <h3 className="mt-5 text-lg font-black">
            {orders.length === 0
              ? "Belum Ada Pesanan"
              : "Pesanan Tidak Ditemukan"}
          </h3>

          <p className="mt-2 max-w-[340px] text-xs leading-6 text-[#81937E]">
            {orders.length === 0
              ? "Mulai jelajahi Marketplace dan lakukan pemesanan surplus panen untuk melihat transaksi di sini."
              : "Coba gunakan kata kunci atau status pesanan yang berbeda."}
          </p>

          {orders.length === 0 ? (
            <Link
              href="/processor/marketplace"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#245C43] px-5 py-3 text-xs font-extrabold text-white"
            >
              Jelajahi Marketplace
              <ArrowRight size={16} />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("Semua");
              }}
              className="mt-6 rounded-xl bg-[#245C43] px-5 py-3 text-xs font-extrabold text-white"
            >
              Reset Pencarian
            </button>
          )}
        </div>
      ) : (
        /* ORDER LIST */
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <article
              key={order.id}
              className="min-w-0 overflow-hidden rounded-[25px] border border-white bg-[#F8F6ED] p-4 shadow-[5px_5px_15px_#e4e2d7,-5px_-5px_15px_#ffffff] sm:p-6"
            >
              {/* ORDER TOP */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] text-[#829481]">
                    Nomor Pesanan
                  </p>

                  <h3 className="mt-1 break-all text-sm font-black">
                    {order.id}
                  </h3>

                  <p className="mt-1 text-[11px] text-[#8B9A88]">
                    {formatOrderDate(order.createdAt)}
                  </p>
                </div>

                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-bold ${statusStyle(order.status)}`}
                >
                  <StatusIcon status={order.status} />
                  {order.status}
                </span>
              </div>

              <div className="my-4 h-px bg-[#E5EADD]" />

              {/* PRODUCT */}
              <div className="flex min-w-0 gap-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[17px] bg-[#E7ECDD] sm:h-28 sm:w-28">
                  <Image
                    src={order.productImage}
                    alt={order.productName}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-black sm:text-base">
                    {order.productName}
                  </h4>

                  <p className="mt-2 text-xs text-[#829481]">
                    {order.farmer}
                  </p>

                  <p className="mt-1 flex items-center gap-1 text-xs text-[#829481]">
                    <MapPin size={13} />
                    {order.location}
                  </p>

                  <p className="mt-2 text-xs font-bold text-[#39844E]">
                    {order.quantity} kg ×{" "}
                    {formatRupiah(order.pricePerKg)}
                  </p>
                </div>
              </div>

              {/* ORDER BOTTOM */}
              <div className="mt-5 flex flex-wrap items-end justify-between gap-4 rounded-2xl bg-[#EDF2E7] p-4">
                <div>
                  <p className="text-[11px] text-[#829481]">
                    Total Sementara
                  </p>

                  <p className="mt-1 text-xl font-black text-[#087338]">
                    {formatRupiah(order.total)}
                  </p>

                  <p className="mt-1 text-[10px] text-[#829481]">
                    Belum termasuk ongkos kirim
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {order.status === "Menunggu Konfirmasi" && (
                    <button
                      type="button"
                      onClick={() => setCancelTarget(order.id)}
                      className="rounded-xl border border-[#E7C8C3] bg-white px-4 py-3 text-[11px] font-bold text-[#A14E45]"
                    >
                      Batalkan
                    </button>
                  )}

                  <Link
                    href={`/processor/orders/${order.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#245C43] px-4 py-3 text-[11px] font-extrabold text-white"
                  >
                    Lihat Detail
                    <ChevronRight size={15} />
                  </Link>
                </div>
              </div>

              {/* DEMO STATUS CONTROL */}
              {order.status !== "Selesai" &&
                order.status !== "Dibatalkan" && (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-[#D7E4D0] px-3 py-3">
                    <p className="text-[11px] text-[#829481]">
                      Kontrol pengujian status (demo)
                    </p>

                    <button
                      type="button"
                      onClick={() => simulateNextStatus(order)}
                      className="inline-flex items-center gap-2 text-[11px] font-extrabold text-[#39844E]"
                    >
                      Lanjutkan Status
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}
            </article>
          ))}
        </div>
      )}

      {/* FOOTER */}
      <div className="flex items-start gap-3 rounded-2xl border border-[#DFE8D6] bg-[#EDF2E6] p-4">
        <ClipboardList
          size={20}
          className="mt-0.5 shrink-0 text-[#39844E]"
        />

        <p className="text-xs leading-6 text-[#718671]">
          <strong className="text-[#245C43]">
            Mode simulasi SAVORA.
          </strong>{" "}
          Data pesanan tersimpan di browser ini. Tombol
          lanjutkan status hanya digunakan untuk menguji
          alur pesanan dan tidak mengubah status pengiriman nyata.
        </p>
      </div>

      {/* CANCEL MODAL */}
      {cancelTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#153C29]/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-order-title"
            className="w-full max-w-md rounded-[27px] bg-[#F8F6ED] p-6 shadow-2xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F9E7E4] text-[#A14E45]">
              <XCircle size={28} />
            </div>

            <h2
              id="cancel-order-title"
              className="mt-5 text-xl font-black"
            >
              Batalkan Pesanan?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#829481]">
              Pesanan simulasi akan berubah menjadi status
              Dibatalkan dan tetap tersimpan sebagai riwayat.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="rounded-xl border border-[#D7E4D0] bg-white px-4 py-3 text-sm font-bold"
              >
                Kembali
              </button>

              <button
                type="button"
                onClick={cancelOrder}
                className="rounded-xl bg-[#A14E45] px-4 py-3 text-sm font-bold text-white"
              >
                Ya, Batalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
