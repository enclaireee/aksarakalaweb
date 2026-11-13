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
    opening: "Explore a mythic Java.",
    openingSub: "Seven regions · 49 areas · one road east",
    more: "…plus Keraton Galuh, Tanah Timur and more to find.",
    regions: {
      sunda: {
        name: "Tatar Sunda",
        line: "Bamboo forests, highland villages, things in the trees.",
      },
      mataram: {
        name: "Mataram",
        line: "Temple ruins and royal roads.",
      },
      kidul: {
        name: "Segara Kidul",
        line: "Coastal cliffs and a sea that bites back.",
      },
      kala: {
        name: "Gua Kala",
        line: "The final dungeon.",
      },
    },
  },
  id: {
    opening: "Jelajahi Jawa yang mitis.",
    openingSub: "Tujuh wilayah · 49 area · satu jalan ke timur",
    more: "…ditambah Keraton Galuh, Tanah Timur, dan lainnya.",
    regions: {
      sunda: {
        name: "Tatar Sunda",
        line: "Hutan bambu, desa di dataran tinggi, sesuatu di balik pepohonan.",
      },
      mataram: {
        name: "Mataram",
        line: "Reruntuhan candi dan jalan para raja.",
      },
      kidul: {
        name: "Segara Kidul",
        line: "Tebing pantai dan laut yang menggigit.",
      },
      kala: {
        name: "Gua Kala",
        line: "Dungeon terakhir.",
      },
    },
  },
} satisfies Record<Lang, JourneyCopy>;
