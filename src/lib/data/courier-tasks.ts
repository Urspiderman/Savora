
export type CourierTaskStatus =
  | "Menunggu"
  | "Dalam Penjemputan"
  | "Barang Diambil"
  | "Dalam Pengiriman"
  | "Selesai";

export type CourierTask = {
  id: string;
  title: string;
  product: string;
  quantityKg: number;
  farmer: string;
  farmerPhone: string;
  pickupAddress: string;
  processor: string;
  processorPhone: string;
  deliveryAddress: string;
  scheduledAt: string;
  status: CourierTaskStatus;
  fee: number;
  notes: string;
};

export const COURIER_TASKS_KEY =
  "savora_courier_tasks_v1";

export const STATUS_FLOW: CourierTaskStatus[] = [
  "Menunggu",
  "Dalam Penjemputan",
  "Barang Diambil",
  "Dalam Pengiriman",
  "Selesai",
];

export const DEMO_COURIER_TASKS: CourierTask[] = [
  {
    id: "SVR-KR-001",
    title: "Penjemputan Tomat Surplus",
    product: "Tomat Surplus",
    quantityKg: 50,
    farmer: "Pak Ahmad",
    farmerPhone: "081234567801",
    pickupAddress: "Lubuklinggau Timur, Sumatera Selatan",
    processor: "UMKM Olahan Sejahtera",
    processorPhone: "081234567811",
    deliveryAddress: "Lubuklinggau Barat, Sumatera Selatan",
    scheduledAt: "2026-11-11T09:00:00",
    status: "Menunggu",
    fee: 25000,
    notes: "Pastikan kemasan tomat aman saat pengangkutan.",
  },
  {
    id: "SVR-KR-002",
    title: "Pengiriman Wortel",
    product: "Wortel Surplus",
    quantityKg: 80,
    farmer: "Bu Siti",
    farmerPhone: "081234567802",
    pickupAddress: "Muara Beliti, Musi Rawas",
    processor: "Dapur Pangan Lestari",
    processorPhone: "081234567812",
    deliveryAddress: "Lubuklinggau Selatan, Sumatera Selatan",
    scheduledAt: "2026-11-11T13:00:00",
    status: "Dalam Pengiriman",
    fee: 35000,
    notes: "Barang sudah diambil dari petani.",
  },
  {
    id: "SVR-KR-003",
    title: "Pengiriman Pisang Matang",
    product: "Pisang Matang",
    quantityKg: 65,
    farmer: "Pak Joko",
    farmerPhone: "081234567803",
    pickupAddress: "Lubuklinggau Utara, Sumatera Selatan",
    processor: "Rumah Olahan Pisang",
    processorPhone: "081234567813",
    deliveryAddress: "Lubuklinggau Timur, Sumatera Selatan",
    scheduledAt: "2026-11-10T10:00:00",
    status: "Selesai",
    fee: 28000,
    notes: "Pengiriman selesai.",
  },
];

export function getCourierTasks(): CourierTask[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(COURIER_TASKS_KEY);

    if (raw === null) {
      return DEMO_COURIER_TASKS.map((task) => ({ ...task }));
    }

    const parsed: unknown = JSON.parse(raw);

    return Array.isArray(parsed)
      ? (parsed as CourierTask[])
      : DEMO_COURIER_TASKS.map((task) => ({ ...task }));
  } catch {
    return DEMO_COURIER_TASKS.map((task) => ({ ...task }));
  }
}

export function saveCourierTasks(tasks: CourierTask[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    COURIER_TASKS_KEY,
    JSON.stringify(tasks)
  );

  window.dispatchEvent(new Event("savora-courier-updated"));
}

export function getCourierTask(id: string) {
  return getCourierTasks().find((task) => task.id === id);
}

export function updateCourierTaskStatus(
  id: string,
  nextStatus: CourierTaskStatus
) {
  const tasks = getCourierTasks();
  const task = tasks.find((item) => item.id === id);

  if (!task) return false;

  const currentIndex = STATUS_FLOW.indexOf(task.status);
  const nextIndex = STATUS_FLOW.indexOf(nextStatus);

  if (nextIndex !== currentIndex + 1) return false;

  saveCourierTasks(
    tasks.map((item) =>
      item.id === id
        ? { ...item, status: nextStatus }
        : item
    )
  );

  return true;
}

export function getNextCourierStatus(
  status: CourierTaskStatus
): CourierTaskStatus | null {
  const index = STATUS_FLOW.indexOf(status);
  return STATUS_FLOW[index + 1] ?? null;
}

export function formatCourierCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCourierDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
