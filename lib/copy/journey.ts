import type { Lang } from "@/components/LanguageProvider";

export type JourneyRegionKey =
  | "sunda"
  | "galuh"
  | "mataram"
  | "timur"
  | "kidul"
  | "kala";

interface JourneyCopy {
  opening: string;
  openingSub: string;
  regions: Record<JourneyRegionKey, { name: string; line: string }>;
}

export const journeyCopy = {
  en: {
    opening: "Follow the torn lontar east.",
    openingSub: "Desa Purwa falls behind you.",
    regions: {
      sunda: {
        name: "Tatar Sunda",
        line: "Bamboo whispers a name it shouldn't know.",
      },
      galuh: {
        name: "Keraton Galuh",
        line: "A throne of teak, and no king's name.",
      },
      mataram: {
        name: "Mataram",
        line: "A thousand temples, raised in one night.",
      },
      timur: {
        name: "Tanah Timur",
        line: "Ash on the wind. Fire with a face.",
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
    regions: {
      sunda: {
        name: "Tatar Sunda",
        line: "Bambu membisikkan nama yang tak semestinya ia tahu.",
      },
      galuh: {
        name: "Keraton Galuh",
        line: "Singgasana jati, tanpa nama seorang raja.",
      },
      mataram: {
        name: "Mataram",
        line: "Seribu candi, berdiri dalam semalam.",
      },
      timur: {
        name: "Tanah Timur",
        line: "Abu di angin. Api yang berwajah.",
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
