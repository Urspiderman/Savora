# SAVORA V2 — Arsitektur dengan Onboarding

Starter Next.js App Router + TypeScript + Tailwind untuk 4 role: Farmer, Processor, Courier, Admin.

## Mulai
1. `npm install`
2. `npm run dev`
3. Buka `http://localhost:3000` → **Mulai Jelajahi** → `/onboarding`

## Alur
Landing (`/`) → Onboarding (`/onboarding`, 3 slide) → Login/Register → verifikasi admin → dashboard role.
Tombol **Lewati** dan **Mulai Sekarang** mengarahkan ke `/register` serta menyimpan flag lokal `savora_onboarding_seen`. Pengalihan otomatis pengguna baru belum diaktifkan; landing tetap dapat diakses kapan saja.

## Folder penting
- `src/app/(public)/onboarding/page.tsx` — onboarding interaktif.
- `src/app/(farmer)/farmer/` — dashboard, surplus, pickups, transactions, profile.
- `src/app/(processor)/processor/` — dashboard, marketplace, requirements, orders, profile.
- `src/app/(courier)/courier/` — dashboard, tasks, navigation, history, profile.
- `src/app/(admin)/admin/` — dashboard, users, verification, surplus, orders, logistics, finance, reports, settings.
- `src/components/chatbot/ChatbotWidget.tsx` — widget mengambang; **belum AI sungguhan**.
- `src/app/api/` — endpoint awal, belum implementasi bisnis.
- `public/images/logo/` — aset logo dari ZIP SAVORA yang tersedia.

## Status
Ini **scaffold**. Onboarding interaktif dan landing awal sudah ada. Halaman role masih placeholder. Auth Supabase, RLS, role approval, transaksi, logistik, pembayaran, dan AI API harus dibangun dan diuji sebelum produksi.
