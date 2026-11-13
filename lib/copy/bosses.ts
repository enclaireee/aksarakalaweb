import type { Lang } from "@/components/LanguageProvider";

export type BossId =
  | "sandekala"
  | "bandung_bondowoso"
  | "buto_ijo"
  | "nameless_hunter";

export interface BossCopy {
  name: string;
  /** Tiny caption above the name (optional). */
  epithet?: string;
  /** The single line of dread. */
  line: string;
}

interface BossesCopy {
  horde: string;
  /** Closing line after the last boss. */
  more: string;
  bosses: Record<BossId, BossCopy>;
}

export const BOSSES_COPY = {
  en: {
    horde: "Every legend you were told is waiting.",
    more: "…and many more wait in the dark.",
    bosses: {
      sandekala: {
        name: "Sandekala",
        line: "Dusk has a shape. It is hungry.",
      },
      bandung_bondowoso: {
        name: "Bandung Bondowoso",
        line: "A thousand temples. One night. One refusal.",
      },
      buto_ijo: {
        name: "Buto Ijo",
        line: "He always collects what was promised.",
      },
      nameless_hunter: {
        name: "The Nameless Hunter",
        epithet: "Si Tanpa Ngaran",
        line: "“Wrong child. A better one.”",
      },
    },
  },
  id: {
    horde: "Semua legenda yang pernah diceritakan padamu, kini menanti.",
    more: "…dan masih banyak lagi yang menanti dalam gelap.",
    bosses: {
      sandekala: {
        name: "Sandekala",
        line: "Senja punya wujud. Dan ia lapar.",
      },
      bandung_bondowoso: {
        name: "Bandung Bondowoso",
        line: "Seribu candi. Satu malam. Satu penolakan.",
      },
      buto_ijo: {
        name: "Buto Ijo",
        line: "Ia selalu menagih apa yang dijanjikan.",
      },
      nameless_hunter: {
        name: "Si Tanpa Ngaran",
        epithet: "Pemburu Tanpa Nama",
        line: "“Anak yang salah. Tapi yang lebih baik.”",
      },
    },
  },
} satisfies Record<Lang, BossesCopy>;
