import type { Lang } from "@/components/LanguageProvider";

export const forgottenCopy = {
  en: {
    speaker: "Ibu",
    ibuLine: "Laras? Who's Laras, child? It's always been the two of us.",
    cups: "Why are there always two cups?",
    name: "Laras",
    erased: "They erased her name from the world.",
    kaLine: "Ka. Ka. Ka. One more, so you don't forget me.",
    kaBy: "Laras, on the torn lontar",
  },
  id: {
    speaker: "Ibu",
    ibuLine: "Laras? Siapa Laras, Nak? Dari dulu cuma kita berdua.",
    cups: "Kenapa selalu dua cangkir?",
    name: "Laras",
    erased: "Namanya dihapus dari dunia.",
    kaLine: "Ka. Ka. Ka. Satu lagi, supaya Kakak tak lupa aku.",
    kaBy: "Laras, di lontar yang robek",
  },
} satisfies Record<Lang, unknown>;
