
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
  variant: "login" | "register";
};

export default function AuthShell({
  children,
  variant,
}: AuthShellProps) {
  const isLogin = variant === "login";

  return (
    <main className="relative flex min-h-dvh items-start justify-center overflow-x-hidden bg-[#F8F6ED] px-0 py-0 text-[#164A32] sm:items-center sm:px-6 sm:py-5 lg:py-8">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#F5C842]/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[#A6D87C]/20 blur-3xl" />

      <div className="relative grid w-full max-w-[1180px] overflow-hidden border-0 bg-[#F8F6ED] shadow-none sm:rounded-[34px] sm:border sm:border-white sm:shadow-[12px_12px_32px_#dedbd0,-12px_-12px_32px_#ffffff] lg:min-h-[690px] lg:grid-cols-[0.94fr_1.06fr] lg:rounded-[34px] lg:border lg:border-white lg:shadow-[12px_12px_32px_#dedbd0,-12px_-12px_32px_#ffffff]">

        {/* PANEL ILUSTRASI DESKTOP - TIDAK DIUBAH */}
        <aside className="relative hidden min-h-[690px] overflow-hidden bg-[#EDF2DF] lg:block">
          <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-[#F5C842]/75" />
          <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#B9D98A]" />

          <Link href="/" className="absolute left-8 top-8 z-20">
            <Image
              src="/images/logo/logo.png"
              alt="Logo SAVORA"
              width={200}
              height={80}
              className="h-auto w-[185px] object-contain"
              priority
            />
          </Link>

          <div className="absolute inset-x-0 bottom-[110px] top-[110px] z-10 flex items-center justify-center px-4">
            <Image
              src={
                isLogin
                  ? "/images/onboarding/onboarding-1.webp"
                  : "/images/onboarding/onboarding-3.webp"
              }
              alt={
                isLogin
                  ? "Ilustrasi petani dan surplus panen SAVORA"
                  : "Ilustrasi ekonomi sirkular SAVORA"
              }
              width={650}
              height={650}
              className="h-full w-full object-contain"
              priority
            />
          </div>

          <div className="absolute -bottom-28 -left-16 z-0 h-52 w-[120%] rotate-[-8deg] rounded-[50%] bg-[#A4D566]" />
          <div className="absolute -bottom-36 left-0 z-0 h-52 w-[120%] rotate-[8deg] rounded-[50%] bg-[#F5C842]" />
        </aside>

        {/* FORM */}
        <section className="relative flex min-w-0 flex-col justify-center px-5 pb-9 pt-5 min-[390px]:px-7 sm:px-10 sm:py-12 lg:px-14">

          {/* HEADER MOBILE */}
          <div className="mb-5 flex flex-col items-center lg:hidden">
            <Link href="/" className="inline-flex items-center justify-center">
              <Image
                src="/images/logo/logo.png"
                alt="Logo SAVORA"
                width={200}
                height={80}
                className="h-auto w-[145px] object-contain sm:w-[175px]"
                priority
              />
            </Link>

            <div className="mt-3 flex items-center gap-2 rounded-full border border-[#DDE8CF] bg-[#EDF4E3] px-3 py-1.5 text-[10px] font-bold tracking-wide text-[#39844E] sm:hidden">
              <span className="h-1.5 w-1.5 rounded-full bg-[#49B76D]" />
              PANGAN BERKELANJUTAN
            </div>
          </div>

          {/* ILUSTRASI MOBILE RINGKAS */}
          <div className="relative mx-auto mb-5 flex h-[112px] w-full max-w-[340px] items-center justify-center overflow-hidden rounded-[22px] bg-[#EDF2DF] sm:mb-6 sm:h-[160px] sm:max-w-[290px] sm:rounded-[26px] sm:shadow-[inset_4px_4px_10px_#dbe2d2,inset_-4px_-4px_10px_#ffffff] lg:hidden">
            <div className="absolute -left-8 -top-12 h-24 w-24 rounded-full bg-[#F5C842]/45" />
            <div className="absolute -right-8 -bottom-12 h-24 w-24 rounded-full bg-[#A6D87C]/50" />

            <Image
              src={
                isLogin
                  ? "/images/onboarding/onboarding-1.webp"
                  : "/images/onboarding/onboarding-3.webp"
              }
              alt="Ilustrasi SAVORA"
              width={300}
              height={200}
              className="relative z-10 h-full w-full object-contain"
            />
          </div>

          {children}
        </section>
      </div>
    </main>
  );
}
