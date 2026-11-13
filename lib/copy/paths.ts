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
  /** How each class fights, from the game's own role strings. */
  roles: Record<ClassId, string>;
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
    headline: "Eight classes. Pick how you fight.",
    titles: TITLES,
    roles: {
      warrior: "Vanguard",
      lancer: "Spearman",
      archer: "Bowman",
      herder: "Slinger",
      rogue: "Silat fighter",
      dancer: "Fan dancer",
      mage: "Scribe-sage",
      dalang: "Puppeteer",
    },
  },
  id: {
    headline: "Delapan kelas. Pilih caramu bertarung.",
    titles: TITLES,
    roles: {
      warrior: "Garda depan",
      lancer: "Penombak",
      archer: "Pemanah",
      herder: "Pengumban",
      rogue: "Pesilat",
      dancer: "Penari kipas",
      mage: "Resi penulis",
      dalang: "Juru wayang",
    },
  },
} satisfies Record<Lang, PathsCopy>;
