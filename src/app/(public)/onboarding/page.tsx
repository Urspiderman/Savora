
import type { Metadata } from "next";
import OnboardingSlides from "@/components/onboarding/OnboardingSlides";

export const metadata: Metadata = {
  title: "Mulai Jelajahi | SAVORA",
  description:
    "Kenali SAVORA, platform ekonomi sirkular yang menghubungkan petani, pengolah kompos, dan mitra logistik.",
};

export default function OnboardingPage() {
  return <OnboardingSlides />;
}
