import type { Lang } from "@/components/LanguageProvider";

export type ClassId =
  | "warrior"
  | "lancer"
  | "archer"
  | "herder"
  | "rogue"
  | "dancer"
  | "mage"
  | "dalang";

interface PathsCopy {
  headline: string;
  /** In-game class titles (the same words in both languages). */
  titles: Record<ClassId, string>;
}

const TITLES: Record<ClassId, string> = {
  warrior: "Hulubalang",
  lancer: "Prajurit",
  archer: "Pamanah",
  herder: "Pangangon",
  rogue: "Pendekar",
  dancer: "Penari Topeng",
  mage: "Wiku",
  dalang: "Dalang",
};

export const PATHS_COPY = {
  en: {
    headline: "Eight paths. One name worth saving.",
    titles: TITLES,
  },
  id: {
    headline: "Delapan jalan. Satu nama yang layak diselamatkan.",
    titles: TITLES,
  },
} satisfies Record<Lang, PathsCopy>;
