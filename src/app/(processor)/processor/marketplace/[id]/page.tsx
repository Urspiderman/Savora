
"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardList,
  Info,
  Leaf,
  MapPin,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sprout,
  Truck,
  UserRound,
  Wallet,
} from "lucide-react";

import {
  getProcessorProduct,
  formatRupiah,
} from "@/lib/data/processor-products";

import {
  saveProcessorOrder,
  type ProcessorOrder,
} from "@/lib/data/processor-orders";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function ProcessorProductDetailPage({
  params,
}: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const product = getProcessorProduct(id);

  const [quantity, setQuantity] = useState(
    product?.minimumOrder ?? 5
  );
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Transfer Bank");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!product) {
    return (
      <div className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center justify-center px-4 text-center text-[#245C43]">
        <Package size={56} className="text-[#83A486]" />
        <h1 className="mt-5 text-2xl font-black">
          Produk Tidak Ditemukan
        </h1>
        <p className="mt-3 text-sm text-[#829481]">
          Produk yang kamu cari tidak tersedia dalam data simulasi.
        </p>
        <Link
          href="/processor/marketplace"
          className="mt-6 rounded-xl bg-[#245C43] px-5 py-3 text-sm font-bold text-white"
        >
          Kembali ke Marketplace
        </Link>
      </div>
    );
  }

  const subtotal = product.price * quantity;
  const shippingCost = 0;
  const total = subtotal + shippingCost;

  function changeQuantity(value: number) {
    setQuantity(
      Math.min(
        product!.stock,
        Math.max(product!.minimumOrder, value)
      )
    );
  }

  function handleOrder() {
    setError("");

    if (
      !Number.isFinite(quantity) ||
      !Number.isInteger(quantity) ||
      quantity < product!.minimumOrder ||
      quantity > product!.stock
    ) {
      setError("Jumlah pembelian tidak sesuai batas pemesanan.");
      return;
    }

    setShowConfirmation(true);
  }

  function confirmOrder() {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    const order: ProcessorOrder = {
      id: `SVR-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)
        .toUpperCase()}`,
      productId: product!.id,
      productName: product!.name,
      productImage: product!.image,
      farmer: product!.farmer,
      location: product!.location,
      quantity,
      pricePerKg: product!.price,
      subtotal,
      shippingCost,
      total,
      status: "Menunggu Konfirmasi",
      paymentMethod,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      saveProcessorOrder(order);
      setShowConfirmation(false);
      router.push(`/processor/orders/${order.id}`);
    } catch {
      setError(
        "Pesanan gagal disimpan. Periksa penyimpanan browser dan coba lagi."
      );
      setShowConfirmation(false);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] min-w-0 space-y-6 pb-5 text-[#245C43]">
      {/* BREADCRUMB */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-[#829481]">
        <Link
          href="/processor/marketplace"
          className="flex items-center gap-1 font-bold text-[#39844E] hover:underline"
        >
          <ArrowLeft size={15} />
          Marketplace
        </Link>
        <ChevronRight size={14} />
        <span className="truncate">{product.name}</span>
      </div>

      {/* PAGE HEADING */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#7F977A]">
          <Leaf size={15} />
          Detail Surplus Panen
        </div>

        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
          {product.name}
        </h1>

        <p className="mt-2 text-sm text-[#839582]">
          Informasi bahan baku dan simulasi pemesanan.
        </p>
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
        {/* LEFT CONTENT */}
        <div className="min-w-0 space-y-6">
          {/* PRODUCT IMAGE */}
          <div className="overflow-hidden rounded-[28px] border border-white bg-[#F8F6ED] p-3 shadow-[6px_6px_18px_#e4e2d7,-6px_-6px_18px_#ffffff]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-[#E7ECDD] sm:aspect-[16/10]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />

              <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-[#F8F6ED]/95 px-4 py-2 text-xs font-extrabold text-[#245C43]">
                <BadgeCheck size={15} />
                {product.grade}
              </span>
            </div>
          </div>

          {/* PRODUCT INFORMATION */}
          <section className="rounded-[26px] border border-white bg-[#F8F6ED] p-5 shadow-[5px_5px_15px_#e4e2d7,-5px_-5px_15px_#ffffff] sm:p-6">
            <h2 className="text-lg font-black">
              Informasi Produk
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#738771]">
              {product.description}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                {
                  label: "Kategori",
                  value: product.category,
                  icon: Sprout,
                },
                {
                  label: "Kondisi",
                  value: product.condition,
                  icon: ShieldCheck,
                },
                {
                  label: "Tanggal Panen",
                  value: product.harvestDate,
                  icon: CalendarDays,
                },
                {
                  label: "Stok Tersedia",
                  value: `${product.stock} kg`,
                  icon: Package,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="min-w-0 rounded-2xl bg-[#EDF2E7] p-4"
                  >
                    <Icon
                      size={20}
                      className="text-[#39844E]"
                    />

                    <p className="mt-3 text-[11px] text-[#849582]">
                      {item.label}
                    </p>

                    <p className="mt-1 break-words text-xs font-extrabold leading-5 sm:text-sm">
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* USAGE */}
          <section className="rounded-[26px] border border-white bg-[#F8F6ED] p-5 shadow-[5px_5px_15px_#e4e2d7,-5px_-5px_15px_#ffffff] sm:p-6">
            <h2 className="text-lg font-black">
              Potensi Pemanfaatan
            </h2>

            <p className="mt-2 text-xs leading-6 text-[#849582]">
              Contoh penggunaan bahan baku setelah melalui
              pemeriksaan kualitas yang sesuai.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {product.usage.map((usage) => (
                <span
                  key={usage}
                  className="inline-flex items-center gap-2 rounded-full border border-[#D7E6CF] bg-[#E9F2E2] px-4 py-2 text-xs font-bold text-[#39844E]"
                >
                  <Check size={14} />
                  {usage}
                </span>
              ))}
            </div>
          </section>

          {/* FARMER INFORMATION */}
          <section className="rounded-[26px] border border-white bg-[#F8F6ED] p-5 shadow-[5px_5px_15px_#e4e2d7,-5px_-5px_15px_#ffffff] sm:p-6">
            <h2 className="text-lg font-black">
              Informasi Petani
            </h2>

            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#DDEBDD] text-[#245C43]">
                <UserRound size={28} />
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-base font-black">
                  {product.farmer}
                </h3>

                <p className="mt-1 flex items-center gap-1.5 text-xs text-[#849582]">
                  <MapPin size={14} />
                  {product.location}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-[#EDF2E7] p-4">
              <p className="flex items-start gap-2 text-xs leading-6 text-[#6F866F]">
                <Info size={17} className="mt-1 shrink-0" />
                Informasi petani merupakan data simulasi.
                Kontak langsung belum tersedia pada tahap ini.
              </p>
            </div>
          </section>
        </div>

        {/* RIGHT: ORDER CARD */}
        <div className="min-w-0">
          <div className="space-y-5 rounded-[28px] border border-white bg-[#F8F6ED] p-5 shadow-[7px_7px_20px_#e4e2d7,-7px_-7px_20px_#ffffff] sm:p-6 lg:sticky lg:top-6">
            <div>
              <p className="text-xs font-bold text-[#829481]">
                Harga Surplus
              </p>

              <div className="mt-2 flex flex-wrap items-baseline gap-2">
                <span className="text-3xl font-black text-[#087338] sm:text-4xl">
                  {formatRupiah(product.price)}
                </span>
                <span className="text-sm text-[#849582]">
                  / kg
                </span>
              </div>

              <p className="mt-2 flex items-center gap-2 text-xs font-bold text-[#39844E]">
                <Package size={15} />
                Stok {product.stock} kg tersedia (demo)
              </p>
            </div>

            <div className="h-px bg-[#E3E9DC]" />

            {/* QUANTITY */}
            <div>
              <label className="text-sm font-extrabold">
                Jumlah Pembelian
              </label>

              <p className="mt-1 text-xs text-[#849582]">
                Minimal {product.minimumOrder} kg
              </p>

              <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#DCE6D5] bg-white p-2">
                <button
                  type="button"
                  onClick={() => changeQuantity(quantity - 1)}
                  disabled={quantity <= product.minimumOrder}
                  aria-label="Kurangi jumlah"
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF2E4] text-[#245C43] disabled:opacity-40"
                >
                  <Minus size={19} />
                </button>

                <div className="text-center">
                  <p className="text-xl font-black">
                    {quantity}
                    <span className="ml-1 text-sm font-medium">
                      kg
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => changeQuantity(quantity + 1)}
                  disabled={quantity >= product.stock}
                  aria-label="Tambah jumlah"
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#245C43] text-white disabled:opacity-40"
                >
                  <Plus size={19} />
                </button>
              </div>
            </div>

            {/* NOTES */}
            <div>
              <label
                htmlFor="order-notes"
                className="text-sm font-extrabold"
              >
                Catatan Pesanan
              </label>

              <textarea
                id="order-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Contoh: Mohon dikemas per 10 kg..."
                className="mt-3 w-full resize-none rounded-2xl border border-[#DCE6D5] bg-white p-4 text-sm outline-none placeholder:text-[#A1AEA0] focus:border-[#5DA66C]"
              />
            </div>

            {/* PAYMENT */}
            <div>
              <label
                htmlFor="payment-method"
                className="text-sm font-extrabold"
              >
                Metode Pembayaran
              </label>

              <div className="relative mt-3">
                <Wallet
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7C9279]"
                />

                <select
                  id="payment-method"
                  value={paymentMethod}
                  onChange={(event) =>
                    setPaymentMethod(event.target.value)
                  }
                  className="h-12 w-full appearance-none rounded-2xl border border-[#DCE6D5] bg-white pl-11 pr-10 text-sm font-semibold outline-none"
                >
                  <option value="Transfer Bank">
                    Transfer Bank (Simulasi)
                  </option>
                  <option value="COD">
                    Bayar di Tempat (Simulasi)
                  </option>
                </select>

                <ChevronRight
                  size={17}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-[#7C9279]"
                />
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <div className="rounded-[20px] bg-[#EDF2E7] p-4">
              <h3 className="flex items-center gap-2 text-sm font-black">
                <ClipboardList size={18} />
                Ringkasan Pembelian
              </h3>

              <div className="mt-4 space-y-3 text-xs">
                <div className="flex justify-between gap-3">
                  <span className="text-[#81917E]">
                    Harga per kg
                  </span>
                  <span className="font-bold">
                    {formatRupiah(product.price)}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-[#81917E]">
                    Jumlah
                  </span>
                  <span className="font-bold">
                    {quantity} kg
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-[#81917E]">
                    Subtotal
                  </span>
                  <span className="font-bold">
                    {formatRupiah(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-[#81917E]">
                    Ongkos kirim
                  </span>
                  <span className="font-bold">
                    Belum dihitung
                  </span>
                </div>
              </div>

              <div className="mt-4 border-t border-[#D4E2CC] pt-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-extrabold">
                    Total Sementara
                  </span>
                  <span className="text-xl font-black text-[#087338]">
                    {formatRupiah(total)}
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700"
              >
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleOrder}
              className="flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#245C43] px-5 py-4 text-sm font-extrabold text-white shadow-[0_5px_14px_rgba(36,92,67,0.2)] transition hover:bg-[#087338]"
            >
              <ShoppingBag size={19} />
              Buat Pesanan Simulasi
              <ArrowRight size={17} />
            </button>

            <p className="flex items-start gap-2 text-[11px] leading-5 text-[#879784]">
              <ShieldCheck size={16} className="shrink-0" />
              Ini hanya simulasi. Tidak ada pembayaran
              maupun penjemputan yang benar-benar dilakukan.
            </p>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {showConfirmation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#153C29]/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-order-title"
            className="w-full max-w-md rounded-[28px] bg-[#F8F6ED] p-6 shadow-2xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E1EEDB] text-[#245C43]">
              <ShoppingBag size={27} />
            </div>

            <h2
              id="confirm-order-title"
              className="mt-5 text-xl font-black"
            >
              Konfirmasi Pesanan
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#829481]">
              Pastikan jumlah pembelian sudah sesuai.
              Pesanan akan disimpan secara lokal di browser.
            </p>

            <div className="mt-5 space-y-3 rounded-2xl bg-[#EDF2E7] p-4 text-sm">
              <div className="flex justify-between gap-3">
                <span>Produk</span>
                <strong>{product.name}</strong>
              </div>

              <div className="flex justify-between gap-3">
                <span>Jumlah</span>
                <strong>{quantity} kg</strong>
              </div>

              <div className="flex justify-between gap-3">
                <span>Total sementara</span>
                <strong className="text-[#087338]">
                  {formatRupiah(total)}
                </strong>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                disabled={isSubmitting}
                className="rounded-xl border border-[#D7E4D0] bg-white px-4 py-3 text-sm font-bold"
              >
                Kembali
              </button>

              <button
                type="button"
                onClick={confirmOrder}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#245C43] px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
              >
                <Check size={17} />
                {isSubmitting ? "Menyimpan..." : "Konfirmasi"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start gap-3 rounded-2xl bg-[#EAF1E3] p-4 text-xs leading-6 text-[#6E856D]">
        <Truck size={19} className="mt-0.5 shrink-0 text-[#39844E]" />
        Pengiriman dan pembayaran belum terintegrasi.
        Total yang ditampilkan belum termasuk ongkos kirim.
      </div>
    </div>
  );
}
