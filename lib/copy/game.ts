import type { Lang } from "@/components/LanguageProvider";

interface GameCopy {
  /** Area banners, as the game shows them on entering an area. */
  region: string;
  forest: string;
  /** Captions, one per beat. */
  genre: string;
  genreSub: string;
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
    forest: "Leuweung",
    genre: "A top-down action RPG.",
    genreSub: "Scroll to walk",
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
    forest: "Leuweung",
    genre: "RPG aksi top-down.",
    genreSub: "Gulir untuk berjalan",
    fight: "Bertarung real-time.",
    fightSub: "Makhluk cerita rakyat, digambar piksel demi piksel",
    combo: "Rangkai kombo tiga pukulan.",
    dodge: "Baca ancang-ancangnya. Menghindar.",
    perfect: "Elakan sempurna berbuah balasan.",
    perfectSub: "Waktu melambat · serangan balikmu lebih keras",
    perfectPop: "Sempurna!",
  },
} satisfies Record<Lang, GameCopy>;
