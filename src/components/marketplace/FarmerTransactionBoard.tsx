
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowDownToLine,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Eye,
  FileText,
  Leaf,
  Package,
  Search,
  Scale,
  ShoppingBag,
  Truck,
  Wallet,
  X,
} from "lucide-react";

export type FarmerTransaction = {
  id: string;
  transaction_code: string;
  processor_name: string;
  commodity_name: string;
  quantity_kg: number;
  price_per_kg: number;
  total_amount: number;
  transaction_status: string;
  payment_status: string;
  payment_method: string | null;
  paid_at: string | null;
  notes: string | null;
  is_sample: boolean;
  created_at: string;
};

type Props = {
  transactions: FarmerTransaction[];
};

const images: Record<string, string> = {
  tomat: "/images/farmer/tomato.webp",
  kangkung: "/images/farmer/kangkung.webp",
  pisang: "/images/farmer/banana.webp",
  wortel: "/images/farmer/wortel.webp",
  kol: "/images/farmer/kol.webp",
  terong: "/images/farmer/terong.webp",
  jagung: "/images/farmer/jagung.webp",
  cabai: "/images/farmer/cabai.webp",
  kentang: "/images/farmer/kentang.webp",
  pakcoy: "/images/farmer/pakcoy.webp",
};

function getImage(name: string) {
  const key = name.toLowerCase();

  for (const [commodity, path] of Object.entries(images)) {
    if (key.includes(commodity)) {
      return `${path}?v=savora-reject-2026`;
    }
  }

  return "/images/farmer/vegetable-crate.webp";
}

function rupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function dateLabel(value: string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
}

const transactionLabels: Record<string, string> = {
  pending: "Menunggu Konfirmasi",
  confirmed: "Dikonfirmasi",
  in_delivery: "Dalam Pengiriman",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const paymentLabels: Record<string, string> = {
  unpaid: "Belum Dibayar",
  processing: "Diproses",
  paid: "Sudah Dibayar",
  refunded: "Dikembalikan",
};

function transactionTone(status: string) {
  switch (status) {
    case "completed":
      return "bg-[#DBF1D2] text-[#27783A]";
    case "confirmed":
      return "bg-[#E5E1FA] text-[#6553A4]";
    case "in_delivery":
      return "bg-[#DDEEFF] text-[#286A9A]";
    case "cancelled":
      return "bg-[#F9E0DB] text-[#A45149]";
    default:
      return "bg-[#FFF0C3] text-[#8B680D]";
  }
}

function paymentTone(status: string) {
  switch (status) {
    case "paid":
      return "bg-[#DDF2D8] text-[#287D3D]";
    case "processing":
      return "bg-[#FFF0C3] text-[#8B680D]";
    case "refunded":
      return "bg-[#E9E2FA] text-[#6651A0]";
    default:
      return "bg-[#F1E6DB] text-[#946342]";
  }
}

export default function FarmerTransactionBoard({
  transactions,
}: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [payment, setPayment] = useState("all");
  const [selected, setSelected] =
    useState<FarmerTransaction | null>(null);

  const totalTransactions = transactions.length;

  const totalValue = transactions
    .filter((item) => item.transaction_status !== "cancelled")
    .reduce((sum, item) => sum + Number(item.total_amount), 0);

  const paidValue = transactions
    .filter(
      (item) =>
        item.payment_status === "paid" &&
        item.transaction_status !== "cancelled"
    )
    .reduce((sum, item) => sum + Number(item.total_amount), 0);

  const unpaidCount = transactions.filter(
    (item) =>
      item.payment_status !== "paid" &&
      item.transaction_status !== "cancelled"
  ).length;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactions
      .filter((item) => {
        const matchesSearch =
          !query ||
          [
            item.transaction_code,
            item.processor_name,
            item.commodity_name,
          ].some((value) => value.toLowerCase().includes(query));

        return (
          matchesSearch &&
          (status === "all" ||
            item.transaction_status === status) &&
          (payment === "all" ||
            item.payment_status === payment)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      );
  }, [transactions, search, status, payment]);

  const hasSample = transactions.some((item) => item.is_sample);

  const selectClass =
    "w-full appearance-none rounded-full border border-white bg-[#F8F6ED] px-5 py-3.5 pr-10 text-sm font-semibold text-[#245C43] outline-none shadow-[4px_5px_12px_#dedbcf,-4px_-4px_12px_#ffffff] focus:ring-2 focus:ring-[#8FC781]";

  function exportCSV() {
    const columns = [
      "Kode",
      "Tanggal",
      "Pembeli",
      "Komoditas",
      "Berat (kg)",
      "Harga per kg",
      "Total",
      "Status Transaksi",
      "Status Pembayaran",
      "Data Contoh",
    ];

    const rows = filtered.map((item) => [
      item.transaction_code,
      dateLabel(item.created_at),
      item.processor_name,
      item.commodity_name,
      item.quantity_kg,
      item.price_per_kg,
      item.total_amount,
      transactionLabels[item.transaction_status] ??
        item.transaction_status,
      paymentLabels[item.payment_status] ??
        item.payment_status,
      item.is_sample ? "Ya" : "Tidak",
    ]);

    const escapeCSV = (value: unknown) => {
      const text = String(value ?? "");
      const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
      return `"${safe.replace(/"/g, '""')}"`;
    };

    const csv = [columns, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "savora-transaksi-petani.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-6 pb-8 text-[#164A32]">
      {/* HERO */}
      <section className="relative isolate overflow-hidden rounded-[30px] border border-white bg-gradient-to-r from-[#E8F2DD] via-[#F8F6ED] to-[#FFF0BD] shadow-[7px_7px_18px_#e1ddd0,-7px_-7px_18px_#ffffff]">
        <Image
          src="/images/farmer/farm-landscape.webp"
          alt=""
          width={950}
          height={400}
          className="pointer-events-none absolute bottom-0 right-0 -z-10 w-[85%] max-w-[900px] opacity-35"
        />

        <div className="relative grid gap-5 p-6 sm:p-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-xs font-extrabold text-[#408A3D]">
              <Wallet size={16} />
              KEUANGAN PETANI
            </span>

            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Transaksi Panen
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-7 text-[#5D705D] sm:text-base">
              Pantau penjualan surplus panen reject, nilai
              pesanan, serta perkembangan pembayaran dari
              mitra pengolah organik SAVORA.
            </p>
          </div>

          <div className="pointer-events-none hidden items-center justify-center lg:flex">
            <div className="relative flex h-44 w-44 items-center justify-center rounded-[42px] border border-white/70 bg-white/45 shadow-[7px_7px_18px_#cbd5be,-7px_-7px_18px_#ffffff]">
              <CircleDollarSign
                size={100}
                strokeWidth={1.3}
                className="text-[#2D884D]"
              />
              <div className="absolute -bottom-3 -right-3 rounded-2xl bg-[#F5C842] p-3 shadow-lg">
                <Leaf size={28} className="text-[#245C43]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {hasSample && (
        <div className="rounded-2xl border border-[#E9D48D] bg-[#FFF5D8] px-4 py-3 text-xs font-semibold leading-5 text-[#80651D]">
          Halaman ini memuat transaksi contoh. Status pembayaran
          pada data contoh bukan bukti uang telah diterima.
        </div>
      )}

      {/* STATISTIK */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
        {[
          {
            label: "Total Transaksi",
            value: totalTransactions.toLocaleString("id-ID"),
            icon: ShoppingBag,
            tone: "bg-[#E5F2D5] text-[#4C9638]",
          },
          {
            label: "Nilai Pesanan",
            value: rupiah(totalValue),
            icon: FileText,
            tone: "bg-[#FFF0C0] text-[#B78B10]",
          },
          {
            label: "Tercatat Dibayar",
            value: rupiah(paidValue),
            icon: CheckCircle2,
            tone: "bg-[#DDF0DD] text-[#2F9856]",
          },
          {
            label: "Belum Lunas",
            value: unpaidCount.toLocaleString("id-ID"),
            icon: Clock3,
            tone: "bg-[#E8EAFB] text-[#6E71BC]",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="min-w-0 rounded-[24px] border border-white bg-[#F8F6ED] p-4 shadow-[5px_5px_13px_#e1ddd0,-5px_-5px_13px_#ffffff] sm:p-5"
            >
              <div className={`mb-3 inline-flex rounded-2xl p-3 ${item.tone}`}>
                <Icon size={23} />
              </div>

              <p className="break-words text-lg font-black sm:text-2xl">
                {item.value}
              </p>

              <p className="mt-1 text-xs text-[#758374]">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* FILTER */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_auto]">
        <div className="relative">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#648065]"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari kode, pembeli, atau komoditas..."
            aria-label="Cari transaksi"
            className="w-full rounded-full border border-white bg-[#F8F6ED] py-3.5 pl-12 pr-5 text-sm outline-none shadow-[4px_5px_12px_#dedbcf,-4px_-4px_12px_#ffffff] focus:ring-2 focus:ring-[#80BC72]"
          />
        </div>

        <div className="relative">
          <select
            aria-label="Filter status transaksi"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className={selectClass}
          >
            <option value="all">Semua Transaksi</option>
            {Object.entries(transactionLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={17}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
          />
        </div>

        <div className="relative">
          <select
            aria-label="Filter pembayaran"
            value={payment}
            onChange={(event) => setPayment(event.target.value)}
            className={selectClass}
          >
            <option value="all">Semua Pembayaran</option>
            {Object.entries(paymentLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={17}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
          />
        </div>

        <button
          type="button"
          onClick={exportCSV}
          disabled={filtered.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#42B66A] to-[#087338] px-5 py-3.5 text-sm font-extrabold text-white shadow-[4px_6px_12px_#b8c9a9] disabled:opacity-50"
        >
          <ArrowDownToLine size={18} />
          Ekspor CSV
        </button>
      </div>

      {/* LIST */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-black sm:text-2xl">
            Riwayat Transaksi
          </h2>
          <p className="mt-1 text-sm text-[#758374]">
            {filtered.length} transaksi ditemukan
          </p>
        </div>

        <span className="rounded-full bg-[#E5EEDB] px-4 py-2 text-xs font-bold text-[#3F8241]">
          <Leaf size={14} className="mr-1 inline" />
          From Surplus to Value
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[28px] border border-white bg-[#F8F6ED] px-6 py-14 text-center shadow-[6px_6px_16px_#e1ddd0,-6px_-6px_16px_#ffffff]">
          <ShoppingBag
            size={46}
            className="mx-auto text-[#5B9B3E]"
          />
          <h3 className="mt-4 text-xl font-black">
            Transaksi Tidak Ditemukan
          </h3>
          <p className="mt-2 text-sm text-[#7A8978]">
            Belum ada transaksi yang cocok dengan filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatus("all");
              setPayment("all");
            }}
            className="mt-5 rounded-full bg-[#087338] px-5 py-3 text-sm font-bold text-white"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="min-w-0 rounded-[26px] border border-white bg-[#F8F6ED] p-4 shadow-[5px_6px_15px_#e0dccf,-5px_-5px_15px_#ffffff] sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-[#7C907B]">
                    {item.transaction_code}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-[#7C907B]">
                    <CalendarDays size={13} />
                    {dateLabel(item.created_at)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {item.is_sample && (
                    <span className="rounded-full bg-[#FFF0C3] px-2.5 py-1.5 text-[10px] font-extrabold text-[#8B680D]">
                      CONTOH
                    </span>
                  )}
                  <span className={`rounded-full px-2.5 py-1.5 text-[10px] font-extrabold ${transactionTone(item.transaction_status)}`}>
                    {transactionLabels[item.transaction_status] ??
                      item.transaction_status}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex gap-4">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[20px] bg-[#EAF1DF] sm:h-32 sm:w-32">
                  <Image
                    src={getImage(item.commodity_name)}
                    alt={item.commodity_name}
                    width={130}
                    height={130}
                    unoptimized
                    className="h-full w-full object-contain p-2"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-sm font-black sm:text-base">
                    {item.commodity_name}
                  </h3>

                  <p className="mt-2 flex items-center gap-2 text-xs text-[#70816F]">
                    <Scale size={15} />
                    {Number(item.quantity_kg).toLocaleString("id-ID")} kg
                    <span>×</span>
                    {rupiah(item.price_per_kg)}
                  </p>

                  <p className="mt-2 text-xs text-[#70816F]">
                    Mitra Pengolah
                  </p>
                  <p className="line-clamp-1 text-sm font-bold">
                    {item.processor_name}
                  </p>

                  <p className="mt-3 text-lg font-black text-[#087338]">
                    {rupiah(item.total_amount)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[18px] bg-[#F0F1E8] p-3">
                <div>
                  <p className="text-[10px] text-[#84917E]">
                    Status Pembayaran
                  </p>
                  <span className={`mt-1 inline-flex rounded-full px-3 py-1.5 text-[11px] font-extrabold ${paymentTone(item.payment_status)}`}>
                    {paymentLabels[item.payment_status] ??
                      item.payment_status}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelected(item)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#087338] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#065B2D]"
                >
                  <Eye size={15} />
                  Detail
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* MODAL DETAIL */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#092A1B]/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelected(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Detail transaksi"
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[30px] border border-white bg-[#F8F6ED] p-5 shadow-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-[#6F8B6D]">
                  DETAIL TRANSAKSI
                </p>
                <h2 className="mt-1 text-xl font-black">
                  {selected.transaction_code}
                </h2>
              </div>

              <button
                type="button"
                aria-label="Tutup detail"
                onClick={() => setSelected(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8EDE2]"
              >
                <X size={20} />
              </button>
            </div>

            {selected.is_sample && (
              <p className="mt-4 rounded-xl bg-[#FFF0C3] p-3 text-xs font-semibold text-[#80651D]">
                Ini transaksi simulasi. Tidak ada pembayaran
                sungguhan yang diverifikasi.
              </p>
            )}

            <div className="mt-5 flex items-center gap-4 rounded-[22px] bg-[#EDF2E5] p-4">
              <Image
                src={getImage(selected.commodity_name)}
                alt={selected.commodity_name}
                width={90}
                height={90}
                unoptimized
                className="h-20 w-20 object-contain"
              />

              <div className="min-w-0">
                <h3 className="font-black">
                  {selected.commodity_name}
                </h3>
                <p className="mt-1 text-sm text-[#70816F]">
                  {selected.processor_name}
                </p>
                <p className="mt-2 text-lg font-black text-[#087338]">
                  {rupiah(selected.total_amount)}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4 text-sm">
              {[
                ["Tanggal Pesanan", dateLabel(selected.created_at)],
                ["Mitra Pengolah", selected.processor_name],
                [
                  "Berat Surplus",
                  `${Number(selected.quantity_kg).toLocaleString("id-ID")} kg`,
                ],
                ["Harga per kg", rupiah(selected.price_per_kg)],
                ["Total Transaksi", rupiah(selected.total_amount)],
                [
                  "Status Pesanan",
                  transactionLabels[selected.transaction_status] ??
                    selected.transaction_status,
                ],
                [
                  "Status Pembayaran",
                  paymentLabels[selected.payment_status] ??
                    selected.payment_status,
                ],
                [
                  "Metode Pembayaran",
                  selected.payment_method ?? "Belum ditentukan",
                ],
                ["Tanggal Dibayar", dateLabel(selected.paid_at)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-4 border-b border-[#E4E7DB] pb-3"
                >
                  <span className="text-[#70816F]">{label}</span>
                  <span className="max-w-[60%] text-right font-bold">
                    {value}
                  </span>
                </div>
              ))}

              {selected.notes && (
                <div className="rounded-[18px] bg-[#EDF1E6] p-4">
                  <p className="font-bold">Catatan</p>
                  <p className="mt-1 leading-6 text-[#70816F]">
                    {selected.notes}
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-6 w-full rounded-full bg-gradient-to-b from-[#40B667] to-[#087338] py-3.5 font-extrabold text-white"
            >
              Tutup Detail
            </button>
          </div>
        </div>
      )}

      <p className="flex items-center justify-center gap-2 pt-2 text-center text-xs text-[#879582]">
        <Leaf size={15} />
        Riwayat transaksi SAVORA milik akun petani yang masuk.
      </p>
    </div>
  );
}
