
"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  ShoppingBag,
} from "lucide-react";

import {
  getProcessorOrders,
  type ProcessorOrder,
} from "@/lib/data/processor-orders";
import { formatRupiah } from "@/lib/data/processor-products";

export default function ProcessorOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<ProcessorOrder | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const found = getProcessorOrders().find(
      (item) => item.id === id
    );

    setOrder(found ?? null);
    setLoaded(true);
  }, [id]);

  if (!loaded) {
    return (
      <div className="p-8 text-center text-[#245C43]">
        Memuat pesanan...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center text-[#245C43]">
        <Package size={52} className="mx-auto text-[#7F9D7E]" />
        <h1 className="mt-5 text-2xl font-black">
          Pesanan Tidak Ditemukan
        </h1>
        <p className="mt-3 text-sm text-[#829481]">
          Pesanan simulasi hanya tersimpan di browser tempat
          pesanan dibuat.
        </p>
        <Link
          href="/processor/marketplace"
          className="mt-6 inline-flex rounded-xl bg-[#245C43] px-5 py-3 text-sm font-bold text-white"
        >
          Kembali ke Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 text-[#245C43]">
      <Link
        href="/processor/orders"
        className="inline-flex items-center gap-2 text-xs font-bold text-[#39844E]"
      >
        <ArrowLeft size={16} />
        Semua Pesanan
      </Link>

      <div className="rounded-[28px] bg-[#245C43] p-6 text-white sm:p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
          <CheckCircle2 size={29} />
        </div>

        <h1 className="mt-5 text-2xl font-black">
          Pesanan Simulasi Berhasil Dibuat!
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#DCEBDD]">
          Pesanan tersimpan di browser. Belum ada transaksi,
          pembayaran, atau konfirmasi petani yang sebenarnya.
        </p>
      </div>

      <section className="rounded-[26px] border border-white bg-[#F8F6ED] p-5 shadow-[5px_5px_15px_#e4e2d7,-5px_-5px_15px_#ffffff] sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs text-[#829481]">
              Nomor Pesanan
            </p>
            <h2 className="mt-1 break-all text-lg font-black">
              {order.id}
            </h2>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF0C6] px-4 py-2 text-xs font-bold text-[#936C21]">
            <Clock3 size={15} />
            {order.status}
          </span>
        </div>

        <div className="my-6 h-px bg-[#E3E9DC]" />

        <div className="flex gap-4">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#E7ECDD]">
            <Image
              src={order.productImage}
              alt={order.productName}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-black">
              {order.productName}
            </h3>

            <p className="mt-2 text-xs text-[#829481]">
              {order.farmer}
            </p>

            <p className="mt-1 flex items-center gap-1 text-xs text-[#829481]">
              <MapPin size={13} />
              {order.location}
            </p>

            <p className="mt-2 text-sm font-extrabold text-[#087338]">
              {order.quantity} kg × {formatRupiah(order.pricePerKg)}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3 rounded-2xl bg-[#EDF2E7] p-5 text-sm">
          <div className="flex justify-between gap-3">
            <span>Subtotal</span>
            <strong>{formatRupiah(order.subtotal)}</strong>
          </div>

          <div className="flex justify-between gap-3">
            <span>Pengiriman</span>
            <strong>Belum dihitung</strong>
          </div>

          <div className="flex justify-between gap-3">
            <span>Metode Pembayaran</span>
            <strong>{order.paymentMethod}</strong>
          </div>

          <div className="border-t border-[#D5E3CD] pt-4">
            <div className="flex justify-between gap-3">
              <strong>Total Sementara</strong>
              <strong className="text-lg text-[#087338]">
                {formatRupiah(order.total)}
              </strong>
            </div>
          </div>
        </div>

        {order.notes && (
          <div className="mt-5 rounded-2xl border border-[#E1E9D8] p-4">
            <p className="text-xs font-bold">Catatan Pembeli</p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-[#829481]">
              {order.notes}
            </p>
          </div>
        )}
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/processor/orders"
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#245C43] px-5 py-4 text-sm font-bold text-white"
        >
          <Package size={18} />
          Lihat Semua Pesanan
        </Link>

        <Link
          href="/processor/marketplace"
          className="flex items-center justify-center gap-2 rounded-2xl border border-[#D7E4D0] bg-white px-5 py-4 text-sm font-bold"
        >
          <ShoppingBag size={18} />
          Belanja Lagi
        </Link>
      </div>
    </div>
  );
}
