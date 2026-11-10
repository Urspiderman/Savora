
export type SurplusStatus =
  | "available"
  | "reserved"
  | "sold"
  | "closed";

export type SurplusCondition =
  | "good"
  | "imperfect"
  | "overripe";

export type SurplusListing = {
  id: string;
  farmer_id: string;
  title: string;
  commodity: string;
  description: string | null;
  quantity_kg: number;
  price_per_kg: number;
  condition: SurplusCondition;
  location: string;
  harvest_date: string | null;
  available_until: string | null;
  status: SurplusStatus;
  created_at: string;
  updated_at: string;
};

export const SURPLUS_STATUS_LABELS: Record<
  SurplusStatus,
  string
> = {
  available: "Tersedia",
  reserved: "Dipesan",
  sold: "Terjual",
  closed: "Ditutup",
};

export const CONDITION_LABELS: Record<
  SurplusCondition,
  string
> = {
  good: "Layak Konsumsi",
  imperfect: "Bentuk Tidak Sempurna",
  overripe: "Terlalu Matang",
};

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value.slice(0, 10)}T12:00:00Z`));
}
