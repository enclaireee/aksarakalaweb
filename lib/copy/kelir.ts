import type { Lang } from "@/components/LanguageProvider";

export const kelirCopy = {
  en: {
    place: "Desa Purwa · the night of the ruwatan",
    anchor: "A written name anchors a soul.",
    eats: "What nobody writes down, Kala eats.",
    out: "The lamp goes out.",
  },
  id: {
    place: "Desa Purwa · malam ruwatan",
    anchor: "Nama yang tertulis menambatkan jiwa.",
    eats: "Yang tak pernah dituliskan, dimakan Kala.",
    out: "Lampu padam.",
  },
} satisfies Record<Lang, unknown>;
