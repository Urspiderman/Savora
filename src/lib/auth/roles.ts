
export type AppRole = "farmer" | "processor" | "courier" | "admin";

export const ROLE_CONFIG: Record<
  AppRole,
  { label: string; path: string; description: string }
> = {
  farmer: {
    label: "Petani",
    path: "/farmer/dashboard",
    description: "Menawarkan surplus hasil panen",
  },
  processor: {
    label: "Pengolah",
    path: "/processor/dashboard",
    description: "Mencari bahan organik dan mengolahnya",
  },
  courier: {
    label: "Kurir",
    path: "/courier/dashboard",
    description: "Menjemput dan mengirimkan surplus panen",
  },
  admin: {
    label: "Admin",
    path: "/admin/dashboard",
    description: "Mengelola ekosistem SAVORA",
  },
};

export const REGISTER_ROLES: AppRole[] = [
  "farmer",
  "processor",
  "courier",
];

export function isAppRole(value: unknown): value is AppRole {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(ROLE_CONFIG, value)
  );
}
