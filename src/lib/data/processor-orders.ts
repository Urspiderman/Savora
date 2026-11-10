
export type ProcessorOrderStatus =
  | "Menunggu Konfirmasi"
  | "Diproses"
  | "Dikirim"
  | "Selesai"
  | "Dibatalkan";

export type ProcessorOrder = {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  farmer: string;
  location: string;
  quantity: number;
  pricePerKg: number;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: ProcessorOrderStatus;
  paymentMethod: string;
  notes: string;
  createdAt: string;
};

export const PROCESSOR_ORDERS_KEY = "savora_processor_orders_v1";

export function getProcessorOrders(): ProcessorOrder[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(PROCESSOR_ORDERS_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);

    return Array.isArray(parsed)
      ? (parsed as ProcessorOrder[])
      : [];
  } catch {
    return [];
  }
}

export function saveProcessorOrders(orders: ProcessorOrder[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    PROCESSOR_ORDERS_KEY,
    JSON.stringify(orders)
  );

  window.dispatchEvent(new Event("savora-orders-updated"));
}

export function saveProcessorOrder(order: ProcessorOrder) {
  const orders = getProcessorOrders();
  saveProcessorOrders([order, ...orders]);
}

export function updateProcessorOrderStatus(
  orderId: string,
  status: ProcessorOrderStatus
): boolean {
  const orders = getProcessorOrders();
  const order = orders.find((item) => item.id === orderId);

  if (!order) return false;

  if (order.status === "Selesai" || order.status === "Dibatalkan") {
    return false;
  }

  order.status = status;
  saveProcessorOrders(orders);

  return true;
}

export function formatOrderDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
