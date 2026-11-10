
"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Sprout,
  ShoppingBag,
  Truck,
  History,
  UserRound,
  LogOut,
  Menu,
  X,
  Bell,
  Package,
  ClipboardList,
  Users,
  ShieldCheck,
  Wallet,
  BarChart3,
  Settings,
  MapPinned,
  ChevronRight,
} from "lucide-react";

import RoleSwitcher from "@/components/shared/RoleSwitcher";
import { createClient } from "@/lib/supabase/client";
import type { AppRole } from "@/lib/auth/roles";

type Props = {
  children: ReactNode;
  role: AppRole;
  fullName: string;
  allowedRoles: AppRole[];
};

const NAV_ITEMS = {
  farmer: [
    { label: "Dashboard", href: "/farmer/dashboard", icon: LayoutDashboard },
    { label: "Surplus", href: "/farmer/surplus", icon: Sprout },
    { label: "Penjemputan", href: "/farmer/pickups", icon: Truck },
    { label: "Transaksi", href: "/farmer/transactions", icon: History },
    { label: "Profil", href: "/farmer/profile", icon: UserRound },
  ],
  processor: [
    { label: "Dashboard", href: "/processor/dashboard", icon: LayoutDashboard },
    { label: "Marketplace", href: "/processor/marketplace", icon: ShoppingBag },
    { label: "Kebutuhan", href: "/processor/requirements", icon: ClipboardList },
    { label: "Pesanan", href: "/processor/orders", icon: Package },
    { label: "Profil", href: "/processor/profile", icon: UserRound },
  ],
  courier: [
    { label: "Dashboard", href: "/courier/dashboard", icon: LayoutDashboard },
    { label: "Tugas", href: "/courier/tasks", icon: ClipboardList },
    { label: "Navigasi", href: "/courier/navigation", icon: MapPinned },
    { label: "Riwayat", href: "/courier/history", icon: History },
    { label: "Profil", href: "/courier/profile", icon: UserRound },
  ],
  admin: [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Pengguna", href: "/admin/users", icon: Users },
    { label: "Verifikasi", href: "/admin/verification", icon: ShieldCheck },
    { label: "Surplus", href: "/admin/surplus", icon: Sprout },
    { label: "Pesanan", href: "/admin/orders", icon: ShoppingBag },
    { label: "Logistik", href: "/admin/logistics", icon: Truck },
    { label: "Keuangan", href: "/admin/finance", icon: Wallet },
    { label: "Laporan", href: "/admin/reports", icon: BarChart3 },
    { label: "Pengaturan", href: "/admin/settings", icon: Settings },
  ],
};

const ROLE_LABEL: Record<AppRole, string> = {
  farmer: "Petani",
  processor: "Pengolah",
  courier: "Kurir",
  admin: "Admin",
};

export default function DashboardShell({
  children,
  role,
  fullName,
  allowedRoles,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenu, setMobileMenu] = useState(false);

  const isAdmin = role === "admin";
  const navItems = NAV_ITEMS[role];
  const firstName = fullName?.trim().split(/\s+/)[0] || "Pengguna";

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  // ==========================================
  // ADMIN SIDEBAR
  // ==========================================

  const adminSidebar = (
    <div className="flex h-full flex-col">
      <Link href="/" className="mb-9 block px-3">
        <Image
          src="/images/logo/logo.png"
          alt="SAVORA"
          width={190}
          height={80}
          className="h-auto w-[165px] object-contain"
          priority
        />
      </Link>

      <div className="mb-5 px-4">
        <p className="text-xs font-bold uppercase tracking-widest text-[#8B9788]">
          Admin Panel
        </p>
      </div>

      <nav className="flex-1 space-y-1.5">
        {NAV_ITEMS.admin.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenu(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "bg-[#087338] text-white shadow-[4px_5px_9px_#c4c8b8]"
                  : "text-[#31483D] hover:bg-[#E8ECDD]"
              }`}
            >
              <Icon size={19} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={16} />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 border-t border-[#DFE1D5] pt-5">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-[#8A3C32] hover:bg-[#F5E7DF]"
        >
          <LogOut size={19} />
          Keluar
        </button>
      </div>
    </div>
  );

  // ==========================================
  // MOBILE TOP BAR
  // ==========================================

  const mobileHeader = (
    <header className="relative z-30 overflow-visible border-b border-[#E4E9DA] bg-[#F8F6ED] lg:hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-10 -top-16 h-32 w-40 rounded-full bg-[#E5EED8]/70 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 h-20 w-36 rounded-full bg-[#EDF0D8]/80 blur-2xl" />
      </div>

      <div className="relative flex min-h-[76px] items-center justify-between gap-2 px-3 py-3 sm:px-6">
        {/* LOGO */}
        <Link
          href={`/${role}/dashboard`}
          className="flex min-w-0 items-center gap-2"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#C6DDB8] bg-[#F1F5E9] shadow-[0_3px_10px_rgba(35,92,67,0.08)]">
            <Image
              src="/images/logo/logo-icon.png"
              alt="SAVORA"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
              priority
            />
          </div>

          <div className="hidden h-7 w-px bg-[#A6BE9D] min-[390px]:block" />

          <span className="hidden text-[19px] font-black tracking-tight text-[#245C43] min-[390px]:block">
            SAVORA
          </span>
        </Link>

        {/* ROLE SWITCHER + AVATAR */}
        <div className="flex min-w-0 shrink-0 items-center gap-2">
          <div className="min-w-0 max-w-[160px] rounded-full border border-[#BFD4B2] bg-[#EDF2E3] px-1 py-0.5 text-[#245C43]">
            <RoleSwitcher
              currentRole={role}
              allowedRoles={allowedRoles}
            />
          </div>

          <Link
            href={`/${role}/profile`}
            aria-label="Buka profil"
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#347B4C] to-[#175B35] text-sm font-black text-white shadow-[0_4px_12px_rgba(26,88,49,0.2)]"
          >
            {firstName.charAt(0).toUpperCase()}
          </Link>
        </div>
      </div>
    </header>
  );

  // ==========================================
  // DESKTOP TOP BAR
  // ==========================================

  const desktopHeader = (
    <header
      className={`relative z-30 min-h-[78px] items-center justify-between gap-3 border-b border-[#E9E6DB] bg-[#F8F6ED] px-4 sm:px-7 ${
        isAdmin ? "flex" : "hidden lg:flex"
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        {isAdmin && (
          <button
            type="button"
            onClick={() => setMobileMenu(true)}
            aria-label="Buka menu admin"
            className="rounded-xl p-2 lg:hidden"
          >
            <Menu size={23} />
          </button>
        )}

        <Link href="/" className={isAdmin ? "lg:hidden" : ""}>
          <Image
            src="/images/logo/logo.png"
            alt="SAVORA"
            width={150}
            height={60}
            className="h-auto w-[105px] object-contain sm:w-[145px]"
            priority
          />
        </Link>

        {isAdmin && (
          <div className="hidden lg:block">
            <h2 className="text-lg font-extrabold">
              Admin Dashboard
            </h2>
            <p className="text-xs text-[#728071]">
              Kelola ekosistem SAVORA
            </p>
          </div>
        )}
      </div>

      {!isAdmin && (
        <nav className="hidden items-center gap-1 rounded-full border border-white bg-[#F1F1E8] p-1.5 shadow-[inset_3px_3px_8px_#deddd2,inset_-3px_-3px_8px_#ffffff] lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2.5 text-xs font-bold transition xl:px-4 ${
                  active
                    ? "bg-[#087338] text-white shadow-md"
                    : "text-[#496150] hover:bg-white/80"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <RoleSwitcher
          currentRole={role}
          allowedRoles={allowedRoles}
        />

        <span className="hidden rounded-full p-2 text-[#7B9279] xl:flex">
          <Bell size={20} />
        </span>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-b from-[#43B66D] to-[#006E33] text-white shadow-md sm:h-10 sm:w-10">
          <UserRound size={20} />
        </div>
      </div>
    </header>
  );

  // ==========================================
  // ADMIN LAYOUT
  // ==========================================

  if (isAdmin) {
    return (
      <div className="min-h-dvh bg-[#F8F6ED] p-2 text-[#164A32] sm:p-5 lg:p-7">
        <div className="mx-auto flex min-h-[calc(100dvh-56px)] max-w-[1550px] overflow-hidden rounded-[28px] border-2 border-white bg-[#F8F6ED] shadow-[10px_10px_28px_#dedbd0,-10px_-10px_28px_#ffffff]">
          <aside className="hidden w-[245px] shrink-0 border-r border-[#E9E6DB] px-4 py-7 lg:block">
            {adminSidebar}
          </aside>

          {mobileMenu && (
            <div className="fixed inset-0 z-[70] lg:hidden">
              <button
                type="button"
                className="absolute inset-0 bg-[#163D2A]/40"
                aria-label="Tutup menu"
                onClick={() => setMobileMenu(false)}
              />

              <aside className="absolute bottom-0 left-0 top-0 w-[280px] overflow-y-auto bg-[#F8F6ED] p-5 shadow-2xl">
                <button
                  type="button"
                  onClick={() => setMobileMenu(false)}
                  aria-label="Tutup menu"
                  className="absolute right-4 top-4"
                >
                  <X size={23} />
                </button>
                {adminSidebar}
              </aside>
            </div>
          )}

          <div className="min-w-0 flex-1">
            {desktopHeader}
            <main className="px-4 py-6 sm:px-7 sm:py-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // MOBILE BOTTOM BAR - MENEMPEL
  // ==========================================

  const mobileBottomNav = (
    <nav
      aria-label="Navigasi utama mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t-[3px] border-[#5EA75B] bg-[#F8F6ED] pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_20px_rgba(36,92,67,0.1)] lg:hidden"
    >
      <div className="mx-auto flex w-full max-w-[650px] items-stretch justify-around gap-1 px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          const mobileLabel =
            role === "farmer" && item.href === "/farmer/pickups"
              ? "Jemput"
              : item.label;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-0.5 py-2 transition-all duration-200 ${
                active
                  ? "bg-gradient-to-br from-[#347B4C] to-[#20683D] text-white shadow-[0_4px_12px_rgba(36,92,67,0.18)]"
                  : "text-[#476D50] hover:bg-[#EAF1E3]"
              }`}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.6 : 2}
              />

              <span
                className={`w-full truncate text-center text-[10px] tracking-tight ${
                  active ? "font-extrabold" : "font-semibold"
                }`}
              >
                {mobileLabel}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );

  // ==========================================
  // FARMER / PROCESSOR / COURIER LAYOUT
  // ==========================================

  return (
    <div className="min-h-dvh w-full max-w-full overflow-x-clip bg-[#F8F6ED] text-[#164A32]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[1600px] bg-[#F8F6ED]">
        {mobileHeader}
        {desktopHeader}

        <main className="w-full min-w-0 max-w-full px-4 pb-28 pt-6 sm:px-7 lg:pb-10 lg:pt-8">
          {children}
        </main>

        {mobileBottomNav}
      </div>
    </div>
  );
}
