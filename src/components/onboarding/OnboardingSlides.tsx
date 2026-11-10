
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Leaf,
  TrendingUp,
  Recycle,
  Store,
  PackageCheck,
  Truck,
  Sprout,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { onboardingSlides } from "@/config/onboarding";

const icons = [
  [Leaf, TrendingUp, Recycle],
  [Sprout, Store, CheckCircle2],
  [Truck, PackageCheck, Recycle],
];

const softShadow =
  "shadow-[7px_7px_17px_#DDDCD0,-7px_-7px_17px_#FFFFFF]";

export default function OnboardingSlides() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  const slide = onboardingSlides[current];
  const isFirst = current === 0;
  const isLast = current === onboardingSlides.length - 1;

  function next() {
    if (isLast) {
      router.push("/register");
    } else {
      setCurrent((prev) => prev + 1);
    }
  }

  function previous() {
    setCurrent((prev) => Math.max(prev - 1, 0));
  }

  return (
    <main className="flex min-h-dvh items-center justify-center overflow-x-hidden bg-[#E9EDE3] p-3 text-[#20563A] sm:p-6 lg:p-8">
      <div className="relative flex min-h-[calc(100dvh-24px)] w-full max-w-[1450px] flex-col overflow-hidden rounded-[32px] border-[3px] border-white/90 bg-[#F8F6ED] shadow-[18px_18px_45px_#C8D1C4,-18px_-18px_45px_#FFFFFF] sm:rounded-[48px] lg:min-h-[min(860px,94dvh)]">

        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-28 -top-32 h-80 w-96 rounded-full bg-[#FFE17C]/65 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#A5D87B]/45 blur-3xl" />

        <Leaf className="pointer-events-none absolute left-[3%] top-[20%] rotate-[-35deg] text-[#8FC449]/70" size={43} />
        <Leaf className="pointer-events-none absolute right-[4%] top-[30%] rotate-[35deg] text-[#91C652]/70" size={32} />
        <Sparkles className="pointer-events-none absolute right-[7%] bottom-[22%] text-[#E5B51E]" size={27} />

        {/* Header */}
        <header className="relative z-20 flex items-center justify-between gap-4 px-5 py-6 sm:px-10 lg:px-16 lg:py-9">
          <Image
            src="/images/logo/logo.png"
            alt="SAVORA"
            width={260}
            height={100}
            priority
            className="h-auto w-[145px] object-contain sm:w-[185px] lg:w-[230px]"
          />

          <button
            type="button"
            onClick={() => router.push("/login")}
            className={`flex items-center gap-2 rounded-full border-2 border-white bg-[#F8F6ED] px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 sm:px-7 ${softShadow}`}
          >
            Lewati
            <ArrowRight size={19} />
          </button>
        </header>

        {/* Main */}
        <section className="relative z-10 grid flex-1 items-center gap-6 px-5 pb-6 pt-4 sm:px-10 lg:grid-cols-2 lg:gap-12 lg:px-16 lg:py-10">

          {/* Left illustration */}
          <div className="relative flex items-center justify-center py-5 lg:py-0">
            <div className="pointer-events-none absolute h-[85%] w-[85%] rounded-full border-[20px] border-[#E7EFD9]/80" />
            <div className="pointer-events-none absolute h-[73%] w-[73%] rounded-full border-2 border-dashed border-[#B7D59D]" />

            <div className="relative flex aspect-square w-full max-w-[340px] items-center justify-center rounded-full border-2 border-white bg-[#F8F6ED] shadow-[inset_12px_12px_28px_#E1E1D6,inset_-12px_-12px_28px_#FFFFFF] sm:max-w-[450px] lg:max-w-[550px]">
              <Image
                key={slide.image}
                src={slide.image}
                alt={`Ilustrasi ${slide.highlight}`}
                width={720}
                height={720}
                priority={current === 0}
                className="relative z-10 h-auto w-full animate-[savoraFade_0.45s_ease-out] object-contain drop-shadow-[0_16px_18px_rgba(50,80,40,0.12)]"
              />
            </div>

            {/* Floating labels */}
            <div className={`absolute right-0 top-[12%] hidden items-center gap-2 rounded-2xl border-2 border-white bg-[#F8F6ED] px-3 py-2.5 sm:flex ${softShadow}`}>
              <Truck size={22} className="text-[#318A4D]" />
              <span className="text-xs font-bold">Smart Logistics</span>
            </div>

            <div className={`absolute bottom-[12%] left-0 hidden items-center gap-2 rounded-2xl border-2 border-white bg-[#FFF5D3] px-3 py-2.5 sm:flex ${softShadow}`}>
              <Sprout size={22} className="text-[#5C9F38]" />
              <span className="text-xs font-bold">Circular Farming</span>
            </div>
          </div>

          {/* Right content */}
          <div
            key={slide.id}
            className="flex flex-col items-center text-center animate-[savoraFade_0.45s_ease-out] lg:items-start lg:text-left"
          >
            {/* Progress */}
            <div className="mb-7 flex items-center gap-3">
              {onboardingSlides.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrent(index)}
                  aria-label={`Slide ${index + 1}`}
                  aria-current={index === current ? "step" : undefined}
                  className={`h-3.5 rounded-full transition-all duration-300 ${
                    current === index
                      ? "w-12 bg-gradient-to-r from-[#18814D] to-[#4BB56C] shadow-[3px_4px_8px_#B6C9B4]"
                      : "w-4 bg-[#E0DED2] shadow-[inset_2px_2px_4px_#CECDC2]"
                  }`}
                />
              ))}
            </div>

            {/* Heading */}
            <h1 className="max-w-[650px] text-[30px] font-extrabold leading-[1.18] tracking-tight sm:text-[40px] lg:text-[48px] xl:text-[55px]">
              {slide.title}
              <span className="mt-3 block">
                <span className="inline-block rounded-[22px] border border-[#FFE38A] bg-gradient-to-br from-[#FFF2AD] to-[#FFD85D] px-4 py-2 text-[#8C5B0B] shadow-[5px_7px_14px_#E1D3A5,-4px_-4px_12px_#FFFFFF]">
                  {slide.highlight}
                </span>
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-[550px] text-base leading-8 text-[#637068] sm:text-lg">
              {slide.description}
            </p>

            {/* Benefits */}
            <div className="mt-8 flex w-full max-w-[510px] flex-col gap-4">
              {slide.benefits.map((benefit, index) => {
                const Icon = icons[current][index];

                return (
                  <div
                    key={benefit}
                    className={`flex items-center gap-4 rounded-full border-2 border-white bg-[#F8F6ED] px-4 py-3 text-left ${softShadow}`}
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white shadow-[4px_4px_9px_#DEDCD0,-4px_-4px_9px_#FFFFFF] ${
                      index === 1 ? "bg-[#FFF1C6]" : "bg-[#E9F3DF]"
                    }`}>
                      <Icon
                        size={23}
                        className={index === 1 ? "text-[#E4AD13]" : "text-[#5BA43D]"}
                      />
                    </div>

                    <span className="text-sm font-bold sm:text-base">
                      {benefit}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Navigation */}
        <div className="relative z-20 flex items-center justify-between gap-3 px-5 pb-10 pt-8 sm:px-10 lg:px-16 lg:pb-14">
          <button
            type="button"
            onClick={previous}
            disabled={isFirst}
            className={`inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border-2 border-white bg-[#F8F6ED] px-5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40 sm:px-8 sm:text-base ${softShadow}`}
          >
            <ArrowLeft size={19} />
            Kembali
          </button>

          <span className="text-sm font-bold tabular-nums text-[#607164] sm:text-lg">
            {current + 1} / {onboardingSlides.length}
          </span>

          <button
            type="button"
            onClick={next}
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-[#278B54] bg-gradient-to-br from-[#49B978] to-[#087044] px-5 text-sm font-bold text-white shadow-[6px_8px_16px_#B5C7B4] transition hover:brightness-110 active:scale-[0.98] sm:px-9 sm:text-base"
          >
            {isLast ? "Mulai Sekarang" : "Lanjut"}
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Decorative waves */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 overflow-hidden opacity-75">
          <svg
            viewBox="0 0 1440 90"
            preserveAspectRatio="none"
            className="h-full w-full"
            aria-hidden="true"
          >
            <path
              d="M0 20 C240 100 430 0 720 50 C960 100 1170 0 1440 25 V90 H0Z"
              fill="#F6D76A"
            />
            <path
              d="M0 48 C230 0 450 100 720 55 C1010 5 1230 90 1440 35 V90 H0Z"
              fill="#83BC5A"
            />
          </svg>
        </div>

        <style jsx global>{`
          @keyframes savoraFade {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .animate-\[savoraFade_0\.45s_ease-out\] {
              animation: none !important;
            }
          }
        `}</style>
      </div>
    </main>
  );
}
