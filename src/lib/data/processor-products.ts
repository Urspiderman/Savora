
export type ProcessorProduct = {
  id: string;
  name: string;
  category: "Sayuran" | "Buah" | "Umbi";
  image: string;
  farmer: string;
  location: string;
  price: number;
  stock: number;
  unit: "kg";
  condition: string;
  grade: string;
  description: string;
  minimumOrder: number;
  harvestDate: string;
  usage: string[];
};

export const PROCESSOR_PRODUCTS: ProcessorProduct[] = [
  {
    id: "demo-tomat",
    name: "Tomat Surplus",
    category: "Sayuran",
    image: "/images/farmer/tomato.webp",
    farmer: "Pak Ahmad",
    location: "Lubuklinggau",
    price: 3500,
    stock: 120,
    unit: "kg",
    condition: "Ukuran tidak seragam",
    grade: "Grade B",
    description:
      "Tomat hasil panen surplus dengan ukuran yang tidak seragam. Cocok dimanfaatkan sebagai bahan baku saus, sambal, dan produk olahan lainnya. Kondisi fisik perlu diperiksa sebelum digunakan.",
    minimumOrder: 5,
    harvestDate: "10 November 2026",
    usage: ["Saus tomat", "Sambal", "Olahan pangan"],
  },
  {
    id: "demo-wortel",
    name: "Wortel Segar",
    category: "Umbi",
    image: "/images/farmer/wortel.webp",
    farmer: "Bu Siti",
    location: "Musi Rawas",
    price: 4000,
    stock: 85,
    unit: "kg",
    condition: "Bentuk tidak sempurna",
    grade: "Grade B",
    description:
      "Wortel surplus dengan bentuk dan ukuran bervariasi. Dapat dimanfaatkan untuk berbagai produk olahan setelah melalui proses pemeriksaan dan pencucian.",
    minimumOrder: 5,
    harvestDate: "9 November 2026",
    usage: ["Jus sayuran", "Makanan olahan", "Bahan masakan"],
  },
  {
    id: "demo-pisang",
    name: "Pisang Matang",
    category: "Buah",
    image: "/images/farmer/banana.webp",
    farmer: "Pak Joko",
    location: "Lubuklinggau",
    price: 3000,
    stock: 150,
    unit: "kg",
    condition: "Matang, perlu segera diolah",
    grade: "Grade B",
    description:
      "Pisang surplus dengan tingkat kematangan tinggi. Cocok untuk usaha olahan pisang yang membutuhkan bahan baku matang.",
    minimumOrder: 5,
    harvestDate: "10 November 2026",
    usage: ["Keripik dan olahan pisang", "Kue", "Selai"],
  },
  {
    id: "demo-kentang",
    name: "Kentang Surplus",
    category: "Umbi",
    image: "/images/farmer/kentang.webp",
    farmer: "Bu Rina",
    location: "Musi Rawas",
    price: 5500,
    stock: 90,
    unit: "kg",
    condition: "Ukuran kecil",
    grade: "Grade B",
    description:
      "Kentang berukuran kecil yang dapat digunakan sebagai bahan baku industri makanan setelah dilakukan pemeriksaan mutu.",
    minimumOrder: 5,
    harvestDate: "8 November 2026",
    usage: ["Keripik kentang", "Kentang beku", "Olahan makanan"],
  },
  {
    id: "demo-kol",
    name: "Kubis Segar",
    category: "Sayuran",
    image: "/images/farmer/kol.webp",
    farmer: "Pak Bambang",
    location: "Lubuklinggau",
    price: 2500,
    stock: 200,
    unit: "kg",
    condition: "Daun luar kurang rapi",
    grade: "Grade B",
    description:
      "Kubis surplus dengan penampilan daun luar yang kurang seragam. Dapat dimanfaatkan sebagai bahan baku olahan setelah disortir.",
    minimumOrder: 5,
    harvestDate: "10 November 2026",
    usage: ["Sayuran olahan", "Acar", "Fermentasi"],
  },
  {
    id: "demo-terong",
    name: "Terong Ungu",
    category: "Sayuran",
    image: "/images/farmer/terong.webp",
    farmer: "Bu Dewi",
    location: "Musi Rawas",
    price: 3200,
    stock: 75,
    unit: "kg",
    condition: "Bentuk bervariasi",
    grade: "Grade B",
    description:
      "Terong ungu surplus dengan ukuran bervariasi. Cocok untuk kebutuhan usaha pengolahan makanan.",
    minimumOrder: 5,
    harvestDate: "9 November 2026",
    usage: ["Olahan terong", "Bahan masakan", "Produk siap masak"],
  },
  {
    id: "demo-cabai",
    name: "Cabai Merah",
    category: "Sayuran",
    image: "/images/farmer/cabai.webp",
    farmer: "Pak Hendra",
    location: "Lubuklinggau",
    price: 12000,
    stock: 45,
    unit: "kg",
    condition: "Ukuran tidak seragam",
    grade: "Grade B",
    description:
      "Cabai merah surplus dengan ukuran yang tidak seragam. Dapat dimanfaatkan untuk pengolahan sambal dan bumbu.",
    minimumOrder: 5,
    harvestDate: "10 November 2026",
    usage: ["Sambal", "Bumbu", "Cabai olahan"],
  },
  {
    id: "demo-jagung",
    name: "Jagung Surplus",
    category: "Sayuran",
    image: "/images/farmer/jagung.webp",
    farmer: "Bu Lilis",
    location: "Musi Rawas",
    price: 2800,
    stock: 180,
    unit: "kg",
    condition: "Tongkol berukuran kecil",
    grade: "Grade B",
    description:
      "Jagung surplus dengan ukuran tongkol kecil. Dapat dimanfaatkan untuk berbagai kebutuhan pengolahan sesuai kondisi bahan baku.",
    minimumOrder: 5,
    harvestDate: "8 November 2026",
    usage: ["Olahan jagung", "Pakan", "Bahan pangan"],
  },
];

export function getProcessorProduct(id: string) {
  return PROCESSOR_PRODUCTS.find((product) => product.id === id);
}

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
