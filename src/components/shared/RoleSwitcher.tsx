
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check, ChevronDown, Sprout, Recycle, Truck, ShieldCheck,
} from "lucide-react";
import {
  ROLE_CONFIG, type AppRole,
} from "@/lib/auth/roles";

type Props = {
  currentRole: AppRole;
  allowedRoles: AppRole[];
};

const icons = {
  farmer: Sprout,
  processor: Recycle,
  courier: Truck,
  admin: ShieldCheck,
};

export default function RoleSwitcher({
  currentRole,
  allowedRoles,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const CurrentIcon = icons[currentRole];

  function switchRole(role: AppRole) {
    if (!allowedRoles.includes(role)) return;

    setOpen(false);
    router.push(ROLE_CONFIG[role].path);
    router.refresh();
  }

  return (
    <div className="relative">
      {open && (
        <button
          type="button"
          aria-label="Tutup pilihan peran"
          className="fixed inset-0 z-40 cursor-default"
          onClick={() => setOpen(false)}
        />
      )}

      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen(!open)}
        className="relative z-50 flex items-center gap-2 rounded-full border border-[#8CBCA0] bg-[#F8F6ED] px-3 py-2.5 text-xs font-bold text-[#164A32] shadow-[4px_4px_10px_#dcd9cc,-4px_-4px_10px_#ffffff] sm:px-5 sm:text-sm"
      >
        <CurrentIcon size={18} />
        <span className="max-w-[110px] truncate sm:max-w-none">
          {ROLE_CONFIG[currentRole].label}
        </span>
        <ChevronDown size={16} className={open ? "rotate-180" : ""} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+12px)] z-50 w-[260px] rounded-[24px] border border-white bg-[#F8F6ED] p-3 shadow-[8px_12px_28px_#cfcfc1,-5px_-5px_16px_#ffffff]"
        >
          <p className="px-3 pb-3 pt-1 text-sm font-extrabold">
            Ubah Peran
          </p>

          {allowedRoles.map((role) => {
            const Icon = icons[role];
            const selected = currentRole === role;

            return (
              <button
                key={role}
                type="button"
                role="menuitem"
                onClick={() => switchRole(role)}
                className={`mb-1 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm transition hover:bg-[#EAF0E0] ${
                  selected ? "bg-[#EAF0E0] font-bold" : ""
                }`}
              >
                <Icon size={21} className="text-[#4D9D38]" />
                <span className="flex-1">
                  {ROLE_CONFIG[role].label}
                </span>
                {selected && (
                  <span className="rounded-full bg-[#087338] p-1 text-white">
                    <Check size={13} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
