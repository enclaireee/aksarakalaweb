import type { Lang } from "@/components/LanguageProvider";

export type JourneyRegionKey =
  | "sunda"
  | "mataram"
  | "kidul"
  | "kala";

interface JourneyCopy {
  opening: string;
  openingSub: string;
  /** Shown on the last stretch before Gua Kala. */
  more: string;
  regions: Record<JourneyRegionKey, { name: string; line: string }>;
}

export const journeyCopy = {
  en: {
    opening: "Follow the torn lontar east.",
    openingSub: "Desa Purwa falls behind you.",
    more: "…and many more lands between here and the Maw.",
    regions: {
      sunda: {
        name: "Tatar Sunda",
        line: "Bamboo whispers a name it shouldn't know.",
      },
      mataram: {
        name: "Mataram",
        line: "A thousand temples, raised in one night.",
      },
      kidul: {
        name: "Segara Kidul",
        line: "The sea does not forget.",
      },
      kala: {
        name: "Gua Kala",
        line: "Here, time comes to feed.",
      },
    },
  },
  id: {
    opening: "Ikuti sobekan lontar itu ke timur.",
    openingSub: "Desa Purwa tertinggal di belakangmu.",
    more: "…dan masih banyak negeri lain sebelum Gua Kala.",
    regions: {
      sunda: {
        name: "Tatar Sunda",
        line: "Bambu membisikkan nama yang tak semestinya ia tahu.",
      },
      mataram: {
        name: "Mataram",
        line: "Seribu candi, berdiri dalam semalam.",
      },
      kidul: {
        name: "Segara Kidul",
        line: "Laut tidak pernah lupa.",
      },
      kala: {
        name: "Gua Kala",
        line: "Di sini, waktu datang untuk makan.",
      },
    },
  },
} satisfies Record<Lang, JourneyCopy>;
