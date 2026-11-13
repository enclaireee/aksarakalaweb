import type { Lang } from "@/components/LanguageProvider";

interface GameCopy {
  /** Area banners, as the game shows them on entering an area. */
  region: string;
  town: string;
  forest: string;
  /** Captions, one per beat. */
  genre: string;
  genreSub: string;
  explore: string;
  exploreSub: string;
  fight: string;
  fightSub: string;
  combo: string;
  dodge: string;
  perfect: string;
  perfectSub: string;
  /** In-game key prompts. */
  perfectPop: string;
}

export const gameCopy = {
  en: {
    region: "Tatar Sunda",
    town: "Kampung",
    forest: "Leuweung",
    genre: "A top-down action RPG.",
    genreSub: "Scroll to walk",
    explore: "Explore a mythic Java.",
    exploreSub: "7 regions · 49 areas · villages, forests, temples, the southern sea",
    fight: "Fight in real time.",
    fightSub: "Folklore monsters, hand-drawn in pixels",
    combo: "Chain three-hit combos.",
    dodge: "Read the wind-up. Dodge.",
    perfect: "Perfect dodges pay you back.",
    perfectSub: "Time slows · your counter hits harder",
    perfectPop: "Perfect!",
  },
  id: {
    region: "Tatar Sunda",
    town: "Kampung",
    forest: "Leuweung",
    genre: "RPG aksi top-down.",
    genreSub: "Gulir untuk berjalan",
    explore: "Jelajahi Jawa yang mitis.",
    exploreSub: "7 wilayah · 49 area · desa, hutan, candi, laut selatan",
    fight: "Bertarung real-time.",
    fightSub: "Makhluk cerita rakyat, digambar piksel demi piksel",
    combo: "Rangkai kombo tiga pukulan.",
    dodge: "Baca ancang-ancangnya. Menghindar.",
    perfect: "Elakan sempurna berbuah balasan.",
    perfectSub: "Waktu melambat · serangan balikmu lebih keras",
    perfectPop: "Sempurna!",
  },
} satisfies Record<Lang, GameCopy>;
