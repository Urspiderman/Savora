
export type OnboardingSlide = {
  id: number;
  title: string;
  highlight: string;
  description: string;
  image: string;
  benefits: string[];
};

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: 1,
    title: "Ubah Surplus Panen Jadi",
    highlight: "Nilai Nyata",
    description:
      "SAVORA menghubungkan petani, pengolah kompos, dan mitra logistik dalam satu platform ekonomi sirkular.",
    image: "/images/onboarding/onboarding-1.webp",
    benefits: [
      "Kurangi Limbah",
      "Tambah Pendapatan",
      "Pertanian Berkelanjutan",
    ],
  },
  {
    id: 2,
    title: "Hubungkan Surplus dengan",
    highlight: "Peluang Pasar",
    description:
      "Petani dapat menawarkan surplus panen dan pengolah kompos dapat menemukan bahan organik yang sesuai kebutuhan.",
    image: "/images/onboarding/onboarding-2.webp",
    benefits: [
      "Tawarkan Surplus Panen",
      "Temukan Pembeli",
      "Transaksi Lebih Mudah",
    ],
  },
  {
    id: 3,
    title: "Bersama Membangun",
    highlight: "Masa Depan Hijau",
    description:
      "Hubungkan penjemputan dan pengiriman surplus panen agar dapat dimanfaatkan kembali menjadi kompos yang bernilai.",
    image: "/images/onboarding/onboarding-3.webp",
    benefits: [
      "Penjemputan Terkoordinasi",
      "Pengolahan Bahan Organik",
      "Dukung Ekonomi Sirkular",
    ],
  },
];
