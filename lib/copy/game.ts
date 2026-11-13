import type { Lang } from "@/components/LanguageProvider";

export type FeatureId = "cast" | "combat" | "classes" | "world";

interface GameCopy {
  kicker: string;
  headline: string;
  premise: string;
  features: Record<FeatureId, { title: string; body: string }>;
  controls: [key: string, action: string][];
}

export const gameCopy = {
  en: {
    kicker: "Top-down pixel-art action RPG",
    headline: "Draw your spells. Fight the legends.",
    premise:
      "Explore a mythic Java and Sunda, battle creatures straight out of folklore, and cast magic by drawing real Javanese and Sundanese letters with your mouse.",
    features: {
      cast: {
        title: "Draw to cast",
        body: "Hold to slow time, trace an aksara, release. Bolt, burst, ward, heal and more.",
      },
      combat: {
        title: "Real-time combat",
        body: "Three-hit combos, dodge rolls with i-frames, and perfect dodges that pay you back.",
      },
      classes: {
        title: "Eight classes",
        body: "From the kelewang vanguard to the shadow-puppet dalang. Each one fights its own way.",
      },
      world: {
        title: "Seven regions",
        body: "49 areas to explore, from rice-field villages to the jaws of Gua Kala.",
      },
    },
    controls: [
      ["WASD", "Move"],
      ["LMB", "Attack"],
      ["RMB", "Draw a spell"],
      ["Space", "Dodge"],
    ],
  },
  id: {
    kicker: "RPG aksi pixel-art top-down",
    headline: "Goreskan mantramu. Lawan para legenda.",
    premise:
      "Jelajahi Jawa dan Sunda yang mitis, lawan makhluk-makhluk dari cerita rakyat, dan rapalkan sihir dengan menggambar aksara Jawa dan Sunda memakai mouse.",
    features: {
      cast: {
        title: "Gambar untuk merapal",
        body: "Tahan untuk memperlambat waktu, goreskan aksara, lepaskan. Sambaran, ledakan, tameng, penyembuh, dan lainnya.",
      },
      combat: {
        title: "Pertarungan real-time",
        body: "Kombo tiga pukulan, guling menghindar dengan i-frame, dan elakan sempurna yang berbuah hadiah.",
      },
      classes: {
        title: "Delapan kelas",
        body: "Dari hulubalang berkelewang sampai dalang pemain bayangan. Tiap kelas bertarung dengan caranya sendiri.",
      },
      world: {
        title: "Tujuh wilayah",
        body: "49 area untuk dijelajahi, dari desa sawah sampai mulut Gua Kala.",
      },
    },
    controls: [
      ["WASD", "Gerak"],
      ["LMB", "Serang"],
      ["RMB", "Gambar mantra"],
      ["Space", "Menghindar"],
    ],
  },
} satisfies Record<Lang, GameCopy>;
