
export type RequirementStatus =
  | "Aktif"
  | "Terpenuhi"
  | "Ditutup";

export type RequirementCategory =
  | "Sayuran"
  | "Buah"
  | "Umbi"
  | "Campuran"
  | "Lainnya";

export type ProcessorRequirement = {
  id: string;
  title: string;
  category: RequirementCategory;
  quantity: number;
  unit: "kg";
  maxPrice: number;
  location: string;
  deadline: string;
  purpose: string;
  description: string;
  status: RequirementStatus;
  createdAt: string;
};

export const REQUIREMENTS_KEY =
  "savora_processor_requirements_v1";

export const DEMO_REQUIREMENTS: ProcessorRequirement[] = [
  {
    id: "REQ-DEMO-001",
    title: "Tomat Surplus untuk Produksi Saus",
    category: "Sayuran",
    quantity: 100,
    unit: "kg",
    maxPrice: 4000,
    location: "Lubuklinggau",
    deadline: "2026-12-15",
    purpose: "Pengolahan pangan",
    description:
      "Membutuhkan tomat surplus yang masih layak diolah untuk produksi saus. Ukuran dan bentuk tidak harus seragam.",
    status: "Aktif",
    createdAt: "2026-11-10T08:00:00.000Z",
  },
  {
    id: "REQ-DEMO-002",
    title: "Limbah Sayuran untuk Bahan Kompos",
    category: "Campuran",
    quantity: 200,
    unit: "kg",
    maxPrice: 1000,
    location: "Musi Rawas",
    deadline: "2026-12-20",
    purpose: "Produksi kompos",
    description:
      "Mencari sisa sayuran organik untuk pengolahan kompos. Bahan harus bebas dari plastik, logam, dan kontaminan berbahaya.",
    status: "Aktif",
    createdAt: "2026-11-09T08:00:00.000Z",
  },
  {
    id: "REQ-DEMO-003",
    title: "Pisang Matang untuk Produk Olahan",
    category: "Buah",
    quantity: 75,
    unit: "kg",
    maxPrice: 3500,
    location: "Lubuklinggau",
    deadline: "2026-12-10",
    purpose: "Pengolahan pangan",
    description:
      "Membutuhkan pisang matang untuk produk makanan. Bahan harus diperiksa kelayakannya sebelum digunakan.",
    status: "Terpenuhi",
    createdAt: "2026-11-08T08:00:00.000Z",
  },
];

export function getProcessorRequirements(): ProcessorRequirement[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(REQUIREMENTS_KEY);

    if (raw === null) {
      return DEMO_REQUIREMENTS;
    }

    const parsed: unknown = JSON.parse(raw);

    return Array.isArray(parsed)
      ? (parsed as ProcessorRequirement[])
      : DEMO_REQUIREMENTS;
  } catch {
    return DEMO_REQUIREMENTS;
  }
}

export function saveProcessorRequirements(
  requirements: ProcessorRequirement[]
) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    REQUIREMENTS_KEY,
    JSON.stringify(requirements)
  );

  window.dispatchEvent(
    new Event("savora-requirements-updated")
  );
}

export function addProcessorRequirement(
  requirement: ProcessorRequirement
) {
  const requirements = getProcessorRequirements();

  saveProcessorRequirements([
    requirement,
    ...requirements,
  ]);
}

export function updateRequirementStatus(
  id: string,
  status: RequirementStatus
) {
  const requirements = getProcessorRequirements();

  const updated = requirements.map((item) =>
    item.id === id ? { ...item, status } : item
  );

  if (!requirements.some((item) => item.id === id)) {
    return false;
  }

  saveProcessorRequirements(updated);
  return true;
}

export function deleteProcessorRequirement(id: string) {
  const requirements = getProcessorRequirements();

  if (!requirements.some((item) => item.id === id)) {
    return false;
  }

  saveProcessorRequirements(
    requirements.filter((item) => item.id !== id)
  );

  return true;
}

export function formatRequirementDate(date: string) {
  if (!date) return "-";

  const parsed = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}
