
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
  ChevronDown,
  ClipboardList,
  Clock3,
  Leaf,
  MapPin,
  MoreHorizontal,
  PackageCheck,
  Plus,
  Search,
  Sprout,
  Trash2,
  TrendingUp,
  X,
  XCircle,
} from "lucide-react";

import {
  deleteProcessorRequirement,
  formatRequirementDate,
  getProcessorRequirements,
  updateRequirementStatus,
  type ProcessorRequirement,
  type RequirementStatus,
} from "@/lib/data/processor-requirements";

import { formatRupiah } from "@/lib/data/processor-products";

type Filter = "Semua" | RequirementStatus;

const FILTERS: Filter[] = [
  "Semua",
  "Aktif",
  "Terpenuhi",
  "Ditutup",
];

function getStatusStyle(status: RequirementStatus) {
  switch (status) {
    case "Aktif":
      return "bg-[#E1F0DD] text-[#328046]";
    case "Terpenuhi":
      return "bg-[#E6EDFA] text-[#4A6BA4]";
    case "Ditutup":
      return "bg-[#F0E8E3] text-[#8A6E60]";
  }
}

function RequirementCard({
  item,
  onStatusChange,
  onDelete,
}: {
  item: ProcessorRequirement;
  onStatusChange: (
    item: ProcessorRequirement,
    status: RequirementStatus
  ) => void;
  onDelete: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-[26px] border border-white/90 bg-[#F8F6ED] shadow-[6px_6px_18px_#e5e3d8,-6px_-6px_18px_#ffffff] transition-all duration-300 hover:-translate-y-1 hover:shadow-[9px_9px_22px_#e2e0d5,-6px_-6px_18px_#ffffff]">
      {/* CARD TOP */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#E7F0DF] via-[#F1F4E8] to-[#F8F6ED] px-5 pb-5 pt-5 sm:px-6">
        <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full border-[25px] border-white/35" />

        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="flex h-13 w-13 items-center justify-center rounded-[17px] border border-white/80 bg-white/70 p-3 text-[#245C43] shadow-sm">
            <Sprout size={26} />
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[10px] font-extrabold ${getStatusStyle(item.status)}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {item.status}
            </span>

            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Opsi kebutuhan"
                aria-expanded={menuOpen}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/80 bg-white/70 text-[#245C43] transition hover:bg-white"
              >
                <MoreHorizontal size={19} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-11 z-20 w-48 rounded-2xl border border-[#E1E9D8] bg-white p-2 shadow-xl">
                  {item.status === "Aktif" && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          onStatusChange(item, "Terpenuhi");
                          setMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-[#39844E] hover:bg-[#EDF4E9]"
                      >
                        <CheckCircle2 size={15} />
                        Tandai Terpenuhi
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onStatusChange(item, "Ditutup");
                          setMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-[#8A6E60] hover:bg-[#F5F0EC]"
                      >
                        <XCircle size={15} />
                        Tutup Kebutuhan
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onDelete(item.id);
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-[#A14E45] hover:bg-[#F9EDEB]"
                  >
                    <Trash2 size={15} />
                    Hapus Kebutuhan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-5">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#5A9364]">
            {item.category} / {item.purpose}
          </span>

          <h3 className="mt-2 min-h-[52px] text-lg font-black leading-snug tracking-tight text-[#245C43] sm:text-xl">
            {item.title}
          </h3>
        </div>
      </div>

      {/* CARD BODY */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4 sm:px-6">
        <p className="line-clamp-3 min-h-[60px] text-xs leading-5 text-[#81917E]">
          {item.description}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[17px] border border-[#E2EADB] bg-[#F0F4EA] p-3.5">
            <div className="flex items-center gap-1.5 text-[#7C947B]">
              <PackageCheck size={14} />
              <span className="text-[10px] font-bold">
                Target Bahan
              </span>
            </div>

            <p className="mt-2 text-xl font-black text-[#245C43]">
              {item.quantity}
              <span className="ml-1 text-xs font-semibold text-[#829481]">
                kg
              </span>
            </p>
          </div>

          <div className="rounded-[17px] border border-[#E2EADB] bg-[#F0F4EA] p-3.5">
            <div className="flex items-center gap-1.5 text-[#7C947B]">
              <TrendingUp size={14} />
              <span className="text-[10px] font-bold">
                Maks. Harga/kg
              </span>
            </div>

            <p className="mt-2 break-words text-lg font-black text-[#087338]">
              {formatRupiah(item.maxPrice)}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-3 text-xs text-[#81917E]">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#EDF2E7] text-[#39844E]">
              <MapPin size={15} />
            </span>
            <span className="min-w-0 truncate">
              {item.location}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#81917E]">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#EDF2E7] text-[#39844E]">
              <CalendarDays size={15} />
            </span>
            <span>
              Sebelum {formatRequirementDate(item.deadline)}
            </span>
          </div>
        </div>

        <div className="mt-auto pt-5">
          <div className="border-t border-[#E5EADD] pt-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] text-[#8A9A87]">
                  Estimasi anggaran
                </p>
                <p className="mt-1 text-base font-black text-[#245C43]">
                  {formatRupiah(
                    item.quantity * item.maxPrice
                  )}
                </p>
              </div>

              {item.status === "Aktif" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#E4F0DF] px-3 py-2 text-[10px] font-extrabold text-[#39844E]">
                  <Clock3 size={13} />
                  Menunggu Penawaran
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#EDF0EA] px-3 py-2 text-[10px] font-extrabold text-[#718770]">
                  <CheckCircle2 size={13} />
                  {item.status}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ProcessorRequirementsPage() {
  const [requirements, setRequirements] = useState<
    ProcessorRequirement[]
  >([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("Semua");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(
    null
  );
  const [notice, setNotice] = useState("");

  const loadRequirements = useCallback(() => {
    setRequirements(getProcessorRequirements());
    setLoaded(true);
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(loadRequirements, 0);

    window.addEventListener("storage", loadRequirements);
    window.addEventListener(
      "savora-requirements-updated",
      loadRequirements
    );

    return () => {
      window.clearTimeout(initial);
      window.removeEventListener("storage", loadRequirements);
      window.removeEventListener(
        "savora-requirements-updated",
        loadRequirements
      );
    };
  }, [loadRequirements]);

  const stats = useMemo(() => {
    const active = requirements.filter(
      (item) => item.status === "Aktif"
    );

    return {
      total: requirements.length,
      active: active.length,
      fulfilled: requirements.filter(
        (item) => item.status === "Terpenuhi"
      ).length,
      totalKg: active.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
    };
  }, [requirements]);

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return requirements
      .filter((item) => {
        const matchesSearch =
          item.title.toLowerCase().includes(keyword) ||
          item.category.toLowerCase().includes(keyword) ||
          item.location.toLowerCase().includes(keyword) ||
          item.purpose.toLowerCase().includes(keyword);

        return (
          matchesSearch &&
          (filter === "Semua" || item.status === filter)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
  }, [requirements, search, filter]);

  function changeStatus(
    item: ProcessorRequirement,
    status: RequirementStatus
  ) {
    if (item.status !== "Aktif") return;

    if (updateRequirementStatus(item.id, status)) {
      setNotice(`Status kebutuhan diubah menjadi ${status}.`);
      loadRequirements();
    }
  }

  function confirmDelete() {
    if (!deleteTarget) return;

    if (deleteProcessorRequirement(deleteTarget)) {
      setNotice("Kebutuhan berhasil dihapus.");
      loadRequirements();
    }

    setDeleteTarget(null);
  }

  const statsCards = [
    {
      label: "Total Kebutuhan",
      value: stats.total.toString(),
      icon: ClipboardList,
      color: "bg-[#E5F0DF] text-[#39844E]",
      subtitle: "Semua permintaan",
    },
    {
      label: "Kebutuhan Aktif",
      value: stats.active.toString(),
      icon: Clock3,
      color: "bg-[#FFF0C8] text-[#A47C27]",
      subtitle: "Sedang mencari bahan",
    },
    {
      label: "Terpenuhi",
      value: stats.fulfilled.toString(),
      icon: CheckCircle2,
      color: "bg-[#E4ECF8] text-[#4A6BA4]",
      subtitle: "Permintaan selesai",
    },
    {
      label: "Target Bahan Aktif",
      value: `${stats.totalKg} kg`,
      icon: Sprout,
      color: "bg-[#E6EBE5] text-[#426E55]",
      subtitle: "Total kebutuhan aktif",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1440px] min-w-0 space-y-7 pb-7 text-[#245C43] sm:space-y-8">
      {/* PAGE HEADER - SINGLE CREATE BUTTON */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="mb-2 flex items-center gap-2 text-xs font-bold text-[#81967C]">
            <Leaf size={15} />
            SAVORA / Pengolah / Kebutuhan
          </p>

          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            Kebutuhan Bahan Baku
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#849482]">
            Kelola permintaan bahan baku untuk kebutuhan
            produksi usahamu.
          </p>
        </div>

        <Link
          href="/processor/requirements/new"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#245C43] px-5 py-3 text-xs font-extrabold text-white shadow-[0_5px_14px_rgba(36,92,67,0.16)] transition hover:bg-[#087338]"
        >
          <Plus size={18} />
          Buat Kebutuhan
          <ArrowRight size={15} />
        </Link>
      </div>

      {/* PREMIUM HERO */}
      <section className="relative isolate overflow-hidden rounded-[30px] bg-[#245C43] shadow-[8px_10px_25px_rgba(29,84,56,0.13)]">
        <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border-[48px] border-white/[0.055]" />
        <div className="pointer-events-none absolute bottom-[-110px] right-24 h-60 w-60 rounded-full bg-[#5A9B67]/20 blur-3xl" />

        <div className="relative z-10 flex min-h-[220px] items-center px-6 py-8 sm:min-h-[245px] sm:px-10">
          <div className="max-w-[640px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-[#E9F3E0]">
              <Sprout
                size={14}
                className="text-[#F5C842]"
              />
              Smart Sourcing SAVORA
            </span>

            <h2 className="mt-5 text-[26px] font-black leading-[1.2] tracking-tight text-white sm:text-[36px]">
              Bahan Baku Tepat,
              <span className="block text-[#F5D56A]">
                Produksi Lebih Hebat.
              </span>
            </h2>

            <p className="mt-4 max-w-[480px] text-xs leading-6 text-[#DCEBDD] sm:text-sm">
              Kelola kebutuhan bahan baku surplus dengan
              lebih terencana, efisien, dan berkelanjutan.
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute -bottom-14 right-0 hidden h-72 w-72 items-center justify-center text-white/[0.07] md:flex lg:right-10">
          <Sprout size={250} strokeWidth={0.9} />
        </div>
      </section>

      {/* STATISTICS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-black sm:text-xl">
            Ringkasan Kebutuhan
          </h2>

          <span className="rounded-full bg-[#EAF2E4] px-3 py-1.5 text-[10px] font-bold text-[#39844E]">
            Data Simulasi
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
          {statsCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="min-w-0 rounded-[23px] border border-white bg-[#F8F6ED] p-4 shadow-[5px_5px_14px_#e4e2d7,-5px_-5px_14px_#ffffff] sm:p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${stat.color}`}
                  >
                    <Icon size={21} />
                  </span>

                  <TrendingUp
                    size={15}
                    className="text-[#A4B29F]"
                  />
                </div>

                <p className="mt-5 text-[11px] font-bold text-[#81917E]">
                  {stat.label}
                </p>

                <p className="mt-1 break-words text-2xl font-black tracking-tight sm:text-[30px]">
                  {stat.value}
                </p>

                <p className="mt-2 text-[10px] leading-4 text-[#9AA799]">
                  {stat.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SEARCH AND FILTER */}
      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-lg font-black sm:text-xl">
              Daftar Permintaan
            </h2>

            <p className="mt-1 text-xs text-[#8B9A88]">
              Pantau seluruh kebutuhan bahan baku yang kamu buat.
            </p>
          </div>

          <span className="text-xs font-bold text-[#829481]">
            {filtered.length} kebutuhan ditemukan
          </span>
        </div>

        <div className="rounded-[23px] border border-white bg-[#F8F6ED] p-3 shadow-[4px_4px_12px_#e5e3d8,-4px_-4px_12px_#ffffff] sm:p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative min-w-0 flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#829781]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Cari nama kebutuhan, kategori, lokasi..."
                aria-label="Cari kebutuhan"
                className="h-12 w-full rounded-2xl border border-[#DFE7D8] bg-white pl-12 pr-4 text-sm outline-none placeholder:text-[#A1AEA0] focus:border-[#5DA66C]"
              />
            </div>

            <div className="relative shrink-0 md:w-44">
              <select
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value as Filter)
                }
                aria-label="Filter status kebutuhan"
                className="h-12 w-full appearance-none rounded-2xl border border-[#DFE7D8] bg-white px-4 pr-10 text-xs font-bold text-[#245C43] outline-none"
              >
                {FILTERS.map((status) => (
                  <option key={status} value={status}>
                    {status === "Semua"
                      ? "Semua Status"
                      : status}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#829481]"
              />
            </div>
          </div>
        </div>
      </section>

      {notice && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-2xl bg-[#E5F0DF] px-4 py-3 text-xs font-bold text-[#39844E]"
        >
          {notice}

          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Tutup pemberitahuan"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* REQUIREMENTS */}
      {!loaded ? (
        <div className="rounded-[25px] bg-[#EDF2E7] p-10 text-center text-sm text-[#829481]">
          Memuat kebutuhan...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex min-h-[310px] flex-col items-center justify-center rounded-[27px] border border-dashed border-[#D7E4D0] bg-[#F0F3E9] p-6 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E2ECDD] text-[#348443]">
            <ClipboardList size={30} />
          </span>

          <h3 className="mt-5 text-lg font-black">
            Tidak Ada Kebutuhan Ditemukan
          </h3>

          <p className="mt-2 max-w-[350px] text-xs leading-6 text-[#81937E]">
            Belum ada kebutuhan yang sesuai dengan pencarian.
            Kamu dapat mengubah filter atau membuat permintaan baru
            melalui tombol di atas.
          </p>

          {(search || filter !== "Semua") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("Semua");
              }}
              className="mt-5 rounded-xl bg-[#245C43] px-5 py-3 text-xs font-bold text-white"
            >
              Reset Pencarian
            </button>
          )}
        </div>
      ) : (
        <div className="grid min-w-0 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <RequirementCard
              key={item.id}
              item={item}
              onStatusChange={changeStatus}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* FOOTER INFO */}
      <div className="flex items-start gap-3 rounded-2xl border border-[#DFE8D6] bg-[#EDF2E6] p-4">
        <ClipboardList
          size={20}
          className="mt-0.5 shrink-0 text-[#39844E]"
        />

        <p className="text-xs leading-6 text-[#718671]">
          <strong className="text-[#245C43]">
            Mode Simulasi SAVORA.
          </strong>{" "}
          Data kebutuhan disimpan secara lokal di browser.
          Belum terhubung dengan penawaran petani atau
          database Supabase.
        </p>
      </div>

      {/* DELETE CONFIRMATION */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#153C29]/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-requirement-title"
            className="w-full max-w-md rounded-[27px] bg-[#F8F6ED] p-6 shadow-2xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F9E7E4] text-[#A14E45]">
              <Trash2 size={26} />
            </div>

            <h2
              id="delete-requirement-title"
              className="mt-5 text-xl font-black"
            >
              Hapus Kebutuhan?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#829481]">
              Kebutuhan ini akan dihapus dari data simulasi
              yang tersimpan di browser.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-[#D7E4D0] bg-white px-4 py-3 text-sm font-bold"
              >
                Kembali
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-xl bg-[#A14E45] px-4 py-3 text-sm font-bold text-white"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
