
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Leaf,
  TrendingUp,
  Recycle,
  Rocket,
  UserRoundPlus,
  LogIn,
  Sprout,
  Truck,
  PackageCheck,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

const benefits = [
  {
    title: "Kurangi Limbah",
    description: "Manfaatkan surplus panen secara optimal.",
    icon: Leaf,
    color: "text-[#65A93D]",
    background: "bg-[#EDF6DF]",
  },
  {
    title: "Tambah Pendapatan",
    description: "Ubah hasil panen menjadi lebih bernilai.",
    icon: TrendingUp,
    color: "text-[#E3A600]",
    background: "bg-[#FFF4C8]",
  },
  {
    title: "Pertanian Berkelanjutan",
    description: "Dukung siklus pertanian yang lebih hijau.",
    icon: Recycle,
    color: "text-[#27834F]",
    background: "bg-[#E4F2E5]",
  },
];

const features = [
  {
    number: "01",
    title: "Jual Surplus Panen",
    description:
      "Petani dapat menawarkan hasil panen berlebih yang masih layak dimanfaatkan.",
    icon: Sprout,
    color: "bg-[#E8F2DC]",
  },
  {
    number: "02",
    title: "Temukan Bahan Organik",
    description:
      "Pengolah kompos dapat mencari dan memesan surplus sesuai kebutuhan.",
    icon: PackageCheck,
    color: "bg-[#FFF0BE]",
  },
  {
    number: "03",
    title: "Logistik Terintegrasi",
    description:
      "Mitra logistik membantu menghubungkan proses penjemputan dan pengiriman.",
    icon: Truck,
    color: "bg-[#E8F2DC]",
  },
];

export default function Home() {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-[#E9EDE3] p-3 text-[#20563A] sm:p-6 lg:p-8">
      <div className="relative mx-auto flex min-h-[calc(100dvh-24px)] w-full max-w-[1500px] flex-col overflow-hidden rounded-[32px] border-[3px] border-white/90 bg-[#F8F6ED] shadow-[18px_18px_45px_#C8D1C4,-18px_-18px_45px_#FFFFFF] sm:rounded-[48px]">

        {/* Background glows */}
        <div className="pointer-events-none absolute -left-32 top-[30%] h-80 w-80 rounded-full bg-[#F7D96A]/20 blur-[90px]" />
        <div className="pointer-events-none absolute -right-32 top-[10%] h-[450px] w-[450px] rounded-full bg-[#A4D77D]/25 blur-[100px]" />

        {/* NAVBAR */}
        <header className="relative z-30 flex items-center justify-between gap-4 px-5 py-6 sm:px-10 lg:px-16 lg:py-8">
          <Link
            href="/"
            aria-label="Beranda SAVORA"
            className="shrink-0"
          >
            <Image
              src="/images/logo/logo.png"
              alt="Logo SAVORA"
              width={260}
              height={100}
              priority
              className="h-auto w-[145px] object-contain sm:w-[185px] lg:w-[230px]"
            />
          </Link>

          <nav className="hidden items-center gap-2 rounded-full border border-white bg-[#F8F6ED] p-2 shadow-[7px_7px_18px_#DFDED4,-7px_-7px_18px_#FFFFFF] lg:flex">
            <Link
              href="/"
              className="rounded-full bg-[#E8F1D6] px-6 py-3 text-sm font-bold shadow-[inset_2px_2px_5px_#CFDDBC,inset_-2px_-2px_5px_#FFFFFF]"
            >
              Beranda
            </Link>

            <Link
              href="#fitur"
              className="rounded-full px-6 py-3 text-sm font-semibold text-[#526758] transition hover:bg-[#EDF1E5]"
            >
              Fitur
            </Link>

            <Link
              href="#dampak"
              className="rounded-full px-6 py-3 text-sm font-semibold text-[#526758] transition hover:bg-[#EDF1E5]"
            >
              Dampak
            </Link>

            <Link
              href="/about"
              className="rounded-full px-6 py-3 text-sm font-semibold text-[#526758] transition hover:bg-[#EDF1E5]"
            >
              Tentang
            </Link>
          </nav>

          <Link
            href="/login"
            className="flex shrink-0 items-center gap-2 rounded-full border-2 border-white bg-[#F8F6ED] px-5 py-3 text-sm font-bold shadow-[6px_6px_14px_#DEDCD1,-6px_-6px_14px_#FFFFFF] transition hover:-translate-y-0.5 hover:text-[#27905B] sm:px-7"
          >
            <LogIn size={19} />
            Masuk
          </Link>
        </header>

        {/* HERO SECTION */}
        <section className="relative z-10 grid flex-1 items-center gap-6 px-5 pb-12 pt-8 sm:px-10 lg:grid-cols-2 lg:gap-6 lg:px-16 lg:pb-16 lg:pt-10">

          {/* LEFT CONTENT */}
          <div className="relative z-10 flex flex-col items-center text-center lg:items-start lg:text-left">

            {/* Tagline */}
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border-2 border-white bg-[#FFF6D8] px-5 py-3 shadow-[5px_6px_13px_#DFD8BE,-5px_-5px_13px_#FFFFFF]">
              <Leaf size={21} className="text-[#4F9F34]" />
              <span className="text-xs font-extrabold uppercase tracking-[0.09em] sm:text-sm">
                From Surplus to Value
              </span>
            </div>

            {/* Heading */}
            <h1 className="max-w-[720px] text-[35px] font-extrabold leading-[1.13] tracking-tight sm:text-[48px] lg:text-[54px] xl:text-[65px]">
              Surplus panen,
              <span className="block">
                peluang baru untuk
              </span>
              <span className="relative inline-block text-[#E5AC00]">
                ekonomi sirkular.
                <svg
                  className="absolute -bottom-3 left-0 h-4 w-full"
                  viewBox="0 0 400 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12 Q200 -4 395 11"
                    stroke="#8BBF4F"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="mt-9 max-w-[560px] text-base leading-8 text-[#536758] sm:text-lg">
              Hubungkan petani, pengolah kompos, dan mitra
              logistik dalam satu platform ekonomi sirkular
              yang mengubah surplus panen menjadi nilai lebih.
            </p>

            {/* Buttons */}
            <div className="mt-9 flex w-full flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Link
                href="/onboarding"
                className="inline-flex min-h-[58px] items-center justify-center gap-3 rounded-full border border-[#32945B] bg-gradient-to-br from-[#49BA78] to-[#087044] px-7 py-4 font-bold text-white shadow-[6px_9px_17px_#B5C7B4,-5px_-5px_12px_#FFFFFF] transition hover:-translate-y-1 hover:brightness-110 active:scale-[0.98]"
              >
                <Rocket size={21} />
                Mulai Jelajahi
                <ArrowRight size={20} />
              </Link>

              <Link
                href="/register"
                className="inline-flex min-h-[58px] items-center justify-center gap-3 rounded-full border-2 border-white bg-[#F8F6ED] px-8 py-4 font-bold shadow-[6px_6px_14px_#DEDCD1,-6px_-6px_14px_#FFFFFF] transition hover:-translate-y-1 hover:text-[#27905B]"
              >
                <UserRoundPlus size={21} />
                Daftar
              </Link>
            </div>

            {/* Mini trust indicators */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <div className="flex items-center gap-2 rounded-full bg-[#EAF3DD] px-4 py-2 text-xs font-semibold text-[#3F7847]">
                <CheckCircle2 size={16} />
                Ekonomi Sirkular
              </div>
              <div className="flex items-center gap-2 rounded-full bg-[#FFF0C1] px-4 py-2 text-xs font-semibold text-[#92701A]">
                <Sparkles size={16} />
                Green Innovation
              </div>
            </div>
          </div>

          {/* RIGHT ILLUSTRATION */}
          <div className="relative flex min-h-[350px] items-center justify-center sm:min-h-[480px] lg:min-h-[570px]">

            {/* Decorative rings */}
            <div className="pointer-events-none absolute h-[85%] w-[85%] rounded-full border-[24px] border-[#E5EDDA]/70" />
            <div className="pointer-events-none absolute h-[70%] w-[70%] rounded-full border-[2px] border-dashed border-[#B5D69C]" />

            {/* Main illustration circle */}
            <div className="relative flex aspect-square w-full max-w-[560px] items-center justify-center rounded-full border-2 border-white bg-[#F8F6ED] shadow-[inset_13px_13px_30px_#E2E2D7,inset_-13px_-13px_30px_#FFFFFF]">
              <Image
                src="/images/onboarding/onboarding-1.webp"
                alt="Petani, surplus panen, logistik, dan ekonomi sirkular"
                width={700}
                height={700}
                priority
                className="relative z-10 h-auto w-full object-contain drop-shadow-[0_20px_18px_rgba(63,92,47,0.13)]"
              />
            </div>

            {/* Floating badge: logistics */}
            <div className="absolute right-0 top-[9%] z-20 flex items-center gap-2 rounded-2xl border-2 border-white bg-[#F8F6ED] px-3 py-3 shadow-[7px_7px_16px_#D5DCCD,-7px_-7px_16px_#FFFFFF] sm:px-4">
              <div className="rounded-xl bg-[#E8F2DC] p-2">
                <Truck size={24} className="text-[#31844C]" />
              </div>
              <div>
                <p className="text-xs font-bold sm:text-sm">
                  Smart Logistics
                </p>
                <p className="text-[10px] text-[#778478] sm:text-xs">
                  Penjemputan terhubung
                </p>
              </div>
            </div>

            {/* Floating badge: compost */}
            <div className="absolute bottom-[8%] left-0 z-20 flex items-center gap-2 rounded-2xl border-2 border-white bg-[#F8F6ED] px-3 py-3 shadow-[7px_7px_16px_#D5DCCD,-7px_-7px_16px_#FFFFFF] sm:px-4">
              <div className="rounded-xl bg-[#FFF0C1] p-2">
                <Sprout size={24} className="text-[#B58A0B]" />
              </div>
              <div>
                <p className="text-xs font-bold sm:text-sm">
                  Circular Farming
                </p>
                <p className="text-[10px] text-[#778478] sm:text-xs">
                  Surplus jadi manfaat
                </p>
              </div>
            </div>

            {/* Decorative sparkles */}
            <Sparkles
              size={29}
              className="absolute left-[8%] top-[12%] text-[#E7B51D]"
            />
            <Leaf
              size={34}
              className="absolute bottom-[10%] right-[10%] rotate-[-30deg] text-[#80B94A]"
            />
          </div>
        </section>

        {/* BENEFITS SECTION */}
        <section
          id="dampak"
          className="relative z-10 grid gap-5 px-5 pb-14 sm:px-10 md:grid-cols-3 lg:px-16"
        >
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="group flex items-center gap-4 rounded-[28px] border-[2px] border-white bg-[#F8F6ED] px-5 py-6 shadow-[8px_8px_20px_#DFDDD2,-8px_-8px_20px_#FFFFFF] transition duration-300 hover:-translate-y-1"
              >
                <div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] border-2 border-white ${benefit.background} shadow-[4px_4px_10px_#DDDCD0,-4px_-4px_10px_#FFFFFF]`}
                >
                  <Icon size={30} className={benefit.color} />
                </div>

                <div>
                  <h2 className="text-base font-extrabold">
                    {benefit.title}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-[#68766B]">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        {/* DECORATIVE WAVES */}
        <div className="pointer-events-none relative h-16 overflow-hidden sm:h-24">
          <svg
            viewBox="0 0 1440 130"
            preserveAspectRatio="none"
            className="absolute bottom-0 h-full w-full"
            aria-hidden="true"
          >
            <path
              d="M0 60 C200 150 350 20 550 80 C760 160 900 20 1100 70 C1260 110 1350 20 1440 50 V130 H0Z"
              fill="#F5D45D"
              opacity="0.8"
            />
            <path
              d="M0 80 C220 10 340 160 600 90 C850 20 1000 160 1440 65 V130 H0Z"
              fill="#7DBB5B"
              opacity="0.85"
            />
            <path
              d="M0 105 C280 50 420 160 720 95 C1000 35 1180 150 1440 90 V130 H0Z"
              fill="#3D9258"
              opacity="0.9"
            />
          </svg>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <section
        id="fitur"
        className="mx-auto max-w-[1500px] px-3 pb-14 pt-20 sm:px-6 lg:pb-24"
      >
        <div className="mx-auto mb-12 max-w-[750px] text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white bg-[#FFF3CB] px-5 py-2.5 text-sm font-bold shadow-[5px_5px_12px_#D7DCCF,-5px_-5px_12px_#FFFFFF]">
            <Sparkles size={17} className="text-[#D9A100]" />
            Ekosistem SAVORA
          </div>

          <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
            Satu Platform,
            <span className="text-[#DCA900]"> Banyak Manfaat</span>
          </h2>

          <p className="mt-5 text-base leading-7 text-[#627367]">
            SAVORA menghubungkan setiap pihak dalam rantai
            pemanfaatan surplus panen, dari petani hingga
            pengolah kompos dan mitra logistik.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.number}
                className="group relative overflow-hidden rounded-[32px] border-2 border-white bg-[#F8F6ED] p-7 shadow-[9px_9px_22px_#CDD5C8,-9px_-9px_22px_#FFFFFF] transition duration-300 hover:-translate-y-2 sm:p-9"
              >
                <span className="absolute right-7 top-5 text-6xl font-black text-[#E6E8DC]">
                  {feature.number}
                </span>

                <div
                  className={`relative z-10 mb-8 flex h-20 w-20 items-center justify-center rounded-[25px] border-2 border-white ${feature.color} shadow-[6px_6px_14px_#D9DDD2,-6px_-6px_14px_#FFFFFF]`}
                >
                  <Icon size={38} className="text-[#368C4F]" />
                </div>

                <h3 className="relative z-10 text-xl font-extrabold">
                  {feature.title}
                </h3>

                <p className="relative z-10 mt-4 text-sm leading-7 text-[#647468]">
                  {feature.description}
                </p>

                <Link
                  href="/onboarding"
                  className="relative z-10 mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#24814A] transition group-hover:gap-3"
                >
                  Pelajari lebih lanjut
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="mx-auto max-w-[1500px] px-3 pb-14 sm:px-6 lg:pb-20">
        <div className="relative overflow-hidden rounded-[35px] border-2 border-white bg-[#F8F6ED] px-6 py-12 text-center shadow-[9px_9px_24px_#CDD5C8,-9px_-9px_24px_#FFFFFF] sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#DCECBF] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-[#FFE79A] blur-3xl" />

          <div className="relative z-10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#E6F1DB] shadow-[inset_5px_5px_12px_#CBDCBC,inset_-5px_-5px_12px_#FFFFFF]">
              <Leaf size={31} className="text-[#36954F]" />
            </div>

            <h2 className="mx-auto max-w-[700px] text-3xl font-extrabold leading-tight sm:text-4xl">
              Saatnya Mengubah Surplus
              <span className="block text-[#DCA900]">
                Menjadi Peluang Baru
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-[580px] text-base leading-7 text-[#647468]">
              Bergabung bersama SAVORA dan mulai membangun
              ekosistem pemanfaatan hasil panen yang lebih
              bernilai dan berkelanjutan.
            </p>

            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-br from-[#45B574] to-[#086D43] px-9 py-4 font-bold text-white shadow-[6px_8px_17px_#BCCCB9] transition hover:-translate-y-1"
            >
              Bergabung Sekarang
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#D8DFD2] px-6 py-8 text-center text-sm text-[#68776B]">
        <p>
          © {new Date().getFullYear()} SAVORA — From Surplus to Value
        </p>
      </footer>
    </main>
  );
}
